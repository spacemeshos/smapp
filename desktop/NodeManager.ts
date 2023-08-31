import path from 'path';
import { ChildProcess } from 'node:child_process';
import { Writable } from 'stream';
import fse from 'fs-extra';
import { spawn } from 'cross-spawn';
import { ipcMain, BrowserWindow, dialog } from 'electron';
import { debounce } from 'throttle-debounce';
import rotator from 'logrotate-stream';
import { Subject } from 'rxjs';
import { ipcConsts } from '../app/vars';
import { debounceShared, delay, getShortGenesisId } from '../shared/utils';
import { DEFAULT_NODE_STATUS } from '../shared/constants';
import {
  HexString,
  NodeError,
  NodeErrorLevel,
  NodeStatus,
  PostProvingOpts,
  PostSetupOpts,
  PublicService,
  SocketAddress,
} from '../shared/types';
import Warning, {
  WarningType,
  WriteFilePermissionWarningKind,
} from '../shared/warning';
import StoreService from './storeService';
import Logger from './logger';
import NodeService, {
  ErrorStreamHandler,
  StatusStreamHandler,
} from './NodeService';
import SmesherManager from './SmesherManager';
import { createDebouncePool, getSpawnErrorReason, isEmptyDir } from './utils';
import { NODE_CONFIG_FILE } from './main/constants';
import {
  DEFAULT_GRPC_PRIVATE_PORT,
  DEFAULT_GRPC_PUBLIC_PORT,
  getGrpcPrivatePort,
  getGrpcPublicPort,
  getNodeLogsPath,
  getPprofServerArgument,
  readLinesFromBottom,
} from './main/utils';
import AbstractManager from './AbstractManager';
import { ResettableSubject } from './main/rx.utils';
import { getBinaryPath, getNodePath } from './main/binaries';
import { updateSmeshingMetadata } from './SmesherMetadataUtils';

const logger = Logger({ className: 'NodeManager' });

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

const FATAL_REGEXP = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}\+\d{4})\sFATAL\s/gm;

class NodeManager extends AbstractManager {
  private nodeService: NodeService;

  private smesherManager: SmesherManager;

  private nodeProcess: ChildProcess | null;

  private nodeLogStream: Writable | null = null;

  private genesisID: string;

  private $_nodeStatus = new ResettableSubject<NodeStatus>(DEFAULT_NODE_STATUS);

  public $nodeStatus = this.$_nodeStatus.asObservable();

