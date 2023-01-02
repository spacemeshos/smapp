import path from 'path';
import os from 'os';
import fs from 'fs';
import { ChildProcess } from 'node:child_process';
import fse from 'fs-extra';
import { spawn } from 'cross-spawn';
import { app, ipcMain, BrowserWindow, dialog } from 'electron';
import { debounce } from 'throttle-debounce';

import { rotator } from 'logrotator';
import { captureException } from '@sentry/electron';
import { ipcConsts } from '../app/vars';
import { delay } from '../shared/utils';
import {
  NodeError,
  NodeErrorLevel,
  NodeStatus,
  PostSetupOpts,
  PublicService,
  SocketAddress,
} from '../shared/types';
import StoreService from './storeService';
import Logger from './logger';
import NodeService, {
  ErrorStreamHandler,
  StatusStreamHandler,
} from './NodeService';
import SmesherManager from './SmesherManager';
import {
  checksum,
  createDebouncePool,
  getSpawnErrorReason,
  isEmptyDir,
  isFileExists,
} from './utils';
import { NODE_CONFIG_FILE } from './main/constants';
import NodeConfig from './main/NodeConfig';
import { getNodeLogsPath, readLinesFromBottom } from './main/utils';
import { generateGenesisIDFromConfig } from './main/Networks';

rotator.on('error', captureException);

const logger = Logger({ className: 'NodeManager' });

const osTargetNames = {
  Darwin: 'mac',
  Linux: 'linux',
  Windows_NT: 'windows',
};

const PROCESS_EXIT_TIMEOUT = 20000; // 20 sec
const PROCESS_EXIT_CHECK_INTERVAL = 1000; // Check does the process exited

const defaultCrashError = (error?: Error): NodeError => ({
  msg:
    "The Spacemesh node software has unexpectedly quit. Click on 'restart node' to start it.",
  stackTrace: error?.stack || '',
  level: NodeErrorLevel.LOG_LEVEL_FATAL,
  module: 'NodeManager',
});

type PoolNodeError = { type: 'NodeError'; error: NodeError };
type PoolExitCode = {
  type: 'Exit';
  code: number | null;
  signal: NodeJS.Signals | null;
};
type ErrorPoolObject = PoolNodeError | PoolExitCode;

export enum SmeshingSetupState {
  Failed = 0,
  ViaAPI = 1,
  ViaRestart = 2,
}

class NodeManager {
  private readonly mainWindow: BrowserWindow;

  private nodeService: NodeService;

  private smesherManager: SmesherManager;

  private nodeProcess: ChildProcess | null;

  private genesisID: string;

  private pushToErrorPool = createDebouncePool<ErrorPoolObject>(
    100,
    async (poolList) => {
      const exitError = poolList.find((e) => e.type === 'Exit') as
        | PoolExitCode
        | undefined;
      // In case if Node exited with 0 code count that
      // there was no errors and do not notify client about any of
      // possible errors caused by exiting
      if (exitError && exitError.code === 0) return;
      // If pool have some errors, but Node is not closed —
      // find a most critical within the pool and notify the client about it
      // Checking for `!exitError` is needed to avoid showing some fatal errors
      // that are consequence of Node crash
      // E.G. SIGKILL of Node will also produce a bunch of GRPC errors
      const errors = poolList.filter(
        (a) => a.type === 'NodeError'
      ) as PoolNodeError[];
      if (errors.length > 0) {
        const mostCriticalError = errors.sort(
          (a, b) => b.error.level - a.error.level
        )[0].error;
        this.sendNodeError(mostCriticalError);
        return;
      }
      // Otherwise if Node exited, but there are no critical errors
      // in the pool — search for fatal error in the logs
      const lastLines = await readLinesFromBottom(
        getNodeLogsPath(this.genesisID),
        100
      );
      const fatalErrorLine = lastLines.find((line) =>
        /^\{"L":"FATAL",.+\}$/.test(line)
      );
      if (!fatalErrorLine) {
        // If we can't find fatal error — show default crash error
        this.sendNodeError(defaultCrashError());
        return;
      }
      // If we found fatal error — parse it and convert to NodeError
      try {
        const json = JSON.parse(fatalErrorLine);
        const fatalError = {
          msg: json.errmsg || json.M,
          level: NodeErrorLevel.LOG_LEVEL_FATAL,
          module: 'NodeManager',
          stackTrace: '',
        };
        this.sendNodeError(fatalError);
      } catch (err) {
        // If we can't parse it — show default error message
        this.sendNodeError(defaultCrashError(err as Error));
      }
    }
  );

