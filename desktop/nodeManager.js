import path from 'path';
import os from 'os';
import fs from 'fs';
import { app, ipcMain, dialog } from 'electron';
import { ipcConsts } from '../app/vars';
import StoreService from './storeService';
import netService from './netService';
import nodeConfig from './config.json';
import WalletManager from './walletManager';

const { exec } = require('child_process');

const find = require('find-process');
const checkDiskSpace = require('check-disk-space');

const osTargetNames = {
  Darwin: 'mac',
  Linux: 'linux',
  Windows_NT: 'windows'
};

const DEFAULT_PORT = '7153';

class NodeManager {
  constructor(mainWindow) {
    this.subscribeToEvents(mainWindow);
  }

  subscribeToEvents = (mainWindow) => {
    ipcMain.once(ipcConsts.START_NODE, async () => {
      await this.startNode();
      new WalletManager(mainWindow); // eslint-disable-line no-new
    });
    ipcMain.handle(ipcConsts.GET_NODE_SETTINGS, async (event) => {
      const res = await this.getNodeSettings({ event });
      return res;
    });
    ipcMain.handle(ipcConsts.GET_NODE_STATUS, async () => {
      const res = await this.getNodeStatus();
      return res;
    });
    ipcMain.on(ipcConsts.SET_NODE_PORT, (event, request) => {
      const networkId = StoreService.get({ key: 'networkId' });
      StoreService.set({ key: `${networkId}-port`, value: request.port });
    });
    ipcMain.handle(ipcConsts.SELECT_POST_FOLDER, async () => {
      const res = await this.selectPostFolder({ mainWindow });
      return res;
    });
    ipcMain.handle(ipcConsts.GET_MINING_STATUS, async () => {
      const res = await this.getMiningStatus();
      return res;
    });
    ipcMain.handle(ipcConsts.INIT_MINING, async (event, request) => {
      const res = await this.initMining({ ...request });
      return res;
    });
    ipcMain.handle(ipcConsts.GET_UPCOMING_REWARDS, async () => {
      const res = await this.getUpcomingRewards();
      return res;
    });
    ipcMain.handle(ipcConsts.SET_REWARDS_ADDRESS, async (event, request) => {
      const res = await this.setRewardsAddress({ ...request });
      return res;
    });
    ipcMain.handle(ipcConsts.SET_NODE_IP, (event, request) => {
      const res = this.setNodeIpAddress({ ...request });
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

      StoreService.set({ key: `${networkId}-postSize`, value: parseInt(nodeConfig.post['post-space']) });
      StoreService.set({ key: `${networkId}-layerDurationSec`, value: parseInt(nodeConfig.main['layer-duration-sec']) });

      const userDataPath = app.getPath('userData');
      const nodePath = path.resolve(
        app.getAppPath(),
        process.env.NODE_ENV === 'development' ? `../node/${osTargetNames[os.type()]}/` : '../../node/',
        `go-spacemesh${osTargetNames[os.type()] === 'windows' ? '.exe' : ''}`
      );
      const nodeDataFilesPath = path.resolve(`${userDataPath}`, 'node-data');
      const logFilePath = path.resolve(`${userDataPath}`, 'spacemesh-log.txt');

      const configFileLocation = path.resolve(app.getAppPath(), process.env.NODE_ENV === 'development' ? './' : '../../config', 'config.json');

      if (prevGenesisTime !== fetchedGenesisTime) {
        const command = os.type() === 'Windows_NT' ? `if exist ${logFilePath} del ${logFilePath}` : `rm -rf ${logFilePath}`;
        exec(command, async (err) => {
          if (!err) {
            StoreService.set({ key: `${networkId}-genesisTime`, value: fetchedGenesisTime });
            const nodePathWithParams = `"${nodePath}" --grpc-server --json-server --tcp-port ${port} --config "${configFileLocation}" -d "${nodeDataFilesPath}" > "${logFilePath}"`;
            exec(nodePathWithParams, (error) => {
              if (error) {
                (process.env.NODE_ENV !== 'production' || process.env.DEBUG_PROD === 'true') && dialog.showErrorBox('Smesher Start Error', `${error}`);
                console.error(error); // eslint-disable-line no-console
              }
            });
          } else {
            dialog.showErrorBox('Old data files removal failed', `${err}`);
            console.error(err); // eslint-disable-line no-console
          }
        });
      } else {
        const savedMiningParams = StoreService.get({ key: `${networkId}-miningParams` });
        const nodePathWithParams = `"${nodePath}" --grpc-server --json-server --tcp-port ${port} --config "${configFileLocation}"${
          savedMiningParams ? ` --coinbase 0x${savedMiningParams.coinbase} --start-mining --post-datadir "${savedMiningParams.logicalDrive}"` : ''
        } -d "${nodeDataFilesPath}" >> "${logFilePath}"`;
        exec(nodePathWithParams, (error) => {
          if (error) {
            (process.env.NODE_ENV !== 'production' || process.env.DEBUG_PROD === 'true') && dialog.showErrorBox('Smesher Error', `${error}`);
            console.error(error); // eslint-disable-line no-console
          }
        });
      }
    } catch (e) {
      dialog.showErrorBox('Parsing json failed', `${e}`);
      console.error('Parsing json failed', `${e}`); // eslint-disable-line no-console
    }
  };

  stopNode = async ({ browserWindow }) => {
    const closeApp = async () => {
      browserWindow.destroy();
      app.quit();
    };
    const stopNodeCycle = async (attempt) => {
      const nodeProcesses = await find('name', 'go-spacemesh');
      if (attempt > 15) {
        if (nodeProcesses && nodeProcesses.length) {
          exec(os.type() === 'Windows_NT' ? 'taskkill /F /IM go-spacemesh.exe' : `kill -9 ${nodeProcesses[1].pid}`);
        }
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
        exec(os.type() === 'Windows_NT' ? 'taskkill /F /IM go-spacemesh.exe' : `kill -s INT ${nodeProcesses[1].pid}`, async (err) => {
          if (err) {
            console.error(err); // eslint-disable-line no-console
          }
          await stopNodeCycle(0);
        });
      } else {
        await closeApp();
      }
    } catch (err) {
      // could not find or kill node process
      console.error(err); // eslint-disable-line no-console
      await closeApp();
    }
  };

  getNodeSettings = async () => {
    try {
      const networkId = StoreService.get({ key: 'networkId' });
      const savedMiningParams = StoreService.get({ key: `${networkId}-miningParams` });
      const address = savedMiningParams?.coinbase;
      const genesisTime = StoreService.get({ key: `${networkId}-genesisTime` });
      const commitmentSize = StoreService.get({ key: `${networkId}-postSize` });
      const layerDuration = StoreService.get({ key: `${networkId}-layerDurationSec` });
      const port = StoreService.get({ key: `${networkId}-port` }) || DEFAULT_PORT;
      const { value } = await netService.getStateRoot();
      return { address, genesisTime, networkId, commitmentSize, layerDuration, stateRootHash: value, port };
    } catch (error) {
      return { error };
    }
  };

  getNodeStatus = async () => {
    try {
      const status = await netService.getNodeStatus();
      const parsedStatus = {
        peers: parseInt(status.peers),
        minPeers: parseInt(status.minPeers),
        maxPeers: parseInt(status.maxPeers),
        synced: status.synced,
        syncedLayer: parseInt(status.syncedLayer),
        currentLayer: parseInt(status.currentLayer),
        verifiedLayer: parseInt(status.verifiedLayer)
      };
      return { status: parsedStatus, error: null };
    } catch (error) {
      return { status: null, error };
    }
  };

  selectPostFolder = async ({ mainWindow }) => {
    const { filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: 'Select folder for smeshing',
      defaultPath: app.getPath('documents'),
      properties: ['openDirectory']
    });
    try {
      fs.accessSync(filePaths[0], fs.constants.W_OK);
      const diskSpace = await checkDiskSpace(filePaths[0]);
      return { selectedFolder: filePaths[0], freeSpace: diskSpace.free };
    } catch (error) {
      return { error };
    }
  };