  public $warnings = new Subject<Warning>();

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
      const fatalErrorLine = lastLines.find((line) => FATAL_REGEXP.test(line));
      if (!fatalErrorLine) {
        // If we can't find fatal error — show default crash error
        this.sendNodeError(defaultCrashError());
        return;
      }
      // If we found fatal error — parse it and convert to NodeError
      try {
        // const json = JSON.parse(fatalErrorLine);
        const message = fatalErrorLine.replace(FATAL_REGEXP, '');
        const fatalError = {
          msg: message,
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

  constructor(
    mainWindow: BrowserWindow,
    genesisID: string,
    smesherManager: SmesherManager
  ) {
    super(mainWindow);
    this.nodeService = new NodeService();
    this.nodeProcess = null;
    this.smesherManager = smesherManager;
    this.genesisID = genesisID;
  }

  // Before deleting
  unsubscribe = () => {
    this.stopNode();
    this.nodeService.cancelStreams();
    this.unsubscribeIPC();
  };

  getGenesisID = () => this.genesisID;

  setGenesisID = (id: HexString) => {
    this.genesisID = id;
  };

  subscribeIPCEvents() {
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
  }

  isNodeAlive = debounceShared(
    200,
    async (retries = 60): Promise<boolean> => {
      if (!this.isNodeRunning()) {
        return false;
      }
      const isReady = await this.nodeService.echo();
      if (isReady) {
        return true;
      } else if (retries > 0) {
        await delay(1000);
        return this.isNodeAlive(retries - 1);
      } else {
        return false;
      }
    }
  );

  isNodeRunning = () => {
    return !!this.nodeProcess && this.nodeProcess.exitCode === null;
  };

  connectToRemoteNode = async (apiUrl?: SocketAddress | PublicService) => {
    this.nodeService.cancelStreams();
    await this.stopNode();
    this.$_nodeStatus.reset();

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

  startGRPCClient = async () => {
    this.nodeService.createService();
    const success = await this.isNodeAlive();
    if (success) {
      // update node status once by query request
      await this.updateNodeStatus();
      // and activate streams
      this.activateNodeStatusStream();
      this.activateNodeErrorStream();
      // resubscribe smesherManager IPC Events if needed
      this.smesherManager.subscribeIPC();
      // and then call method to update renderer data
      // TODO: move into `sources/smesherInfo` module
      await this.smesherManager.serviceStartupFlow();
      return true;
    } else {
      return this.startGRPCClient();
    }
  };

  startNode = async () => {
    if (this.isNodeRunning()) return true;
    this.$_nodeStatus.reset();
    await this.spawnNode();
    this.startGRPCClient();
    return true;
  };

  updateNodeStatus = async () => {
    // wait for status response
    const status = await this.getNodeStatus(5);
    // update node status
    this.sendNodeStatus(status);
    return true;
  };

  //
  startSmeshing = async (
    postSetupOpts: PostSetupOpts,
    provingOpts: PostProvingOpts
  ) => {
    if (!postSetupOpts.dataDir) {
      throw new Error(
        'Can not setup Smeshing without specified data directory'
      );
    }

    if (!this.isNodeRunning()) {
      await this.startNode();
    }

    const metadata = await updateSmeshingMetadata(postSetupOpts.dataDir, {
      posInitStart: Date.now(),
    });
    this.mainWindow.webContents.send(ipcConsts.SMESHER_METADATA_INFO, metadata);

    // In other cases — update config and restart the node
    // it will start Smeshing automatically based on the config
    await this.smesherManager.updateSmeshingConfig(
      postSetupOpts,
      provingOpts,
      this.genesisID
    );
    await this.restartNode();
    return SmeshingSetupState.ViaRestart;
  };

  private spawnNode = async () => {
    if (this.isNodeRunning()) return;
    const nodeDir = getBinaryPath();
    const nodePath = getNodePath();
    const nodeDataFilesPath = path.join(
      StoreService.get('node.dataPath'),
      getShortGenesisId(this.genesisID)
    );
    const logFilePath = getNodeLogsPath(this.genesisID);

    this.nodeLogStream = rotator({
      file: logFilePath,
      size: '100m',
      keep: 100,
      compress: true,
    });

    this.nodeLogStream.on('error', (err) =>
      this.$warnings.next(
        Warning.fromError(
          WarningType.WriteFilePermission,
          {
            kind: WriteFilePermissionWarningKind.Logger,
            filePath: logFilePath,
          },
          err
        )
      )
    );

    const nodeArgumentsMap = {
      'pprof-server': getPprofServerArgument(),
    };

    const nodeUserArguments = {
      'grpc-private-listener':
        getGrpcPublicPort() === DEFAULT_GRPC_PRIVATE_PORT
          ? undefined
          : `127.0.0.1:${getGrpcPrivatePort()}`,
      'grpc-public-listener':
        getGrpcPublicPort() === DEFAULT_GRPC_PUBLIC_PORT
          ? undefined
          : `127.0.0.1:${getGrpcPublicPort()}`,
    };

    const args = [
      '--config',
      NODE_CONFIG_FILE,
      '-d',
      nodeDataFilesPath,
      ...Object.entries(nodeArgumentsMap)
        .filter(([_, value]) => value)
        .map(([key]) => `--${key}`), // ['--key']
      ...Object.keys(nodeUserArguments)
        .filter((key) => nodeUserArguments[key])
        .map((key) => [`--${key}`, nodeUserArguments[key]])
        .reduce((prev, curr) => prev.concat(curr), []), // ['--key', 'value']
    ];

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
        this.nodeLogStream?.write(JSON.stringify(error));
        this.pushToErrorPool({
          type: 'NodeError',
          error,
        });

        logger.error('spawnNode', error);

        return;
      }

      this.nodeLogStream?.write(data);
    });

    this.nodeProcess.stdout?.pipe(this.nodeLogStream, { end: false });
    this.nodeProcess.stderr?.pipe(this.nodeLogStream, { end: false });

    this.nodeProcess.on('error', (err) => {
      const error = transformNodeError(err);
      this.pushNodeError(error);
      this.nodeLogStream?.write(JSON.stringify(error));
    });
    this.nodeProcess.on('close', (code, signal) => {
      logger.error('Node Process close', code, signal);
      this.nodeLogStream?.end();
      this.pushToErrorPool({ type: 'Exit', code, signal });
    });
  };

  // Returns true if finished
  private waitProcessFinish = async (
    timeout: number,
    interval: number
  ): Promise<boolean> => {
    if (!this.nodeProcess) return true;
    const isFinished = this.nodeProcess.exitCode !== null;
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
      const alive = await this.isNodeAlive();
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

  sendNodeStatus: StatusStreamHandler = debounce(200, (status: NodeStatus) => {
    this.$_nodeStatus.next(status);
    this.mainWindow.webContents.send(ipcConsts.N_M_SET_NODE_STATUS, status);
  });

  sendNodeError: ErrorStreamHandler = debounce(200, async (error) => {
    if (error.level < NodeErrorLevel.LOG_LEVEL_DPANIC) {
      // If there was no critical error
      // and we got some with level less than DPANIC
      // we have to check Node for liveness.
      // In case that Node does not responds
      // raise the error level to FATAL
      const isAlive = await this.isNodeAlive();
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
