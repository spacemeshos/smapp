import path from 'path';
import os from 'os';
import fs from 'fs';
import { spawn } from 'cross-spawn';
import { app, ipcMain, BrowserWindow, dialog } from 'electron';
import { ChildProcess } from 'node:child_process';
import { ipcConsts } from '../app/vars';
import { delay } from '../shared/utils';
import { NodeError, NodeErrorLevel, NodeStatus, PublicService, SocketAddress } from '../shared/types';
import StoreService from './storeService';
import Logger from './logger';
import NodeService, { ErrorStreamHandler, StatusStreamHandler } from './NodeService';
import SmesherManager from './SmesherManager';
import { createDebouncePool } from './utils';

const logger = Logger({ className: 'NodeManager' });

const osTargetNames = {
  Darwin: 'mac',
  Linux: 'linux',
  Windows_NT: 'windows'
};

const PROCESS_EXIT_TIMEOUT = 20000; // 20 sec
const PROCESS_EXIT_CHECK_INTERVAL = 1000; // Check does the process exited

const defaultCrashError = (error?: Error): NodeError => ({
  msg: "The Spacemesh node software has unexpectedly quit. Click on 'restart node' to start it.",
  stackTrace: error?.stack || '',
  level: NodeErrorLevel.LOG_LEVEL_FATAL,
  module: 'NodeManager'
});

type PoolNodeError = { type: 'NodeError'; error: NodeError };
type PoolExitCode = { type: 'Exit'; code: number | null; signal: NodeJS.Signals | null };
type ErrorPoolObject = PoolNodeError | PoolExitCode;

class NodeManager {
  private readonly mainWindow: BrowserWindow;

  private readonly cleanStart;

  private nodeService: NodeService;

  private smesherManager: SmesherManager;

  private nodeProcess: ChildProcess | null;

  private hasCriticalError = false;

  private pushToErrorPool = createDebouncePool<ErrorPoolObject>(100, (errors) => {
    const exitError = errors.find((e) => e.type === 'Exit') as PoolExitCode | undefined;
    if (exitError) {
      if (exitError.code === 0) return;
      this.sendNodeError(defaultCrashError());
      return;
    }
    const mostCriticalError = (errors as PoolNodeError[]).sort((a, b) => b.error.level - a.error.level)[0].error;
    this.sendNodeError(mostCriticalError);
  });

  constructor(mainWindow: BrowserWindow, cleanStart: boolean, smesherManager: SmesherManager) {
    this.mainWindow = mainWindow;
    this.cleanStart = cleanStart;
    this.nodeService = new NodeService();
    this.subscribeToEvents();
    this.nodeProcess = null;
    this.smesherManager = smesherManager;
  }

  subscribeToEvents = () => {
    ipcMain.handle(ipcConsts.N_M_START_NODE, async () => (this.isNodeRunning() ? true : this.startNode()));
    ipcMain.handle(ipcConsts.N_M_STOP_NODE, () => this.stopNode().then(() => true));

    ipcMain.on(ipcConsts.N_M_GET_VERSION_AND_BUILD, () =>
      this.getVersionAndBuild()
        .then((payload) => this.mainWindow.webContents.send(ipcConsts.N_M_GET_VERSION_AND_BUILD, payload))
        .catch((error) => {
          this.sendNodeError(error);
          logger.error('getVersionAndBuild', error);
        })
    );
    ipcMain.on(ipcConsts.SET_NODE_PORT, (_event, request) => {
      StoreService.set('nodeSettings.port', request.port);
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
    return this.getNodeStatus(0);
  };

  startNode = async () => {
    this.hasCriticalError = false;
    this.spawnNode();
    this.nodeService.createService();
    const success = await new Promise<boolean>((resolve) => {
      this.waitForNodeServiceResponsiveness(resolve, 15);
    });
    if (success) {
      await this.getNodeStatus(0);
      this.activateNodeErrorStream();
      await this.smesherManager.serviceStartupFlow();
      return true;
    }
    return false; // TODO: add error handling
  };

  private spawnNode = () => {
    if (this.nodeProcess) return;
    const userDataPath = app.getPath('userData');
    const nodeDir = path.resolve(app.getAppPath(), process.env.NODE_ENV === 'development' ? `../node/${osTargetNames[os.type()]}/` : '../../node/');
    const nodePath = path.resolve(nodeDir, `go-spacemesh${osTargetNames[os.type()] === 'windows' ? '.exe' : ''}`);
    const nodeDataFilesPath = path.resolve(`${userDataPath}`, 'node-data');
    const logFilePath = path.resolve(`${userDataPath}`, 'spacemesh-log.txt');

    const logFileStream = fs.createWriteStream(logFilePath, { flags: this.cleanStart ? 'w' : 'a', encoding: 'utf-8' });
    const nodeConfigFilePath = StoreService.get('nodeConfigFilePath') as string;
    const args = ['--config', nodeConfigFilePath, '-d', nodeDataFilesPath];

    logger.log('startNode', 'spawning node', [nodePath, ...args]);
    this.nodeProcess = spawn(nodePath, args, { cwd: nodeDir });
    this.nodeProcess.stdout?.pipe(logFileStream);
    this.nodeProcess.stderr?.pipe(logFileStream);
    this.nodeProcess.on('error', (error) => {
      logger.error('Node Process', error);
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
        module: 'NodeManager'
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
    if (this.hasCriticalError) return;
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
      // If we got a critical error — set the flag
      // it prevents raising level of further errors
      this.hasCriticalError = true;
      // Send only critical errors
      this.mainWindow.webContents.send(ipcConsts.N_M_SET_NODE_ERROR, error);
    }
  };

  pushNodeError = (error: NodeError) => {
    this.pushToErrorPool({ type: 'NodeError', error });
  };

  getNodeStatus = async (retries): Promise<NodeStatus> => {
    try {
      const status = await this.nodeService.getNodeStatus();
      this.sendNodeStatus(status);
      this.nodeService.activateStatusStream(this.sendNodeStatus, this.pushNodeError);
      return status;
    } catch (error) {
      if (retries < 5) return delay(200).then(() => this.getNodeStatus(retries + 1));
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
