import path from 'path';
import os from 'os';
import fs from 'fs';
import { app, ipcMain, dialog, BrowserWindow } from 'electron';
import { ipcConsts } from '../app/vars';
import { delay } from '../shared/utils';
import { NodeError, NodeErrorLevel, NodeStatus } from '../shared/types';
import StoreService from './storeService';
import Logger from './logger';
import NodeService, { StreamHandler } from './NodeService';

const { exec } = require('child_process');

const { AbortController } = require('abortcontroller-polyfill/dist/cjs-ponyfill');

const logger = Logger({ className: 'NodeManager' });

const osTargetNames = {
  Darwin: 'mac',
  Linux: 'linux',
  Windows_NT: 'windows'
};

const normalizeCrashError = (error: any): NodeError => ({
  msg: error.message,
  stackTrace: error?.stack,
  level: NodeErrorLevel.LOG_LEVEL_FATAL,
  module: 'NodeManager'
});

class NodeManager {
  private readonly mainWindow: BrowserWindow;

  private readonly configFilePath;

  private readonly cleanStart;

  private nodeService: NodeService;

  private nodeController: any;

  constructor(mainWindow: BrowserWindow, configFilePath: string, cleanStart) {
    this.mainWindow = mainWindow;
    this.configFilePath = configFilePath;
    this.cleanStart = cleanStart;
    this.nodeService = new NodeService();
    this.subscribeToEvents();
  }

  subscribeToEvents = () => {
    ipcMain.on(ipcConsts.N_M_GET_VERSION_AND_BUILD, () =>
      this.getVersionAndBuild()
        .then((payload) => this.mainWindow.webContents.send(ipcConsts.N_M_GET_VERSION_AND_BUILD, payload))
        .catch((error) => {
          this.sendNodeStatus({ error });
          logger.error('getVersionAndBuild', error);
        })
    );
    ipcMain.on(ipcConsts.SET_NODE_PORT, (_event, request) => {
      StoreService.set('nodeSettings.port', request.port);
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

  activateNodeProcess = async () => {
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

    this.nodeController = new AbortController();
    const { signal } = this.nodeController;

    if (this.cleanStart) {
      if (fs.existsSync(logFilePath)) {
        fs.unlinkSync(logFilePath);
      }
      const nodePathWithParams = `"${nodePath}" --config "${this.configFilePath}" -d "${nodeDataFilesPath}" > "${logFilePath}"`;
      exec(nodePathWithParams, { signal }, (error) => {
        if (error) {
          this.sendNodeStatus({ error: normalizeCrashError(error) });
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
      exec(nodePathWithParams, { signal }, (error) => {
        if (error) {
          this.sendNodeStatus({ error: normalizeCrashError(error) });
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          (process.env.NODE_ENV !== 'production' || process.env.DEBUG_PROD === 'true') && dialog.showErrorBox('Smesher Error', `${error}`);
          logger.error('startNode', error);
        }
      });
    }
  };

  stopNode = async ({ browserWindow, isDarkMode }: { browserWindow: BrowserWindow; isDarkMode: boolean }) => {
    const child = new BrowserWindow({ parent: browserWindow, modal: true, show: false });
    const filePath = path.resolve(app.getAppPath(), process.env.NODE_ENV === 'development' ? './' : 'desktop/', `closeAppModal.html?darkMode=${isDarkMode}`);
    child.loadURL(`file://${filePath}`);
    child.once('ready-to-show', () => {
      child.show();
    });

    const res = await this.nodeService.shutdown();
    if (!res) {
      this.nodeController.abort();
    }
  };

  getVersionAndBuild = async () => {
    const version = await this.nodeService.getNodeVersion();
    const build = await this.nodeService.getNodeBuild();
    return { version, build };
  };

  sendNodeStatus: StreamHandler = ({ status, error }) => {
    this.mainWindow.webContents.send(ipcConsts.N_M_SET_NODE_STATUS, { error, status });
  };

  getNodeStatus = async (retries): Promise<NodeStatus> => {
    try {
      const status = await this.nodeService.getNodeStatus();
      this.sendNodeStatus({ status });
      this.nodeService.activateStatusStream(this.sendNodeStatus);
      return status;
    } catch (error) {
      if (retries < 5) return delay(200).then(() => this.getNodeStatus(retries + 1));
      throw error;
    }
  };

  activateNodeErrorStream = () => {
    this.nodeService.activateErrorStream(this.sendNodeStatus);
  };
}

export default NodeManager;
