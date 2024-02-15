import { RootState } from '../../types';
import { isMainNet } from '../network/selectors';

export const getNodeStatus = (state: RootState) => state.node.status;
export const getNodeStartupState = (state: RootState) =>
  state.node.startupStatus;
export const getNodeError = (state: RootState) => state.node.error;

export const isQuicksyncAvailable = (state: RootState) => {
  const quicksync = state.node.quicksyncStatus;
  return (
    isMainNet(state) &&
    quicksync &&
    quicksync.current - 100 > quicksync.db &&
    quicksync.available > quicksync.db
  );
};
