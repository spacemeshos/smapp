import path from 'path';
import os from 'os';
import { app, dialog } from 'electron';
import { ipcConsts } from '../app/vars';
import FileManager from './fileManager';
import StoreService from './storeService';

const { execFile, exec } = require('child_process');
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
  static startNode = async ({ event }) => {
    const isDevMode = process.env.NODE_ENV === 'development';
    if (Object.keys(osTargetNames).indexOf(os.type()) < 0) {
      event.sender.send(ipcConsts.START_NODE_FAILURE, 'OS not supported.');
    }
    const osTarget = osTargetNames[os.type()];
    // TODO: remove this and change to binary file path when dev mode uses binary node file
    const devPath = './miniMesh.sh';
    // TODO: should change prodPath to actual executable file path in prod.
    const prodPath = path.resolve(`${process.resourcesPath}/../node/${osTarget}/${osTarget === 'windows' ? '' : osTarget}go-spacemesh${osTarget === 'windows' ? '.exe' : ''}`);
    const executablePath = isDevMode ? devPath : prodPath;
    execFile(executablePath, (error) => {
      if (error) {
        event.sender.send(ipcConsts.START_NODE_RESPONSE, { error });
      }
      event.sender.send(ipcConsts.START_NODE_RESPONSE, { error: null });
    });
  };

  static hardRefresh = ({ browserWindow }) => browserWindow.reload();

  static killNodeProcess = async ({ event }) => {
    try {
      const processes = await getPidByName({ name: 'go-spacemesh' });
      if (processes) {
        const command = `kill -s INT ${processes[1].pid}`;
        exec(command, (err) => {
          if (err) {
            console.error(err); // eslint-disable-line no-console
            event.returnValue = null; // eslint-disable-line no-param-reassign
          }
          event.returnValue = null; // eslint-disable-line no-param-reassign
        });
      }
      event.returnValue = null; // eslint-disable-line no-param-reassign
    } catch (err) {
      // could not find or kill node process
      console.error(err); // eslint-disable-line no-console
      event.returnValue = null; // eslint-disable-line no-param-reassign
    }
  };

  static tmpRunNodeFunc = async ({ port }) => {
    try {
      const rawData = await fetch('http://nodes.unruly.io');
      const tomlData = await rawData.text();
      const parsedToml = toml.parse(tomlData);

      const fetchedGenesisTime = parsedToml.main['genesis-time'];
      const prevGenesisTime = StoreService.get({ key: 'genesisTime' }) || '';

      const userDataPath = app.getPath('userData').replace(' ', '\ '); // eslint-disable-line
      const osTarget = osTargetNames[os.type()];
      const nodePath = path.resolve(
        app.getAppPath(),
        process.env.NODE_ENV === 'development' ? `../node/${osTarget}/` : '../../node/',
        `go-spacemesh${osTarget === 'windows' ? '.exe' : ''}`
      );
      const tomlFileLocation = path.resolve(`${userDataPath}`, 'config.toml');
      const nodeDataFilesPath = path.resolve(`${userDataPath}`, 'spacemeshtestdata/');
      const additionalSlash = os.type() === 'Windows_NT' ? '\\' : '/';
      const logFilePath = path.resolve(`${userDataPath}`, 'spacemesh-log.txt');

      await FileManager._writeFile({ filePath: `${tomlFileLocation}`, fileContent: tomlData });

      if (prevGenesisTime !== fetchedGenesisTime) {
        StoreService.set({ key: 'genesisTime', value: fetchedGenesisTime });
        StoreService.remove({ key: 'savedMiningParams' });
        await FileManager.cleanWalletFile();
        const homeDirPath = app.getPath('home');
        const postDataPath = path.resolve(homeDirPath, 'post');
        const dataPath = path.resolve(`${userDataPath}`, 'spacemesh');
        const command =
          os.type() === 'Windows_NT'
            ? `rd /s /q ${dataPath} && rd /s /q ${nodeDataFilesPath} && rd /s /q ${postDataPath} && del ${logFilePath}`
            : `rm -rf ${dataPath} && rm -rf ${nodeDataFilesPath} && rm -rf ${postDataPath} && rm -rf ${logFilePath}`;
        exec(command, (err) => {
          if (!err) {
            // eslint-disable-next-line max-len
            const nodePathWithParams = `${nodePath} --grpc-server --json-server --tcp-port ${port} --config ${tomlFileLocation} -d ${nodeDataFilesPath} > ${logFilePath}`;
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
        const savedMiningParams = StoreService.get({ key: 'miningParams' });
        const postDataFolder = savedMiningParams && path.resolve(savedMiningParams.logicalDrive, 'post');
        const nodePathWithParams = `${nodePath} --grpc-server --json-server --tcp-port ${port} --config ${tomlFileLocation}${
          savedMiningParams ? ` --coinbase 0x${savedMiningParams.coinbase} --start-mining --post-datadir ${postDataFolder}` : ''
        } -d ${nodeDataFilesPath} >> ${logFilePath}`;
        exec(nodePathWithParams, (error) => {
          if (error) {
            dialog.showErrorBox('Node Start Error', `${error}`);
            console.error(error); // eslint-disable-line no-console
          }
          console.log('node started with provided params'); // eslint-disable-line no-console
        });
      }
    } catch (e) {
      dialog.showErrorBox('Loading / Parsing toml failed', `${e}`);
      console.error(`Parsing error on line ${e.line}, column ${e.column}: ${e.message}`); // eslint-disable-line no-console
    }
  };
}

export default NodeManager;
