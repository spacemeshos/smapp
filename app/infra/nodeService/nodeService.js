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

  static getLayerDurationSec = () => {
    ipcRenderer.send(ipcConsts.GET_LAYER_DURATION_SEC);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.GET_LAYER_DURATION_SEC_RESPONSE, (event, response) => {
        if (response.error) {
          reject(response.error);
        }
        resolve(response.layerDuration);
      });
    });
  };

  static getRewardsAddress = () => {
    ipcRenderer.send(ipcConsts.GET_REWARDS_ADDRESS);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.GET_REWARDS_ADDRESS_RESPONSE, (event, response) => {
        if (response.error) {
          reject(response.error);
        }
        resolve(response.address);
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
