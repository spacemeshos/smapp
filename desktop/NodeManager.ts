import path from 'path';
import os from 'os';
import fs from 'fs';
import fse from 'fs-extra';
import { spawn } from 'cross-spawn';
import { app, ipcMain, BrowserWindow, dialog } from 'electron';
import { ChildProcess } from 'node:child_process';
import { ipcConsts } from '../app/vars';
import { delay } from '../shared/utils';
import { NodeError, NodeErrorLevel, NodeStatus, PostSetupOpts, PublicService, SocketAddress } from '../shared/types';
import StoreService from './storeService';
import Logger from './logger';
import NodeService, { ErrorStreamHandler, StatusStreamHandler } from './NodeService';
import SmesherManager from './SmesherManager';
import { checksum, createDebouncePool, isEmptyDir, isFileExists } from './utils';
import { NODE_CONFIG_FILE } from './main/constants';
import NodeConfig from './main/NodeConfig';
import { getNodeLogsPath, readLinesFromBottom } from './main/utils';

const logger = Logger({ className: 'NodeManager' });

const osTargetNames = {
  Darwin: 'mac',
  Linux: 'linux',
  Windows_NT: 'windows',
};

const PROCESS_EXIT_TIMEOUT = 20000; // 20 sec
const PROCESS_EXIT_CHECK_INTERVAL = 1000; // Check does the process exited

const defaultCrashError = (error?: Error): NodeError => ({
  msg: "The Spacemesh node software has unexpectedly quit. Click on 'restart node' to start it.",
  stackTrace: error?.stack || '',
  level: NodeErrorLevel.LOG_LEVEL_FATAL,
  module: 'NodeManager',
});

type PoolNodeError = { type: 'NodeError'; error: NodeError };
type PoolExitCode = { type: 'Exit'; code: number | null; signal: NodeJS.Signals | null };
type ErrorPoolObject = PoolNodeError | PoolExitCode;

class NodeManager {
  private readonly mainWindow: BrowserWindow;

  private nodeService: NodeService;

  private smesherManager: SmesherManager;

  private nodeProcess: ChildProcess | null;

  private netId: number;

  private pushToErrorPool = createDebouncePool<ErrorPoolObject>(100, async (poolList) => {
    const exitError = poolList.find((e) => e.type === 'Exit') as PoolExitCode | undefined;
    // In case if Node exited with 0 code count that
    // there was no errors and do not notify client about any of
    // possible errors caused by exiting
    if (exitError && exitError.code === 0) return;
    // If pool have some errors, but Node is not closed —
    // find a most critical within the pool and notify the client about it
    // Checking for `!exitError` is needed to avoid showing some fatal errors
    // that are consequence of Node crash
    // E.G. SIGKILL of Node will also produce a bunch of GRPC errors
    if (!exitError) {
      const errors = poolList.filter((a) => a.type === 'NodeError') as PoolNodeError[];
      if (errors.length > 1) {
        const mostCriticalError = errors.sort((a, b) => b.error.level - a.error.level)[0].error;
        this.sendNodeError(mostCriticalError);
        return;
      }
    }
    // Otherwise if Node exited, but there are no critical errors
    // in the pool — search for fatal error in the logs
    const lastLines = await readLinesFromBottom(getNodeLogsPath(this.netId), 100);
    const fatalErrorLine = lastLines.find((line) => /^\{"L":"FATAL",.+\}$/.test(line));
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
  });

  constructor(mainWindow: BrowserWindow, netId: number, smesherManager: SmesherManager) {
    this.mainWindow = mainWindow;
    this.nodeService = new NodeService();
    this.subscribeToEvents();
    this.nodeProcess = null;
    this.smesherManager = smesherManager;
    this.netId = netId;
  }

