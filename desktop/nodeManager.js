import path from 'path';
import os from 'os';
import fs from 'fs';
import { app, ipcMain, dialog } from 'electron';
import { ipcConsts } from '../app/vars';
import StoreService from './storeService';
import netService from './netService';
import nodeConfig from './config.json';

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
    });
    ipcMain.once(ipcConsts.STOP_NODE, async (event) => {
      await this.stopNode({ event, browserWindow: mainWindow });
    });
    ipcMain.on(ipcConsts.GET_NODE_SETTINGS, async (event) => {
      await this.getNodeSettings({ event });
    });
    ipcMain.on(ipcConsts.GET_NODE_STATUS, async (event) => {
      await this.getNodeStatus({ event });
    });
    ipcMain.once(ipcConsts.SET_NODE_PORT, (event, request) => {
      this.setPort({ ...request.data });
    });
    ipcMain.on(ipcConsts.SELECT_POST_FOLDER, async (event) => {
      await this.selectPostFolder({ event, mainWindow });
    });
    ipcMain.on(ipcConsts.GET_MINING_STATUS, async (event) => {
      await this.getMiningStatus({ event });
    });
    ipcMain.on(ipcConsts.INIT_MINING, async (event, request) => {
      await this.initMining({ event, ...request.data });
    });
    ipcMain.on(ipcConsts.GET_UPCOMING_REWARDS, (event) => {
      this.getUpcomingRewards({ event });
    });
    ipcMain.on(ipcConsts.SET_REWARDS_ADDRESS, (event, request) => {
      this.setRewardsAddress({ event, ...request.data });
    });
    ipcMain.on(ipcConsts.SET_NODE_IP, async (event, request) => {
      this.setNodeIpAddress({ event, ...request.data });
    });
  };

  startNode = async () => {
    try {
      const fetchedGenesisTime = nodeConfig.main['genesis-time'];
      const prevGenesisTime = StoreService.get({ key: 'genesisTime' }) || '';

      const port = StoreService.get({ key: 'port' }) || DEFAULT_PORT;

      StoreService.set({ key: 'postSize', value: parseInt(nodeConfig.post['post-space']) });
      const networkId = parseInt(nodeConfig.p2p['network-id']);
      StoreService.set({ key: 'networkId', value: networkId });
      StoreService.set({ key: 'layerDurationSec', value: parseInt(nodeConfig.main['layer-duration-sec']) });

      const userDataPath = app.getPath('userData');
      const nodePath = path.resolve(
        app.getAppPath(),
        process.env.NODE_ENV === 'development' ? `../node/${osTargetNames[os.type()]}/` : '../../node/',
        `go-spacemesh${osTargetNames[os.type()] === 'windows' ? '.exe' : ''}`
      );
      const nodeDataFilesPath = path.resolve(`${userDataPath}`, 'node-data', `${networkId}`);
      const logFilePath = path.resolve(`${userDataPath}`, 'spacemesh-log.txt');

      const configFileLocation = path.resolve(app.getAppPath(), './config.json');

      if (prevGenesisTime !== fetchedGenesisTime) {
        const command = os.type() === 'Windows_NT' ? `if exist ${logFilePath} del ${logFilePath}` : `rm -rf ${logFilePath}`;
        exec(command, async (err) => {
          if (!err) {
            StoreService.set({ key: 'genesisTime', value: fetchedGenesisTime });
            StoreService.remove({ key: 'miningParams' });
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
        const savedMiningParams = StoreService.get({ key: 'miningParams' });
        const nodePathWithParams = `"${nodePath}" --grpc-server --json-server --tcp-port ${port} --config "${configFileLocation}"${
          savedMiningParams ? ` --coinbase 0x${savedMiningParams.coinbase} --start-mining --post-datadir "${savedMiningParams.logicalDrive}"` : ''
        } -d "${nodeDataFilesPath}" >> "${logFilePath}"`;
        exec(nodePathWithParams, (error) => {
          if (error) {
            (process.env.NODE_ENV !== 'production' || process.env.DEBUG_PROD === 'true') && dialog.showErrorBox('Smesher Error', `${error}`);
            console.error(error); // eslint-disable-line no-console
          }
          console.log('node started with provided params'); // eslint-disable-line no-console
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

  getNodeSettings = async ({ event }) => {
    const savedMiningParams = StoreService.get({ key: 'miningParams' });
    const address = savedMiningParams?.coinbase;
    const genesisTime = StoreService.get({ key: 'genesisTime' });
    const networkId = StoreService.get({ key: 'networkId' });
    const commitmentSize = StoreService.get({ key: 'postSize' });
    const layerDuration = StoreService.get({ key: 'layerDurationSec' });
    const port = StoreService.get({ key: 'port' }) || DEFAULT_PORT;
    const { value } = await netService.getStateRoot();
    event.sender.send(ipcConsts.GET_NODE_SETTINGS_RESPONSE, { address, genesisTime, networkId, commitmentSize, layerDuration, stateRootHash: value, port });
  };

  getNodeStatus = async ({ event }) => {
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
      event.sender.send(ipcConsts.GET_NODE_STATUS_RESPONSE, { status: parsedStatus, error: null });
    } catch (error) {
      event.sender.send(ipcConsts.GET_NODE_STATUS_RESPONSE, { status: null, error });
    }
  };

  setPort = ({ port }) => {
    StoreService.set({ key: 'port', value: port });
  };

  selectPostFolder = async ({ event, mainWindow }) => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: 'Select folder for smeshing',
      defaultPath: app.getPath('documents'),
      properties: ['openDirectory']
    });
    if (canceled || !filePaths.length) {
      event.sender.send(ipcConsts.SELECT_POST_FOLDER_RESPONSE, { error: 'no folder selected' });
    } else {
      try {
        fs.accessSync(filePaths[0], fs.constants.W_OK);
        const diskSpace = await checkDiskSpace(filePaths[0]);
        event.sender.send(ipcConsts.SELECT_POST_FOLDER_RESPONSE, { selectedFolder: filePaths[0], freeSpace: diskSpace.free });
      } catch (err) {
        event.sender.send(ipcConsts.SELECT_POST_FOLDER_RESPONSE, { error: err });
      }
    }
  };

  getMiningStatus = async ({ event }) => {
    try {
      const { status } = await netService.getMiningStatus();
      event.sender.send(ipcConsts.GET_MINING_STATUS_RESPONSE, { error: null, status });
    } catch (error) {
      event.sender.send(ipcConsts.GET_MINING_STATUS_RESPONSE, { error, status: null });
    }
  };

  initMining = async ({ event, logicalDrive, commitmentSize, coinbase }) => {
    try {
      await this._initMining({ logicalDrive, commitmentSize, coinbase });
      StoreService.set({ key: 'miningParams', value: { logicalDrive, coinbase } });
      event.sender.send(ipcConsts.INIT_MINING_RESPONSE, { error: null });
    } catch (error) {
      event.sender.send(ipcConsts.INIT_MINING_RESPONSE, { error });
    }
  };

  getUpcomingRewards = async ({ event }) => {
    try {
      const { layers } = await netService.getUpcomingAwards();
      if (!layers) {
        event.sender.send(ipcConsts.GET_UPCOMING_REWARDS_RESPONSE, { error: null, layers: [] });
      }
      const resolvedLayers = layers || [];
      const parsedLayers = resolvedLayers.map((layer) => parseInt(layer));
      parsedLayers.sort((a, b) => a - b);
      event.sender.send(ipcConsts.GET_UPCOMING_REWARDS_RESPONSE, { error: null, layers: parsedLayers });
    } catch (error) {
      event.sender.send(ipcConsts.GET_UPCOMING_REWARDS_RESPONSE, { error: error.message, layers: null });
    }
  };

  setRewardsAddress = async ({ event, address }) => {
    try {
      await netService.setAwardsAddress({ address });
      event.sender.send(ipcConsts.SET_AWARDS_ADDRESS_RESPONSE, { error: null });
    } catch (error) {
      event.sender.send(ipcConsts.SET_AWARDS_ADDRESS_RESPONSE, { error });
    }
  };

  setNodeIpAddress = ({ event, nodeIpAddress }) => {
    try {
      netService.setNodeIpAddress({ nodeIpAddress });
      event.sender.send(ipcConsts.SET_NODE_IP_RESPONSE, { error: null });
    } catch (error) {
      event.sender.send(ipcConsts.SET_NODE_IP_RESPONSE, { error });
    }
  };
}

export default NodeManager;
