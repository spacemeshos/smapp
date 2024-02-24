import { RootState } from '../../types';
import { isMainNet } from '../network/selectors';

export const getNodeStatus = (state: RootState) => state.node.status;
export const getNodeStartupState = (state: RootState) =>
  state.node.startupStatus;
export const getNodeError = (state: RootState) => state.node.error;

export const isQuicksyncEnabled = (state: RootState) => {
  const nodeStatus = state.node.status;
  return isMainNet(state) && (!nodeStatus || !nodeStatus?.isSynced);
};
