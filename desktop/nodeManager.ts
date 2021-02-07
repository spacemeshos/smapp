import path from 'path';
import os from 'os';
import { app, ipcMain, dialog, BrowserWindow } from 'electron';
import { ipcConsts } from '../app/vars';
import StoreService from './storeService';
import netService from './netService';
import nodeConfig from './config.json';
import WalletManager from './walletManager';
import Logger from './logger';

const logger = Logger({ className: 'NodeManager' });

const { exec } = require('child_process');

const find = require('find-process');

const osTargetNames = {
  Darwin: 'mac',
  Linux: 'linux',
  Windows_NT: 'windows'
};

const DEFAULT_PORT = '7153';

class NodeManager {
  constructor(mainWindow: BrowserWindow) {
    this.subscribeToEvents(mainWindow);
  }

  subscribeToEvents = (mainWindow: BrowserWindow) => {
    ipcMain.handle(ipcConsts.IS_SERVICE_READY, async () => {
      try {
        await netService.isServiceReady();
        return true;
      } catch (e) {
        return false;
      }
    });
    ipcMain.once(ipcConsts.START_NODE, async () => {
      await this.startNode();
      new WalletManager(mainWindow); // eslint-disable-line no-new
    });
    ipcMain.handle(ipcConsts.GET_NODE_SETTINGS, async () => {
      const res = await this.getNodeSettings();
      logger.log('GET_NODE_SETTINGS channel', res);
      return res;
    });
    ipcMain.handle(ipcConsts.GET_NODE_STATUS, async () => {
      const res = await this.getNodeStatus();
      logger.log(`NodeManager`, `ipc GET_NODE_STATUS channel`, { res });
      return res;
    });
    ipcMain.on(ipcConsts.SET_NODE_PORT, (_event, request) => {
      const networkId = StoreService.get({ key: 'networkId' });
      StoreService.set({ key: `${networkId}-port`, value: request.port });
    });
    ipcMain.handle(ipcConsts.SET_NODE_IP, (_event, request) => {
      const res = this.setNodeIpAddress({ ...request });
      logger.log('SET_NODE_IP channel', res, { request });
      return res;
    });
  };

  startNode = async () => {
    try {
      const networkId = parseInt(nodeConfig.p2p['network-id']);
      StoreService.set({ key: 'networkId', value: networkId });
      const fetchedGenesisTime = nodeConfig.main['genesis-time'];
      const prevGenesisTime = StoreService.get({ key: `${networkId}-genesisTime` }) || '';

      const port = StoreService.get({ key: `${networkId}-port` }) || DEFAULT_PORT;

      StoreService.set({ key: `${networkId}-minCommitmentSize`, value: parseInt(nodeConfig.post['post-space']) });
      StoreService.set({ key: `${networkId}-layerDurationSec`, value: parseInt(nodeConfig.main['layer-duration-sec']) });

      const userDataPath = app.getPath('userData');
      const nodePath = path.resolve(
        app.getAppPath(),
        // @ts-ignore
        process.env.NODE_ENV === 'development' ? `../node/${osTargetNames[os.type()]}/` : '../../node/',
        // @ts-ignore
        `go-spacemesh${osTargetNames[os.type()] === 'windows' ? '.exe' : ''}`
      );
      const nodeDataFilesPath = path.resolve(`${userDataPath}`, 'node-data');
      const logFilePath = path.resolve(`${userDataPath}`, 'spacemesh-log.txt');

      const configFileLocation = path.resolve(app.getAppPath(), process.env.NODE_ENV === 'development' ? './' : '../../config', 'config.json');

      if (prevGenesisTime !== fetchedGenesisTime) {
        const command = os.type() === 'Windows_NT' ? `if exist ${logFilePath} del ${logFilePath}` : `rm -rf ${logFilePath}`;
        exec(command, async (err: any) => {
          if (!err) {
            StoreService.set({ key: `${networkId}-genesisTime`, value: fetchedGenesisTime });
            const nodePathWithParams = `"${nodePath}" --grpc-server --json-server --tcp-port ${port} --config "${configFileLocation}" -d "${nodeDataFilesPath}" > "${logFilePath}"`;
            exec(nodePathWithParams, (error: any) => {
              if (error) {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                (process.env.NODE_ENV !== 'production' || process.env.DEBUG_PROD === 'true') && dialog.showErrorBox('Smesher Start Error', `${error}`);
                logger.error('nodeManager', 'startNode', error);
              }
            });
          } else {
            dialog.showErrorBox('Old data files removal failed', `${err}`);
            logger.error('nodeManager', 'startNode', err);
          }
        });
      } else {
        const savedSmeshingParams = StoreService.get({ key: `${networkId}-smeshingParams` });
        const nodePathWithParams = `"${nodePath}" --grpc-server --json-server --tcp-port ${port} --config "${configFileLocation}"${
          savedSmeshingParams ? ` --coinbase 0x${savedSmeshingParams.coinbase} --start-mining --post-datadir "${savedSmeshingParams.dataDir}"` : ''
        } -d "${nodeDataFilesPath}" >> "${logFilePath}"`;
        exec(nodePathWithParams, (error: any) => {
          if (error) {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            (process.env.NODE_ENV !== 'production' || process.env.DEBUG_PROD === 'true') && dialog.showErrorBox('Smesher Error', `${error}`);
            logger.error('nodeManager', 'startNode', error);
          }
        });
      }
    } catch (e) {
      dialog.showErrorBox('Parsing json failed', `${e}`);
      logger.error('nodeManager', 'startNode', e);
    }
  };

