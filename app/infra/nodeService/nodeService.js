// @flow
import { ipcRenderer } from 'electron';
import { ipcConsts } from '/vars';
import { listenerCleanup } from '/infra/utils';

class NodeService {
  static startNode() {
    ipcRenderer.send(ipcConsts.START_NODE);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.START_NODE_SUCCESS, () => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.START_NODE_SUCCESS, ipcConsts.START_NODE_FAILURE] });
        resolve();
      });
      ipcRenderer.once(ipcConsts.START_NODE_FAILURE, (event, args) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.START_NODE_SUCCESS, ipcConsts.START_NODE_FAILURE] });
        reject(args);
      });
    });
  }

  static hardRefresh() {
    ipcRenderer.send(ipcConsts.HARD_REFRESH);
  }

  static killNodeProcess() {
    ipcRenderer.send(ipcConsts.QUIT_NODE);
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      ipcRenderer.once(ipcConsts.QUIT_NODE_SUCCESS, () => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.QUIT_NODE_SUCCESS, ipcConsts.QUIT_NODE_FAILURE] });
        resolve();
      });
      ipcRenderer.once(ipcConsts.QUIT_NODE_FAILURE, (event, args) => {
        listenerCleanup({ ipcRenderer, channels: [ipcConsts.QUIT_NODE_SUCCESS, ipcConsts.QUIT_NODE_FAILURE] });
        reject(args);
      });
    });
  }
}

export default NodeService;
