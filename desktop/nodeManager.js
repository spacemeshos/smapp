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

const getPidByName = async ({ name }) => {
  try {
    const list = await find('name', name);
    return list.length && list[0].pid ? list[0].pid : null;
  } catch {
    return null;
  }
};

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
    child(executablePath, (err) => {
      if (err) {
        event.sender.send(ipcConsts.START_NODE_FAILURE, err.message);
      }
      event.sender.send(ipcConsts.START_NODE_SUCCESS);
    });
  };

  static hardRefresh = ({ browserWindow }) => browserWindow.reload();

  static killNodeProcess = async ({ event }) => {
    try {
      const isDevMode = process.env.NODE_ENV === 'development';
      // TODO: remove this when dev mode uses binary node file
      if (isDevMode) {
        event.sender.send(ipcConsts.QUIT_NODE_SUCCESS);
      } else {
        const pid = await getPidByName({ name: 'go-spacemesh' });
        if (pid === null) {
          event.sender.send(ipcConsts.QUIT_NODE_FAILURE, 'process corresponding with go-spacemesh was not found!');
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
