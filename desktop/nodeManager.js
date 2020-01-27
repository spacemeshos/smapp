import path from 'path';
import os from 'os';
import fs from 'fs';
import util from 'util';
import { app } from 'electron';
import { ipcConsts } from '../app/vars';
import FileManager from './fileManager';

const { execFile, exec } = require('child_process');
const fetch = require('node-fetch');
const toml = require('toml');
const find = require('find-process');

const writeFileAsync = util.promisify(fs.writeFile);

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
        const command = `kill -s INT ${processes[0].pid} ${processes[1].pid}`;
        exec(command, (err) => {
          if (err) {
            console.error(); // eslint-disable-line no-console
          }
          event.returnValue = null; // eslint-disable-line no-param-reassign
        });
      }
      // }
    } catch (err) {
      // could not find or kill node process
      event.returnValue = null; // eslint-disable-line no-param-reassign
    }
  };

  static tmpRunNodeFunc = async ({ port, store }) => {
    const rawData = await fetch('http://nodes.unruly.io');
    const tomlData = await rawData.text();
    try {
      const parsedToml = toml.parse(tomlData);
      const fetchedGenesisTime = parsedToml.main['genesis-time'];
      const prevGenesisTime = store.get('genesisTime') || '';
      const homeDirPath = app.getPath('home');
      const dataPath = path.resolve(homeDirPath, 'spacemesh');
      const testDataPath = path.resolve(homeDirPath, 'spacemeshtestdata');
      const postDataPath = path.resolve(homeDirPath, 'post');
      const logFilePath = path.resolve(app.getPath('documents'), 'spacemeshLog.txt');
      const pathWithParams = `./go-spacemesh --grpc-server --json-server --tcp-port ${port} -d ~/spacemeshtestdata/ >> ${logFilePath}`;
      await writeFileAsync('./config.toml', tomlData);
      if (prevGenesisTime !== fetchedGenesisTime) {
        store.set('genesisTime', fetchedGenesisTime);
        await FileManager.cleanWalletFile();
        const command =
          os.type() === 'windows'
            ? `rmdir /q/s ${dataPath} && rmdir /q/s ${testDataPath} && rmdir /q/s ${postDataPath}`
            : `rm -rf ${dataPath} && rm -rf ${testDataPath} && rm -rf ${postDataPath}`;
        exec(command, (err) => {
          if (!err) {
            exec(pathWithParams, (error) => {
              if (error) {
                console.error(error); // eslint-disable-line no-console
              }
              console.log('node started with provided params'); // eslint-disable-line no-console
            });
          } else {
            console.error(err); // eslint-disable-line no-console
          }
        });
      } else {
        exec(pathWithParams, (error) => {
          if (error) {
            console.error(error); // eslint-disable-line no-console
          }
          console.log('node started with provided params'); // eslint-disable-line no-console
        });
      }
    } catch (e) {
      console.error(`Parsing error on line ${e.line}, column ${e.column}: ${e.message}`); // eslint-disable-line no-console
    }
  };
}

export default NodeManager;