  private unsub = () => {};

  constructor(
    mainWindow: BrowserWindow,
    genesisID: string,
    smesherManager: SmesherManager
  ) {
    this.mainWindow = mainWindow;
    this.nodeService = new NodeService();
    this.unsub = this.subscribeToEvents();
    this.nodeProcess = null;
    this.smesherManager = smesherManager;
    this.genesisID = genesisID;
  }

  // Before deleting
  unsubscribe = () => {
    this.stopNode();
    this.nodeService.cancelStreams();
    this.unsub();
  };

  getGenesisID = () => this.genesisID;

  subscribeToEvents = () => {
    // Handlers
    const getVersionAndBuild = () =>
      this.getVersionAndBuild()
        .then((payload) =>
          this.mainWindow.webContents.send(
            ipcConsts.N_M_GET_VERSION_AND_BUILD,
            payload
          )
        )
        .catch((error) => this.pushNodeError(error));
    const setNodePort = (_event, request) => {
      StoreService.set('node.port', request.port);
    };
    const promptChangeDir = async () => {
      const oldPath = StoreService.get('node.dataPath');
      const prompt = await dialog.showOpenDialog(this.mainWindow, {
        title: 'Choose new directory for Mesh database',
        defaultPath: oldPath,
        buttonLabel: 'Switch',
        properties: ['createDirectory', 'openDirectory', 'promptToCreate'],
      });
      if (prompt.canceled) return false;
      const newPath = prompt.filePaths[0];
      if (oldPath === newPath) return true;
      // Validate new dir
      await fse.ensureDir(newPath);
      if (!(await isEmptyDir(newPath))) {
        throw new Error(
          `Can not switch Node Data directory: ${newPath} is not empty`
        );
      }
      // Stop the Node
      await this.stopNode();
      // Move old data to new place if needed
      if (!(await isEmptyDir(oldPath)))
        await fse.move(oldPath, newPath, { overwrite: true });
      // Update persistent store
      StoreService.set('node.dataPath', newPath);
      // Start the Node
      return this.startNode();
    };
    // Subscriptions
    ipcMain.on(ipcConsts.N_M_GET_VERSION_AND_BUILD, getVersionAndBuild);
    ipcMain.on(ipcConsts.SET_NODE_PORT, setNodePort);
    ipcMain.handle(ipcConsts.PROMPT_CHANGE_DATADIR, promptChangeDir);
    // Unsub
    return () => {
      ipcMain.removeListener(
        ipcConsts.N_M_GET_VERSION_AND_BUILD,
        getVersionAndBuild
      );
      ipcMain.removeListener(ipcConsts.SET_NODE_PORT, setNodePort);
      ipcMain.removeHandler(ipcConsts.N_M_RESTART_NODE);
      ipcMain.removeHandler(ipcConsts.PROMPT_CHANGE_DATADIR);
    };
  };

  isNodeAlive = async (retries: number): Promise<boolean> => {
    if (!this.isNodeRunning()) {
      return false;
    }
    const isReady = await this.nodeService.echo();
    if (isReady) {
      return true;
    } else if (retries > 0) {
      await delay(500);
      return this.isNodeAlive(retries - 1);
    } else {
      return false;
    }
  };

  isNodeRunning = () => {
    return this.nodeProcess && this.nodeProcess.exitCode === null;
  };

