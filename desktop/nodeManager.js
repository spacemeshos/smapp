import path from 'path';
import os from 'os';
import { app, dialog } from 'electron';
import { ipcConsts } from '../app/vars';
import FileManager from './fileManager';
import StoreService from './storeService';

const { exec } = require('child_process');
const fetch = require('node-fetch');
const toml = require('toml');
const find = require('find-process');

const osTargetNames = {
  Darwin: 'mac',
  Linux: 'linux',
  Windows_NT: 'windows'
};

const getPidByName = ({ name }) => find('name', name).then((list) => (list.length ? list : null));

class NodeManager {
  static POST_SIZE = 0;

  static hardRefresh = ({ browserWindow }) => browserWindow.reload();

  static killNodeProcess = async ({ event }) => {
    try {
      if (os.type() === 'Windows_NT') {
        exec('taskkill /F /IM go-spacemesh.exe', (err) => {
          if (err) {
            console.error(err); // eslint-disable-line no-console
            event.returnValue = null; // eslint-disable-line no-param-reassign
          }
          event.returnValue = null; // eslint-disable-line no-param-reassign
        });
      } else {
        const processes = await getPidByName({ name: 'go-spacemesh' });
        if (processes) {
          exec(`kill -s INT ${processes[1].pid}`, (err) => {
            if (err) {
              console.error(err); // eslint-disable-line no-console
              event.returnValue = null; // eslint-disable-line no-param-reassign
            }
            event.returnValue = null; // eslint-disable-line no-param-reassign
          });
        }
        event.returnValue = null; // eslint-disable-line no-param-reassign
      }
    } catch (err) {
      // could not find or kill node process
      console.error(err); // eslint-disable-line no-console
      event.returnValue = null; // eslint-disable-line no-param-reassign
    }
  };

  static tmpRunNodeFunc = async ({ port }) => {
    try {
      const rawData = await fetch('http://aa234afcf4aac11ea8d4d0ea80dce922-558418211.us-east-1.elb.amazonaws.com/'); // http://nodes.unruly.io
      const tomlData = await rawData.text();
      const parsedToml = toml.parse(tomlData);

      const fetchedGenesisTime = parsedToml.main['genesis-time'];
      const prevGenesisTime = StoreService.get({ key: 'genesisTime' }) || '';

      NodeManager.POST_SIZE = parsedToml.post['post-space'];

      const userDataPath = app.getPath('userData'); // eslint-disable-line
      const nodePath = path.resolve(
        app.getAppPath(),
        process.env.NODE_ENV === 'development' ? `../node/${osTargetNames[os.type()]}/` : '../../node/',
        `go-spacemesh${osTargetNames[os.type()] === 'windows' ? '.exe' : ''}`
      );
      const tomlFileLocation = path.resolve(`${userDataPath}`, 'config.toml');
      const nodeDataFilesPath = path.resolve(`${userDataPath}`, 'spacemeshtestdata');
      const logFilePath = path.resolve(`${userDataPath}`, 'spacemesh-log.txt');

      await FileManager._writeFile({ filePath: `${tomlFileLocation}`, fileContent: tomlData });

      const savedMiningParams = StoreService.get({ key: 'miningParams' });
      const postDataFolder = savedMiningParams && path.resolve(savedMiningParams.logicalDrive, 'post');

      if (prevGenesisTime !== fetchedGenesisTime) {
        StoreService.set({ key: 'genesisTime', value: fetchedGenesisTime });
        StoreService.remove({ key: 'savedMiningParams' });
        await FileManager.cleanWalletFile();
        const command =
          os.type() === 'Windows_NT'
            ? // eslint-disable-next-line max-len
              `(if exist ${nodeDataFilesPath} rd /s /q ${nodeDataFilesPath}) && (if exist ${postDataFolder} rd /s /q ${postDataFolder}) && (if exist ${logFilePath} del ${logFilePath})`
            : `rm -rf ${nodeDataFilesPath} && rm -rf ${postDataFolder} && rm -rf ${logFilePath}`;
        exec(command, (err) => {
          if (!err) {
            const nodePathWithParams = `"${nodePath}" --grpc-server --json-server --tcp-port ${port} --config "${tomlFileLocation}" -d "${nodeDataFilesPath}" > "${logFilePath}"`;
            exec(nodePathWithParams, (error) => {
              if (error) {
                dialog.showErrorBox('Node Start Error', `${error}`);
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
        const nodePathWithParams = `"${nodePath}" --grpc-server --json-server --tcp-port ${port} --config "${tomlFileLocation}"${
          savedMiningParams ? ` --coinbase 0x${savedMiningParams.coinbase} --start-mining --post-datadir "${postDataFolder}"` : ''
        } -d "${nodeDataFilesPath}" >> "${logFilePath}"`;
        exec(nodePathWithParams, (error) => {
          if (error) {
            dialog.showErrorBox('Node Start Error', `${error}`);
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
        console.error(`Parsing error on line ${e.line}, column ${e.column}: ${e.message}`); // eslint-disable-line no-console
      }
    }
  };

  static getCommitmentSize = ({ event }) => {
    event.sender.send(ipcConsts.GET_COMMITMENT_SIZE_RESPONSE, { commitmentSize: parseInt(NodeManager.POST_SIZE) });
  };
}

export default NodeManager;