  stopNode = async ({ browserWindow, isDarkMode }: { browserWindow: BrowserWindow; isDarkMode: boolean }) => {
    const closeApp = async () => {
      browserWindow.destroy();
      app.quit();
    };

    const showCloseAppModal = () => {
      const child = new BrowserWindow({ parent: browserWindow, modal: true, show: false });
      child.loadURL(`file://${__dirname}/closeAppModal.html?darkMode=${isDarkMode}`);
      child.once('ready-to-show', () => {
        child.show();
      });
    };

    const stopNodeCycle = async (attempt: number) => {
      const nodeProcesses = await find('name', 'go-spacemesh');
      if (attempt > 15) {
        if (nodeProcesses && nodeProcesses.length) {
          exec(os.type() === 'Windows_NT' ? 'taskkill /F /IM go-spacemesh.exe' : `kill -9 ${nodeProcesses[1].pid}`);
        }
        showCloseAppModal();
        await closeApp();
      } else if (!nodeProcesses || !nodeProcesses.length) {
        await closeApp();
      } else {
        setTimeout(() => stopNodeCycle(attempt + 1), 3000);
      }
    };
    try {
      const nodeProcesses = await find('name', 'go-spacemesh');
      if (nodeProcesses && nodeProcesses.length) {
        exec(os.type() === 'Windows_NT' ? 'taskkill /F /IM go-spacemesh.exe' : `kill -s INT ${nodeProcesses[1].pid}`, async (err: any) => {
          showCloseAppModal();
          if (err) {
            logger.error('nodeManager', 'stopNode', err);
          }
          await stopNodeCycle(0);
        });
      } else {
        await closeApp();
      }
    } catch (err) {
      // could not find or kill node process
      logger.error('nodeManager', 'stopNode', err);
      await closeApp();
    }
  };

  getNodeSettings = async () => {
    try {
      const networkId = StoreService.get({ key: 'networkId' });
      const port = StoreService.get({ key: `${networkId}-port` }) || DEFAULT_PORT;
      // @ts-ignore
      const { value } = await netService.getStateRoot();
      return { stateRootHash: value, port };
    } catch (error) {
      return { error };
    }
  };

  getNodeStatus = async () => {
    try {
      const status = await netService.getNodeStatus();
      const parsedStatus = {
        // @ts-ignore
        peers: parseInt(status.peers),
        // @ts-ignore
        minPeers: parseInt(status.minPeers),
        // @ts-ignore
        maxPeers: parseInt(status.maxPeers),
        // @ts-ignore
        synced: status.synced,
        // @ts-ignore
        currentLayer: parseInt(status.currentLayer),
        // @ts-ignore
        syncedLayer: parseInt(status.syncedLayer),
        // @ts-ignore
        verifiedLayer: parseInt(status.verifiedLayer)
      };
      return { status: parsedStatus, error: null };
    } catch (error) {
      return { status: null, error };
    }
  };

  setNodeIpAddress = ({ nodeIpAddress }: { nodeIpAddress: string }) => {
    try {
      netService.setNodeIpAddress({ nodeIpAddress });
      return { error: null };
    } catch (error) {
      return { error };
    }
  };
}

export default NodeManager;
