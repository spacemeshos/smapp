import { NodeStartupState } from '../../shared/types';

export default class NodeStartupStateStore {
  private static status: NodeStartupState = NodeStartupState.Starting;

  static setStatus = (status: NodeStartupState) => {
    NodeStartupStateStore.status = status;
    return status;
  };

  static getStatus = () => NodeStartupStateStore.status;

  static isReady = () =>
    NodeStartupStateStore.status === NodeStartupState.Ready;
}
