import path from 'path';
import os from 'os';
import { ipcConsts } from '../app/vars';

const child = require('child_process').execFile;
const find = require('find-process');

const osTargetNames = {
  Darwin: 'mac',
  Linux: 'linux',
  Windows_NT: 'windows'
};

const getPidByName = ({ name }) => {
  return new Promise((resolve, reject) => {
    try {
      find('name', name).then((list) => {
        resolve(list?.length && list[0].pid ? list[0].pid : null);
      });
    } catch {
      reject();
    }
  });
};

const runExecutablePath = ({ event, executablePath, eventIdSuccess, eventIdFailure }) => {
  child(executablePath, (err) => {
    if (err) {
      event.sender.send(eventIdFailure, err.message);
    }
    event.sender.send(eventIdSuccess);
  });
};

class NodeManager {
  static startNode = async ({ event }) => {
    const isDevMode = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
    if (Object.keys(osTargetNames).indexOf(os.type()) < 0) {
      event.sender.send(ipcConsts.START_NODE_FAILURE, 'OS not supported.');
    }
    const osTarget = osTargetNames[os.type()];
    const devPath = './miniMesh.sh';
    // TODO: should change prodPath to actual executable file path in prod.
    const prodPath = path.resolve(`${process.resourcesPath}/../node/${osTarget}/${osTarget === 'windows' ? '' : osTarget}go-spacemesh${osTarget === 'windows' ? '.exe' : ''}`);
    const executablePath = isDevMode ? devPath : prodPath;
    runExecutablePath({ event, executablePath, eventIdSuccess: ipcConsts.START_NODE_SUCCESS, eventIdFailure: ipcConsts.START_NODE_FAILURE });
  };

  static hardRefresh = ({ browserWindow }) => browserWindow.reload();

  static killNodeProcess = async ({ event }) => {
    try {
      const isDevMode = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
      if (isDevMode) {
        event.sender.send(ipcConsts.QUIT_NODE_SUCCESS);
      } else {
        const pid = await getPidByName({ name: 'go-spacemesh' });
        if (pid === null) {
          throw new Error(`process corresponding with go-spacemesh was not found!`);
        }
        process.kill(pid, 'SIGINT');
        event.sender.send(ipcConsts.QUIT_NODE_SUCCESS);
      }
    } catch (err) {
      event.sender.send(ipcConsts.QUIT_NODE_FAILURE, err.message);
    }
  };
}

export default NodeManager;