  connectToRemoteNode = async (apiUrl?: SocketAddress | PublicService) => {
    this.nodeService.cancelStatusStream();
    this.nodeService.cancelErrorStream();
    this.smesherManager.unsubscribe();
    await this.stopNode();

    this.nodeService.createService(apiUrl);
    const success = await this.updateNodeStatus();
    if (success) {
      // and activate streams
      this.activateNodeStatusStream();
      this.activateNodeErrorStream();
      return true;
    } else {
      this.pushNodeError({
        msg: 'Remote API is not responding',
        stackTrace: '',
        module: 'NodeManager',
        level: NodeErrorLevel.LOG_LEVEL_FATAL,
      });
      return false;
    }
  };

  startNode = async () => {
    if (this.isNodeRunning()) return true;
    await this.spawnNode();
    this.nodeService.createService();
    const success = await this.isNodeAlive(30); // 15 sec timeout
    if (success) {
      // update node status once by query request
      await this.updateNodeStatus();
      // ensure there are no active streams left
      this.nodeService.cancelStatusStream();
      this.nodeService.cancelErrorStream();
      // and activate streams
      this.activateNodeStatusStream();
      this.activateNodeErrorStream();
      // and then call method to update renderer data
      // TODO: move into `sources/smesherInfo` module
      await this.smesherManager.serviceStartupFlow();
      return true;
    } else {
      this.pushNodeError({
        msg: 'Node Service does not respond. Probably Node is down',
        stackTrace: '',
        module: 'NodeManager',
        level: NodeErrorLevel.LOG_LEVEL_FATAL,
      });
      return false;
    }
  };

  updateNodeStatus = async () => {
    // wait for status response
    const status = await this.getNodeStatus(5);
    // update node status
    this.sendNodeStatus(status);
    return true;
  };

  //
  startSmeshing = async (postSetupOpts: PostSetupOpts) => {
    if (!postSetupOpts.dataDir) {
      throw new Error(
        'Can not setup Smeshing without specified data directory'
      );
    }

    if (!this.isNodeRunning()) {
      await this.startNode();
    }

    // Temporary solution of https://github.com/spacemeshos/smapp/issues/823
    const CURRENT_DATADIR_PATH = await this.smesherManager.getCurrentDataDir();
    const CURRENT_KEYBIN_PATH = path.resolve(CURRENT_DATADIR_PATH, 'key.bin');
    const NEXT_KEYBIN_PATH = path.resolve(postSetupOpts.dataDir, 'key.bin');

    const isDefaultKeyFileExist = await isFileExists(CURRENT_KEYBIN_PATH);
    const isDataDirKeyFileExist = await isFileExists(NEXT_KEYBIN_PATH);
    const isSameDataDir = CURRENT_DATADIR_PATH === postSetupOpts?.dataDir;

    const startSmeshingAsUsual = async (opts) => {
      // Next two lines is a normal workflow.
      // It can be moved back to SmesherManager when issue
      // https://github.com/spacemeshos/go-spacemesh/issues/2858
      // will be solved, and all these kludges can be removed.
      await this.smesherManager.updateSmeshingConfig(opts);
      await this.smesherManager.startSmeshing(opts);
      return SmeshingSetupState.ViaAPI;
    };

    // If post data-dir does not changed and it contains key.bin file
    // assume that everything is fine and start smeshing as usual
    if (isSameDataDir && isDataDirKeyFileExist)
      return startSmeshingAsUsual(postSetupOpts);

    /**
     * In other cases:
     * NextDataDir        CurrentDataDir        Action
     * Not exist          Copy                  key.bin & start
     * Not exist          Update                config & restart node
     * Exist              Not exist             Update config & restart node
     * Exist              Compare checksum
                                      - if equal: start as usual
                                      - if not: update config & restart node */
    if (isDefaultKeyFileExist && !isDataDirKeyFileExist) {
      await fs.promises.copyFile(CURRENT_KEYBIN_PATH, NEXT_KEYBIN_PATH);
      return startSmeshingAsUsual(postSetupOpts);
    } else if (isDefaultKeyFileExist && isDataDirKeyFileExist) {
      const defChecksum = await checksum(CURRENT_KEYBIN_PATH);
      const dataChecksum = await checksum(NEXT_KEYBIN_PATH);
      if (defChecksum === dataChecksum) {
        return startSmeshingAsUsual(postSetupOpts);
      }
    }
    // In other cases — update config first and then restart the node
    // it will start Smeshing automatically based on the config
    await this.smesherManager.updateSmeshingConfig(postSetupOpts);
    await this.restartNode();
    return SmeshingSetupState.ViaRestart;
  };

