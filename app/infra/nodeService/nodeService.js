// @flow
import { ipcRenderer } from 'electron';
import { ipcConsts } from '/vars';

class NodeService {
  static hardRefresh() {
    ipcRenderer.send(ipcConsts.HARD_REFRESH);
  }

  static tmpRunNodeFunc = ({ port }: { port: number }) => {
    ipcRenderer.send(ipcConsts.TMP_RUN_NODE_CALL, { port });
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
}

export default NodeService;
