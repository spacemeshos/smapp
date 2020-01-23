import path from 'path';
import os from 'os';
import { app } from 'electron';
import { ipcConsts } from '../app/vars';

const { execFile, exec } = require('child_process');
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

  static tmpRunNodeFunc = ({ port }) => {
    const homeDirPath = app.getPath('home');
    const dataPath = path.resolve(homeDirPath, 'spacemesh');
    const testDataPath = path.resolve(homeDirPath, 'spacemeshtestdata');
    const postDataPath = path.resolve(homeDirPath, 'post');
    const logFilePath = path.resolve(app.getPath('documents'), 'spacemeshLog.txt');
    const command =
      os.type() === 'windows'
        ? `rmdir /q/s ${dataPath} && rmdir /q/s ${testDataPath} && rmdir /q/s ${postDataPath} && del ${logFilePath}`
        : `rm -rf ${dataPath} && rm -rf ${testDataPath} && rm -rf ${postDataPath} && rm -rf ${logFilePath}`;
    exec(command, (err) => {
      if (!err) {
        const pathWithParams = `./go-spacemesh --grpc-server --json-server --tcp-port ${port} --poet-server spacemesh-testnet-poet-grpc-lb-949d0cde858743fb.elb.us-east-1.amazonaws.com:50002 --post-space 8589934592 --test-mode --randcon 8 --layer-duration-sec 180 --hare-wakeup-delta 30 --hare-round-duration-sec 30 --layers-per-epoch 480 --eligibility-confidence-param 200 --eligibility-epoch-offset 0 --layer-average-size 50 --genesis-active-size 300 --hare-committee-size 50 --hare-max-adversaries 24 --sync-request-timeout 60000 --post-labels 100 --max-inbound 12 --genesis-time 2020-01-08T21:31:19+00:00 --bootstrap --bootnodes spacemesh://3augAJDbLGyXGfGxQT3GvTPaBdvbDLx8tyH7vZrGnRJT@54.180.96.161:64587 -d ~/spacemeshtestdata/ > ${logFilePath}`;
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
  };
}

export default NodeManager;
