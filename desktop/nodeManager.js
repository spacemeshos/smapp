import path from 'path';
import os from 'os';
import { app, dialog } from 'electron';
import { ipcConsts } from '../app/vars';
import FileSystemManager from './fileSystemManager';
import StoreService from './storeService';
import NetService from './netService';

const { exec } = require('child_process');
const fetch = require('node-fetch');
const toml = require('toml');
const find = require('find-process');

const osTargetNames = {
  Darwin: 'mac',
  Linux: 'linux',
  Windows_NT: 'windows'
};

const DEFAULT_PORT = '7153';

class NodeManager {
  static startNode = async () => {
    try {
      const rawData = await fetch('http://ae7809a90692211ea8d4d0ea80dce922-597797094.us-east-1.elb.amazonaws.com/');
      const tomlData = await rawData.text();
      const parsedToml = toml.parse(tomlData);

      const fetchedGenesisTime = parsedToml.main['genesis-time'];
      const prevGenesisTime = StoreService.get({ key: 'genesisTime' }) || '';

      const port = StoreService.get({ key: 'port' }) || DEFAULT_PORT;

      StoreService.set({ key: 'postSize', value: parseInt(parsedToml.post['post-space']) });
      StoreService.set({ key: 'networkId', value: parseInt(parsedToml.p2p['network-id']) });
      StoreService.set({ key: 'layerDurationSec', value: parseInt(parsedToml.main['layer-duration-sec']) });

      const userDataPath = app.getPath('userData');
      const nodePath = path.resolve(
        app.getAppPath(),
        process.env.NODE_ENV === 'development' ? `../node/${osTargetNames[os.type()]}/` : '../../node/',
        `go-spacemesh${osTargetNames[os.type()] === 'windows' ? '.exe' : ''}`
      );
      const tomlFileLocation = path.resolve(`${userDataPath}`, 'config.toml');
      const nodeDataFilesPath = path.resolve(`${userDataPath}`, 'spacemeshtestdata');
      const logFilePath = path.resolve(`${userDataPath}`, 'spacemesh-log.txt');

      await FileSystemManager._writeFile({ filePath: `${tomlFileLocation}`, fileContent: tomlData });

      if (prevGenesisTime !== fetchedGenesisTime) {
        StoreService.set({ key: 'genesisTime', value: fetchedGenesisTime });
        StoreService.remove({ key: 'savedMiningParams' });
        await FileSystemManager.cleanWalletFile();
        const command =
          os.type() === 'Windows_NT'
            ? `(if exist ${nodeDataFilesPath} rd /s /q ${nodeDataFilesPath}) && (if exist ${logFilePath} del ${logFilePath})`
            : `rm -rf ${nodeDataFilesPath} && rm -rf ${logFilePath}`;
        exec(command, (err) => {
          if (!err) {
            const nodePathWithParams = `"${nodePath}" --grpc-server --json-server --tcp-port ${port} --config "${tomlFileLocation}" -d "${nodeDataFilesPath}" > "${logFilePath}"`;
            exec(nodePathWithParams, (error) => {
              if (error) {
                (process.env.NODE_ENV !== 'production' || process.env.DEBUG_PROD === 'true') && dialog.showErrorBox('Smesher Start Error', `${error}`);
                console.error(error); // eslint-disable-line no-console
              }
              console.log('node started with provided params'); // eslint-disable-line no-console
            });
          } else {
            dialog.showErrorBox('Old data files removal failed', `${err}`);
            console.error(err); // eslint-disable-line no-console
          }
        });
      } else {
        const savedMiningParams = StoreService.get({ key: 'miningParams' });
        const nodePathWithParams = `"${nodePath}" --grpc-server --json-server --tcp-port ${port} --config "${tomlFileLocation}"${
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
      if (e.line) {
        dialog.showErrorBox('Parsing toml failed', `${e}`);
        console.error(`Parsing error on line ${e.line}, column ${e.column}: ${e.message}`); // eslint-disable-line no-console
      } else {
        dialog.showErrorBox('Failed to download settings file.', 'Check your internet connection and restart the app');
        console.error(`Failed to download settings file: ${e.message}`); // eslint-disable-line no-console
      }
    }
  };

  static hardRefresh = ({ browserWindow }) => browserWindow.reload();

  static stopNode = async ({ browserWindow }) => {
    const closeApp = async () => {
      await FileSystemManager.cleanUp();
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

  static getCommitmentSize = ({ event }) => {
    event.sender.send(ipcConsts.GET_COMMITMENT_SIZE_RESPONSE, { commitmentSize: StoreService.get({ key: 'postSize' }) });
  };

  static getPort = ({ event }) => {
    event.sender.send(ipcConsts.GET_NODE_PORT_RESPONSE, { port: StoreService.get({ key: 'port' }) || DEFAULT_PORT });
  };

  static setPort = ({ port }) => {
    StoreService.set({ key: 'port', value: port });
  };

  static getNodeSettings = async ({ event }) => {
    const savedMiningParams = StoreService.get({ key: 'miningParams' });
    const address = savedMiningParams?.coinbase;
    const genesisTime = StoreService.get({ key: 'genesisTime' });
    const networkId = StoreService.get({ key: 'networkId' });
    const commitmentSize = StoreService.get({ key: 'postSize' });
    const layerDuration = StoreService.get({ key: 'layerDurationSec' });
    const stateRootHash = await NetService.getStateRoot();
    event.sender.send(ipcConsts.GET_NODE_SETTINGS_RESPONSE, { address, genesisTime, networkId, commitmentSize, layerDuration, stateRootHash });
  };
}

export default NodeManager;