  getMiningStatus = async () => {
    try {
      const { status } = await netService.getMiningStatus();
      return { error: null, status };
    } catch (error) {
      return { error, status: null };
    }
  };

  initMining = async ({ logicalDrive, commitmentSize, coinbase }) => {
    try {
      await netService.initMining({ logicalDrive, commitmentSize, coinbase });
      const networkId = StoreService.get({ key: 'networkId' });
      StoreService.set({ key: `${networkId}-miningParams`, value: { logicalDrive, coinbase } });
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  getUpcomingRewards = async () => {
    try {
      const { layers } = await netService.getUpcomingAwards();
      if (!layers) {
        return { error: null, layers: [] };
      }
      const resolvedLayers = layers || [];
      const parsedLayers = resolvedLayers.map((layer) => parseInt(layer));
      parsedLayers.sort((a, b) => a - b);
      return { error: null, layers: parsedLayers };
    } catch (error) {
      return { error: error.message, layers: null };
    }
  };

  setRewardsAddress = async ({ address }) => {
    try {
      await netService.setAwardsAddress({ address });
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  setNodeIpAddress = ({ nodeIpAddress }) => {
    try {
      netService.setNodeIpAddress({ nodeIpAddress });
      return { error: null };
    } catch (error) {
      return { error };
    }
  };
}

export default NodeManager;
