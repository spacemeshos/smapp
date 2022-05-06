import { ipcRenderer } from 'electron';
import { Store } from 'redux';
import { CustomAction } from '../types';

export const IPC_BATCH_SYNC_TYPE = 'IPC_BATCH_SYNC_TYPE';
const ipcBatchSync = (payload) => ({
  type: IPC_BATCH_SYNC_TYPE,
  payload,
});

const IpcBatchSyncRenderer = (store: Store) => {
  const dispatchAction = (_, chunksMap) =>
    store.dispatch(ipcBatchSync(chunksMap));
  ipcRenderer.on('IPC_BATCH_SYNC', dispatchAction);
  return () => ipcRenderer.off(IPC_BATCH_SYNC_TYPE, dispatchAction);
};

export const getMyChunk = <K extends string, C extends Record<string, any>>(
  key: K,
  chunks: Record<K, C>
): C | null => chunks[key] || null;

export const reduceChunkUpdate = <
  S extends Record<any, any>,
  K extends string,
  C extends Record<string, any>
>(
  key: K,
  chunks: Record<K, C>,
  state: S
) => {
  const chunkData = getMyChunk(key, chunks);
  if (!chunkData) return state;
  return {
    ...state,
    ...chunkData,
  };
};

export const ipcReducer = (chunkName: string, initialState) => (
  state = initialState,
  action: CustomAction
) => {
  if (action.type !== IPC_BATCH_SYNC_TYPE) return state;
  return reduceChunkUpdate(chunkName, action.payload, state);
};

export default IpcBatchSyncRenderer;