  subscribeToEvents = () => {
    ipcMain.handle(ipcConsts.N_M_START_NODE, async () => (this.isNodeRunning() ? true : this.startNode()));

    ipcMain.on(ipcConsts.N_M_GET_VERSION_AND_BUILD, () =>
      this.getVersionAndBuild()
        .then((payload) => this.mainWindow.webContents.send(ipcConsts.N_M_GET_VERSION_AND_BUILD, payload))
        .catch((error) => {
          this.sendNodeError(error);
          logger.error('getVersionAndBuild', error);
        })
    );
    ipcMain.on(ipcConsts.SET_NODE_PORT, (_event, request) => {
      StoreService.set('node.port', request.port);
    });

    // Always return true / false to notify caller that it is done
    ipcMain.handle(
      ipcConsts.N_M_RESTART_NODE,
      (): Promise<boolean> =>
        this.restartNode().catch((error) => {
          this.sendNodeError(error);
          logger.error('restartNode', error);
          return false;
        })
    );

    ipcMain.handle(ipcConsts.SMESHER_START_SMESHING, async (_event, { postSetupOpts }: { postSetupOpts: PostSetupOpts }) => {
      if (!postSetupOpts.dataDir) {
        throw new Error('Can not setup Smeshing without specified data directory');
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
        await this.smesherManager.startSmeshing(opts);
        return this.smesherManager.updateSmeshingConfig(opts);
      };

      // If post data-dir does not changed and it contains key.bin file
      // assume that everything is fine and start smeshing as usual
      if (isSameDataDir && isDataDirKeyFileExist) return startSmeshingAsUsual(postSetupOpts);

      // In other cases:
      // NextDataDir    CurrentDataDir     Action
      // Not exist      Exist              Copy key.bin & start
      // Not exist      Not exist          Update config & restart node
      // Exist          Not exist          Update config & restart node
      // Exist          Exist              Compare checksum
      //                                   - if equal: start as usual
      //                                   - if not: update config & restart node
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
      return this.restartNode();
    });

    ipcMain.handle(ipcConsts.PROMPT_CHANGE_DATADIR, async () => {
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
        throw new Error(`Can not switch Node Data directory: ${newPath} is not empty`);
      }
      // Stop the Node
      await this.stopNode();
      // Move old data to new place if needed
      if (!(await isEmptyDir(oldPath))) await fse.move(oldPath, newPath, { overwrite: true });
      // Update persistent store
      StoreService.set('node.dataPath', newPath);
      // Start the Node
      return this.startNode();
    });
  };

  waitForNodeServiceResponsiveness = async (resolve, attempts: number) => {
    const isReady = await this.nodeService.echo();
    if (isReady) {
      resolve(true);
    } else if (attempts > 0) {
      setTimeout(async () => {
        await this.waitForNodeServiceResponsiveness(resolve, attempts - 1);
      }, 5000);
    } else {
      resolve(false);
    }
  };

  isNodeRunning = () => !!this.nodeProcess;

  connectToRemoteNode = async (apiUrl?: SocketAddress | PublicService) => {
    this.nodeService.createService(apiUrl);
    return this.getNodeStatus(5);
  };

  startNode = async () => {
    await this.spawnNode();
    this.nodeService.createService();
    const success = await new Promise<boolean>((resolve) => {
      this.waitForNodeServiceResponsiveness(resolve, 15);
    });
    if (success) {
      await this.getNodeStatus(5);
      this.activateNodeErrorStream();
      await this.smesherManager.serviceStartupFlow();
      return true;
    }
    return false; // TODO: add error handling
  };

  private spawnNode = async () => {
    if (this.nodeProcess) return;
    const userDataPath = app.getPath('userData');
    const nodeDir = path.resolve(app.getAppPath(), process.env.NODE_ENV === 'development' ? `../node/${osTargetNames[os.type()]}/` : '../../node/');
    const nodePath = path.resolve(nodeDir, `go-spacemesh${osTargetNames[os.type()] === 'windows' ? '.exe' : ''}`);
    const nodeDataFilesPath = StoreService.get('node.dataPath');
    const nodeConfig = await NodeConfig.load();
    const logFilePath = path.resolve(`${userDataPath}`, `spacemesh-log-${nodeConfig.p2p['network-id']}.txt`);

    const logFileStream = fs.createWriteStream(logFilePath, { flags: 'a', encoding: 'utf-8' });
    const args = ['--config', NODE_CONFIG_FILE, '-d', nodeDataFilesPath, '--log-encoder', 'json'];

    logger.log('startNode', 'spawning node', [nodePath, ...args]);
    this.nodeProcess = spawn(nodePath, args, { cwd: nodeDir });
    this.nodeProcess.stdout?.pipe(logFileStream);
    this.nodeProcess.stderr?.pipe(logFileStream);
    this.nodeProcess.on('error', (error) => {
      logger.error('Node Process error', error);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      (process.env.NODE_ENV !== 'production' || process.env.DEBUG_PROD === 'true') && dialog.showErrorBox('Smesher Error', `${error}`);
      this.pushToErrorPool({ type: 'NodeError', error: defaultCrashError(error) });
    });
    this.nodeProcess.on('close', (code, signal) => {
      this.pushToErrorPool({ type: 'Exit', code, signal });
    });
  };

  // Returns true if finished
  private waitProcessFinish = async (timeout: number, interval: number): Promise<boolean> => {
    if (!this.nodeProcess) return true;
    const isFinished = !this.nodeProcess.kill(0);
    if (timeout <= 0) return isFinished;
    if (isFinished) return true;
    return isFinished ? true : delay(interval).then(() => this.waitProcessFinish(timeout - interval, interval));
  };

  stopNode = async () => {
    if (!this.nodeProcess) return;
    try {
      // Request Node shutdown
      await this.nodeService.shutdown();
      // Wait until the process finish in a proper way
      !(await this.waitProcessFinish(PROCESS_EXIT_TIMEOUT, PROCESS_EXIT_CHECK_INTERVAL)) &&
        // If it still not finished — send SIGINT
        // to force cleaning up and exiting the Node process
        // in a proper way
        // ( On Windows it will kill process immediatelly )
        this.nodeProcess.kill('SIGINT') &&
        // Then wait up to 20 seconds more to allow
        // the Node finish in a proper way
        !(await this.waitProcessFinish(PROCESS_EXIT_TIMEOUT, PROCESS_EXIT_CHECK_INTERVAL)) &&
        // Send a SIGKILL to force kill the process
        this.nodeProcess.kill('SIGKILL');
      // Finally, drop the reference
      this.nodeProcess = null;
    } catch (err) {
      logger.error('stopNode', err);
    }
  };

  restartNode = async () => {
    logger.log('restartNode', 'restarting node...');
    await this.stopNode();
    const res = await this.startNode();
    if (!res) {
      throw {
        msg: 'Cannot restart the Node',
        level: NodeErrorLevel.LOG_LEVEL_FATAL,
        stackTrace: '',
        module: 'NodeManager',
      } as NodeError;
    }
    return res;
  };

  getVersionAndBuild = async () => {
    const version = await this.nodeService.getNodeVersion();
    const build = await this.nodeService.getNodeBuild();
    return { version, build };
  };

  sendNodeStatus: StatusStreamHandler = (status) => {
    this.mainWindow.webContents.send(ipcConsts.N_M_SET_NODE_STATUS, status);
  };

  sendNodeError: ErrorStreamHandler = async (error) => {
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
  };

  pushNodeError = (error: NodeError) => {
    this.pushToErrorPool({ type: 'NodeError', error });
  };

  getNodeStatus = async (retries: number): Promise<NodeStatus> => {
    try {
      const status = await this.nodeService.getNodeStatus();
      this.sendNodeStatus(status);
      this.nodeService.activateStatusStream(this.sendNodeStatus, this.pushNodeError);
      return status;
    } catch (error) {
      if (retries > 0) return delay(200).then(() => this.getNodeStatus(retries - 1));
      throw error;
    }
  };

  activateNodeErrorStream = () => {
    this.nodeService.activateErrorStream(this.pushNodeError);
  };

  isNodeAlive = async (attemptNumber = 0): Promise<boolean> => {
    const res = await this.nodeService.echo();
    if (!res && attemptNumber < 3) {
      return delay(200).then(() => this.isNodeAlive(attemptNumber + 1));
    }
    return res;
  };
}

export default NodeManager;
