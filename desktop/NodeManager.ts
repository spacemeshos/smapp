import path from 'path';
import os from 'os';
import fs from 'fs';
import { app, ipcMain, dialog, BrowserWindow } from 'electron';
import { ipcConsts } from '../app/vars';
import StoreService from './storeService';
import Logger from './logger';
import NodeService from './NodeService';

const { exec } = require('child_process');

const { AbortController } = require('abortcontroller-polyfill/dist/cjs-ponyfill');

const logger = Logger({ className: 'NodeManager' });

const osTargetNames = {
  Darwin: 'mac',
  Linux: 'linux',
  Windows_NT: 'windows'
};

class NodeManager {
  private readonly mainWindow: BrowserWindow;

  private readonly configFilePath;

  private readonly cleanStart;

  private nodeService: any;

  private nodeController: any;

  constructor(mainWindow: BrowserWindow, configFilePath: string, cleanStart) {
    this.mainWindow = mainWindow;
    this.configFilePath = configFilePath;
    this.cleanStart = cleanStart;
    this.nodeService = new NodeService();
    this.subscribeToEvents();
  }

  subscribeToEvents = () => {
    ipcMain.handle(ipcConsts.N_M_ACTIVATE_NODE, async () => {
      this.startNode();
      await new Promise<void>((resolve) =>
        setTimeout(() => {
          this.nodeService.createService();
          StoreService.set('localNode', true);
          this.getNodeStatus(0);
          this.activateNodeErrorStream();
          resolve();
        }, 20000)
      );
    });
    ipcMain.handle(ipcConsts.N_M_GET_VERSION_AND_BUILD, async () => {
      const res = await this.getVersionAndBuild();
      logger.log('N_M_GET_VERSION_AND_BUILD channel', res);
      return res;
    });
    ipcMain.on(ipcConsts.SET_NODE_PORT, (_event, request) => {
      StoreService.set('nodeSettings.port', request.port);
    });
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
    if (!res.shuttingDown) {
      this.nodeController.abort();
    }
  };

  getVersionAndBuild = async () => {
    const res1 = await this.nodeService.getNodeVersion();
    const res2 = await this.nodeService.getNodeBuild();
    return { version: res1.error ? '' : res1.version, build: res2.error ? '' : res2.build };
  };

  setNodeStatus = ({ status, error }: { status: any; error: any }) => {
    if (!error) {
      this.mainWindow.webContents.send(ipcConsts.N_M_SET_NODE_STATUS, { status });
    }
  };

  getNodeStatus = async (retries) => {
    const { status, error } = await this.nodeService.getNodeStatus();
    if (error && retries < 5) {
      await this.nodeService.getNodeStatus(retries + 1);
    } else {
      this.setNodeStatus({ status, error: null });
      this.nodeService.activateStatusStream({ handler: this.setNodeStatus });
    }
  };

  setNodeError = ({ error }: { error: any }) => {
    this.mainWindow.webContents.send(ipcConsts.N_M_SET_NODE_STATUS, { error });
  };

  activateNodeErrorStream = () => {
    this.nodeService.activateErrorStream({ handler: this.setNodeError });
  };
}

export default NodeManager;
