import path from 'path';
import os from 'os';
import fs from 'fs';
import { exec } from 'child_process';
import { app, ipcMain, dialog, BrowserWindow } from 'electron';
import { ChildProcess } from 'node:child_process';
import { ipcConsts } from '../app/vars';
import { delay } from '../shared/utils';
import { NodeError, NodeErrorLevel, NodeStatus } from '../shared/types';
import StoreService from './storeService';
import Logger from './logger';
import NodeService, { ErrorStreamHandler, StatusStreamHandler } from './NodeService';

const logger = Logger({ className: 'NodeManager' });

const osTargetNames = {
  Darwin: 'mac',
  Linux: 'linux',
  Windows_NT: 'windows'
};

const normalizeCrashError = (error: Error, message: string): NodeError => ({
  msg: message,
  stackTrace: error?.stack || '',
  level: NodeErrorLevel.LOG_LEVEL_FATAL,
  module: 'NodeManager'
});

class NodeManager {
  private readonly mainWindow: BrowserWindow;

  private readonly configFilePath;

  private readonly cleanStart;

  private nodeService: NodeService;

  private nodeProcess: ChildProcess | null;

  private hasCriticalError = false;

  constructor(mainWindow: BrowserWindow, configFilePath: string, cleanStart) {
    this.mainWindow = mainWindow;
    this.configFilePath = configFilePath;
    this.cleanStart = cleanStart;
    this.nodeService = new NodeService();
    this.subscribeToEvents();
    this.nodeProcess = null;
  }

  subscribeToEvents = () => {
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

  activateNodeProcess = async () => {
    this.hasCriticalError = false;
    this.startNode();
    this.nodeService.createService();
    const success = await new Promise<boolean>((resolve) => {
      this.waitForNodeServiceResponsiveness(resolve, 15);
    });
    if (success) {
      StoreService.set('localNode', true);
      await this.getNodeStatus(0);
      this.activateNodeErrorStream();
      return true;
    }
    return false; // TODO: add error handling
  };

  startNode = () => {
    const userDataPath = app.getPath('userData');
    const nodePath = path.resolve(
      app.getAppPath(),
      process.env.NODE_ENV === 'development' ? `../node/${osTargetNames[os.type()]}/` : '../../node/',
      `go-spacemesh${osTargetNames[os.type()] === 'windows' ? '.exe' : ''}`
    );
    const nodeDataFilesPath = path.resolve(`${userDataPath}`, 'node-data');
    const logFilePath = path.resolve(`${userDataPath}`, 'spacemesh-log.txt');

    if (this.cleanStart) {
      if (fs.existsSync(logFilePath)) {
        fs.unlinkSync(logFilePath);
      }
      const nodePathWithParams = `"${nodePath}" --config "${this.configFilePath}" -d "${nodeDataFilesPath}" > "${logFilePath}"`;
      this.nodeProcess = exec(nodePathWithParams, (error, _, stderr) => {
        if (error) {
          // Take the first line of stderr or fallback to error.message
          const message = stderr.split('\n')[0] || error.message;
          this.sendNodeError(normalizeCrashError(error, message));
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          (process.env.NODE_ENV !== 'production' || process.env.DEBUG_PROD === 'true') && dialog.showErrorBox('Smesher Start Error', `${error}`);
          logger.error('startNode', error);
        }
      });
    } else {
      const netId = StoreService.get('netSettings.netId');
      const savedSmeshingParams = StoreService.get(`${netId}-smeshingParams`);
      const nodePathWithParams = `"${nodePath}" --config "${this.configFilePath}"${
        savedSmeshingParams ? ` --coinbase 0x${savedSmeshingParams.coinbase} --start-mining --post-datadir "${savedSmeshingParams.dataDir}"` : ''
      } -d "${nodeDataFilesPath}" >> "${logFilePath}"`;
      this.nodeProcess = exec(nodePathWithParams, (error, _, stderr) => {
        if (error) {
          // Take the first line of stderr or fallback to error.message
          const message = stderr.split('\n')[0] || error.message;
          this.sendNodeError(normalizeCrashError(error, message));
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          (process.env.NODE_ENV !== 'production' || process.env.DEBUG_PROD === 'true') && dialog.showErrorBox('Smesher Error', `${error}`);
          logger.error('startNode', error);
        }
      });
    }
  };

  stopNode = async () => {
    const res = await this.nodeService.shutdown();
    if (!res) {
      this.nodeProcess && this.nodeProcess.kill();
      this.nodeProcess = null;
    }
  };

  restartNode = async () => {
    logger.log('restartNode', 'restarting node...');
    await this.stopNode();
    const res = await this.activateNodeProcess();
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

  getNodeStatus = async (retries): Promise<NodeStatus> => {
    try {
      const status = await this.nodeService.getNodeStatus();
      this.sendNodeStatus(status);
      this.nodeService.activateStatusStream(this.sendNodeStatus, this.sendNodeError);
      return status;
    } catch (error) {
      if (retries < 5) return delay(200).then(() => this.getNodeStatus(retries + 1));
      throw error;
    }
  };

  activateNodeErrorStream = () => {
    this.nodeService.activateErrorStream(this.sendNodeError);
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