  private spawnNode = async () => {
    if (this.isNodeRunning()) return;
    const nodeDir = path.resolve(
      app.getAppPath(),
      process.env.NODE_ENV === 'development'
        ? `../node/${osTargetNames[os.type()]}/`
        : '../../node/'
    );
    const nodePath = path.resolve(
      nodeDir,
      `go-spacemesh${osTargetNames[os.type()] === 'windows' ? '.exe' : ''}`
    );
    const nodeDataFilesPath = path.join(
      StoreService.get('node.dataPath'),
      this.genesisID.substring(0, 8)
    );
    const nodeConfig = await NodeConfig.load();
    const logFilePath = getNodeLogsPath(
      generateGenesisIDFromConfig(nodeConfig)
    );

    rotator.register(logFilePath, {
      schedule: '30m',
      size: '500m',
      count: 1, // number of old logs files that ll be saved and compressed
    });

    const logFileStream = fs.createWriteStream(logFilePath, {
      flags: 'a',
      encoding: 'utf-8',
    });
    const args = ['--config', NODE_CONFIG_FILE, '-d', nodeDataFilesPath];

    logger.log('startNode', 'spawning node', [nodePath, ...args]);

    const transformNodeError = (error: any) => {
      if (error?.code && error?.syscall?.startsWith('spawn')) {
        const reason = getSpawnErrorReason(error);
        return {
          msg: 'Cannot spawn the Node process'.concat(reason),
          level: NodeErrorLevel.LOG_LEVEL_SYSERROR,
          module: 'NodeManager',
          stackTrace: JSON.stringify(error),
        };
      }
      return defaultCrashError(error);
    };

    try {
      this.nodeProcess = spawn(nodePath, args, { cwd: nodeDir });
    } catch (err) {
      this.nodeProcess = null;
      logger.error('spawnNode: can not spawn process', err);
      const error = transformNodeError(err);
      this.pushNodeError(error);
      return;
    }

    this.nodeProcess.stderr?.on('data', (data) => {
      // In case if we can not spawn the process we'll have
      // an empty stderr.pipe`, but we can catch the error here
      if (this.nodeProcess?.exitCode && this.nodeProcess.exitCode > 0) {
        const decoder = new TextDecoder();
        const spawnError = decoder
          .decode(data)
          .replaceAll(`${nodePath}: `, '')
          .replaceAll('\n', ' ')
          .trim();
        const error: NodeError = {
          level: NodeErrorLevel.LOG_LEVEL_SYSERROR,
          module: 'NodeManager',
          msg: `Can't start the Node: ${spawnError}`,
          stackTrace: '',
        };

        this.pushToErrorPool({
          type: 'NodeError',
          error,
        });

        logger.error('spawnNode', error);
      }
    });
    this.nodeProcess.stdout?.pipe(logFileStream);
    this.nodeProcess.stderr?.pipe(logFileStream);
    this.nodeProcess.on('error', (err) => {
      logger.error('Node Process error', err);
      const error = transformNodeError(err);
      this.pushNodeError(error);
    });
    this.nodeProcess.on('close', (code, signal) => {
      this.pushToErrorPool({ type: 'Exit', code, signal });
    });
  };

  // Returns true if finished
  private waitProcessFinish = async (
    timeout: number,
    interval: number
  ): Promise<boolean> => {
    if (!this.nodeProcess) return true;
    const isFinished = !this.nodeProcess.kill(0);
    logger.log(
      'Spawn process',
      `Wait process to finish isFinished: ${isFinished}, timeout: ${timeout}, interval: ${interval}`
    );
    if (timeout <= 0) return isFinished;
    return (
      isFinished ||
      delay(interval).then(() =>
        this.waitProcessFinish(timeout - interval, interval)
      )
    );
  };

