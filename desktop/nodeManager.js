import path from 'path';
import os from 'os';
import { ipcConsts } from '../app/vars';

const { execFile, exec } = require('child_process');
const find = require('find-process');

const osTargetNames = {
  Darwin: 'mac',
  Linux: 'linux',
  Windows_NT: 'windows'
};

const getPidByName = ({ name }) => {
  return find('name', name).then((list) => {
    return list.length && list[0].pid ? list[0].pid : null;
  });
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
      const isDevMode = process.env.NODE_ENV === 'development';
      if (isDevMode) {
        // eslint-disable-next-line no-param-reassign
        event.returnValue = null;
      } else {
        const pid = await getPidByName({ name: 'go-spacemesh' });
        process.kill(pid, 'SIGINT');
        // eslint-disable-next-line no-param-reassign
        event.returnValue = pid;
      }
    } catch (err) {
      // could not find or kill node process
      // eslint-disable-next-line no-param-reassign
      event.returnValue = null;
    }
  };

  static tmpRunNodeFunc = ({ port }) => {
    // const osTarget = osTargetNames[os.type()];
    // const nodePath = path.resolve(`${process.resourcesPath}/../node/${osTarget}/${osTarget}go-spacemesh`);
    const pathWithParams = `./go-spacemesh --grpc-server --json-server --tcp-port ${port} --poet-server spacemesh-testnet-poet-grpc-lb-949d0cde858743fb.elb.us-east-1.amazonaws.com:50002 --test-mode --randcon 8 --layer-duration-sec 180 --hare-wakeup-delta 30 --hare-round-duration-sec 30 --layers-per-epoch 480 --eligibility-confidence-param 200 --eligibility-epoch-offset 0 --layer-average-size 50 --genesis-active-size 300 --hare-committee-size 50 --hare-max-adversaries 24 --sync-request-timeout 60000 --post-labels 100 --max-inbound 12 --genesis-time 2020-01-06T16:23:33+00:00 --bootstrap --bootnodes spacemesh://EJ7QrHgAxvoBkMvmymrAwj48Lo2vTW1ifHetxqkD9Xtj@13.124.21.203:65417 -d ~/spacemeshtestdata/ > log.txt`;
    exec(pathWithParams, (error) => {
      if (error) {
        console.error(error); // eslint-disable-line no-console
      }
      console.log('node started with provided params'); // eslint-disable-line no-console
    });
  };
}

export default NodeManager;
