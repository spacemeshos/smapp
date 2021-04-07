import path from 'path';
import os from 'os';
import { app, ipcMain, dialog, BrowserWindow } from 'electron';
import { ipcConsts } from '../app/vars';
import StoreService from './storeService';
import Logger from './logger';
import NodeService from './NodeService';

const { exec } = require('child_process');

const find = require('find-process');

const logger = Logger({ className: 'NodeManager' });

const osTargetNames = {
  Darwin: 'mac',
  Linux: 'linux',
  Windows_NT: 'windows'
};

const DEFAULT_TCP_PORT = '7152';

class NodeManager {
  private readonly mainWindow: BrowserWindow;

  private readonly configFilePath;

  private readonly cleanStart;

  private nodeService: any;

  constructor(mainWindow: BrowserWindow, configFilePath: string, cleanStart) {
    this.mainWindow = mainWindow;
    this.configFilePath = configFilePath;
    this.subscribeToEvents();
    this.cleanStart = cleanStart;
    this.nodeService = new NodeService();
  }

  subscribeToEvents = () => {
    ipcMain.on(ipcConsts.N_M_ACTIVATE_NODE, async () => {
      this.nodeService.createSevice();
      await this.startNode();
      StoreService.set({ localNode: true });
      setTimeout(() => {
        this.getNodeStatus(0);
        this.activateNodeErrorStream();
      }, 5000);
    });
    ipcMain.handle(ipcConsts.N_M_GET_VERSION_AND_BUILD, async () => {
      const res = await this.getVersionAndBuild();
      logger.log('N_M_GET_VERSION_AND_BUILD channel', res);
      return res;
    });
    ipcMain.on(ipcConsts.SET_NODE_PORT, (_event, request) => {
      StoreService.set({ nodeSettings: { port: request.port } });
    });
  };

  startNode = async () => {
    try {
      const userDataPath = app.getPath('userData');
      const nodePath = path.resolve(
        app.getAppPath(),
        process.env.NODE_ENV === 'development' ? `../node/${osTargetNames[os.type()]}/` : '../../node/',
        `go-spacemesh${osTargetNames[os.type()] === 'windows' ? '.exe' : ''}`
      );
      const nodeDataFilesPath = path.resolve(`${userDataPath}`, 'node-data');
      const logFilePath = path.resolve(`${userDataPath}`, 'spacemesh-log.txt');

      if (this.cleanStart) {
        const command = os.type() === 'Windows_NT' ? `if exist ${logFilePath} del ${logFilePath}` : `rm -rf ${logFilePath}`;
        exec(command, async (err: any) => {
          if (!err) {
            const nodePathWithParams = `"${nodePath}" --tcp-port ${DEFAULT_TCP_PORT} --config "${this.configFilePath}" -d "${nodeDataFilesPath}" > "${logFilePath}"`;
            exec(nodePathWithParams, (error: any) => {
              if (error) {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                (process.env.NODE_ENV !== 'production' || process.env.DEBUG_PROD === 'true') && dialog.showErrorBox('Smesher Start Error', `${error}`);
                logger.error('startNode', error);
              }
            });
          } else {
            dialog.showErrorBox('Old data files removal failed', `${err}`);
            logger.error('startNode', err);
          }
        });
      } else {
        const savedSmeshingParams = StoreService.get('smeshingParams');
        const nodePathWithParams = `"${nodePath}" --tcp-port ${DEFAULT_TCP_PORT} --config "${this.configFilePath}"${
          savedSmeshingParams ? ` --coinbase 0x${savedSmeshingParams.coinbase} --start-mining --post-datadir "${savedSmeshingParams.dataDir}"` : ''
        } -d "${nodeDataFilesPath}" >> "${logFilePath}"`;
        exec(nodePathWithParams, (error: any) => {
          if (error) {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            (process.env.NODE_ENV !== 'production' || process.env.DEBUG_PROD === 'true') && dialog.showErrorBox('Smesher Error', `${error}`);
            logger.error('startNode', error);
          }
        });
      }
    } catch (e) {
      logger.error('startNode', e);
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
      const nodeProcesses = await find('name', 'go-spacemesh');
      if (nodeProcesses && nodeProcesses.length) {
        exec(os.type() === 'Windows_NT' ? 'taskkill /F /IM go-spacemesh.exe' : `kill -9 ${nodeProcesses[1].pid}`);
      }
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
    if (!error && retries < 5) {
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
