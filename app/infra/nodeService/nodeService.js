// @flow
import { ipcRenderer } from 'electron';
import { ipcConsts } from '/vars';
import { listenerCleanup } from '/infra/utils';
import { notificationsService } from '/infra/notificationsService';

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

  static minerRunningInBackgroundNotification() {
    ipcRenderer.once(ipcConsts.SHOW_MINER_RUNNING_NOTIFICATION, () => {
      listenerCleanup({ ipcRenderer, channels: [ipcConsts.SHOW_MINER_RUNNING_NOTIFICATION] });
      notificationsService.notify({
        title: 'Spacemesh',
        notification: 'Miner is running in the background.'
      });
    });
  }
}

NodeService.minerRunningInBackgroundNotification();
export default NodeService;
