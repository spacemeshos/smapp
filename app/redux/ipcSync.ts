import { ipcRenderer } from 'electron';
import { AnyAction, Store } from 'redux';

export const IPC_SYNC_TYPE = 'IPC_SYNC_STORE';
const getAction = (channel, payload) => ({
  type: IPC_SYNC_TYPE,
  payload,
  meta: { channel },
});

const IpcSyncRenderer = (store: Store) => {
  const dispatchAction = (_, payload, channel) =>
    store.dispatch(getAction(channel, payload));
  ipcRenderer.on(IPC_SYNC_TYPE, dispatchAction);
  return () => ipcRenderer.off(IPC_SYNC_TYPE, dispatchAction);
};

export const isMySyncChannel = (channel: string, action: AnyAction) =>
  action?.meta?.channel === channel;

export default IpcSyncRenderer;
