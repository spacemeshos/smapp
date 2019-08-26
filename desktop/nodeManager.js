import path from 'path';
import os from 'os';
import { ipcConsts } from '../app/vars';

const child = require('child_process').execFile;

const osTargetNames = {
  Darwin: 'mac',
  Linux: 'linux',
  Windows_NT: 'windows'
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
    child(executablePath, (err) => {
      if (err) {
        event.sender.send(ipcConsts.START_NODE_FAILURE, err.message);
      }
      event.sender.send(ipcConsts.START_NODE_SUCCESS);
    });
  };

  static hardRefresh = ({ browserWindow }) => browserWindow.reload();
}

export default NodeManager;