  stopNode = async () => {
    if (!this.nodeProcess) return;
    try {
      this.smesherManager.unsubscribe();
      // Request Node shutdown
      this.nodeProcess.kill('SIGTERM');
      logger.log('stop node', 'kill SIGTERM');
      // Wait until the process finish in a proper way
      !(await this.waitProcessFinish(
        PROCESS_EXIT_TIMEOUT,
        PROCESS_EXIT_CHECK_INTERVAL
      )) &&
        // If it still not finished — send SIGINT
        // to force cleaning up and exiting the Node process
        // in a proper way
        // ( On Windows it will kill process immediatelly )
        this.nodeProcess.kill('SIGINT') &&
        // Then wait up to 20 seconds more to allow
        // the Node finish in a proper way
        !(await this.waitProcessFinish(
          PROCESS_EXIT_TIMEOUT,
          PROCESS_EXIT_CHECK_INTERVAL
        )) &&
        // Send a SIGKILL to force kill the process
        this.nodeProcess.kill('SIGKILL');

      logger.log('stop node', 'node process is null');
      // Finally, drop the reference
      this.nodeProcess = null;
    } catch (err) {
      logger.error('stopNode', err);
    }
  };

  restartNode = async () => {
    logger.log('restartNode', 'restarting node...');
    await this.stopNode();
    return this.startNode();
  };

  getVersionAndBuild = async () => {
    try {
      const alive = await this.isNodeAlive(30);
      if (alive) {
        const version = await this.nodeService.getNodeVersion();
        const build = await this.nodeService.getNodeBuild();
        return { version, build };
      } else {
        return { version: '', build: 'node-not-started' };
      }
    } catch (err) {
      logger.error('getVersionAndBuild', err);
      return { version: '', build: '' };
    }
  };

  sendNodeStatus: StatusStreamHandler = debounce(200, true, (status) => {
    this.mainWindow.webContents.send(ipcConsts.N_M_SET_NODE_STATUS, status);
  });

  sendNodeError: ErrorStreamHandler = debounce(200, true, async (error) => {
    if (error.level < NodeErrorLevel.LOG_LEVEL_DPANIC) {
      // If there was no critical error
      // and we got some with level less than DPANIC
      // we have to check Node for liveness.
      // In case that Node does not responds
      // raise the error level to FATAL
      const isAlive = await this.isNodeAlive(30);
      if (!isAlive) {
        // Raise error level and call this method again, to ensure
        // that this error is not a consequence of real critical error
        error.level = NodeErrorLevel.LOG_LEVEL_FATAL;
        await this.sendNodeError(error);
        return;
      }
    }
    if (error.level >= NodeErrorLevel.LOG_LEVEL_DPANIC) {
      // Send only critical errors
      this.mainWindow.webContents.send(ipcConsts.N_M_SET_NODE_ERROR, error);
    }
  });

  pushNodeError = (error: NodeError) => {
    this.pushToErrorPool({ type: 'NodeError', error });
  };

  getNodeStatus = async (retries: number): Promise<NodeStatus> => {
    try {
      return await this.nodeService.getNodeStatus();
    } catch (error) {
      if (retries > 0)
        return delay(500).then(() => this.getNodeStatus(retries - 1));
      logger.error('getNodeStatus', error);
      return {
        connectedPeers: 0,
        isSynced: false,
        syncedLayer: 0,
        topLayer: 0,
        verifiedLayer: 0,
      };
    }
  };

  activateNodeErrorStream = () => {
    this.nodeService.activateErrorStream(this.pushNodeError);
  };

  activateNodeStatusStream = () =>
    this.nodeService.activateStatusStream(
      this.sendNodeStatus,
      this.pushNodeError
    );
}

export default NodeManager;
