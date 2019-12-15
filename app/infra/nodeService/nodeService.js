// @flow
import { ipcRenderer } from 'electron';
import { ipcConsts } from '/vars';

class NodeService {
  static startNode() {
    ipcRenderer.send(ipcConsts.START_NODE);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.START_NODE_RESPONSE, (event, response) => {
        if (response.error) {
          reject(response.error);
        }
        resolve();
      });
    });
  }

  static hardRefresh() {
    ipcRenderer.send(ipcConsts.HARD_REFRESH);
  }
}

export default NodeService;
