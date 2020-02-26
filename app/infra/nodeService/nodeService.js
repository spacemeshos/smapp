// @flow
import { ipcRenderer } from 'electron';
import { ipcConsts } from '/vars';

class NodeService {
  static hardRefresh() {
    ipcRenderer.send(ipcConsts.HARD_REFRESH);
  }

  static startNode = () => {
    ipcRenderer.send(ipcConsts.START_NODE);
  };

  static getNodeSettings = () => {
    ipcRenderer.send(ipcConsts.GET_NODE_SETTINGS);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.GET_NODE_SETTINGS_RESPONSE, (event, response) => {
        if (response.error) {
          reject(response.error);
        }
        resolve(response);
      });
    });
  };

  static getCommitmentSize = () => {
    ipcRenderer.send(ipcConsts.GET_COMMITMENT_SIZE);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.GET_COMMITMENT_SIZE_RESPONSE, (event, response) => {
        if (response.error) {
          reject(response.error);
        }
        resolve(response.commitmentSize);
      });
    });
  };

  static getPort = () => {
    ipcRenderer.send(ipcConsts.GET_NODE_PORT);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.GET_NODE_PORT_RESPONSE, (event, response) => {
        if (response.error) {
          reject(response.error);
        }
        resolve(response.port);
      });
    });
  };

  static setPort = ({ port }: { port: string }) => {
    ipcRenderer.send(ipcConsts.SET_NODE_PORT, { port });
  };
}

export default NodeService;
