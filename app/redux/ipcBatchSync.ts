import { ipcRenderer } from 'electron';
import { Store } from 'redux';
import { isObject } from '../../shared/utils';
import { CustomAction } from '../types';

export const IPC_BATCH_SYNC = 'IPC_BATCH_SYNC';
const ipcBatchSync = (payload) => ({
  type: IPC_BATCH_SYNC,
  payload,
});

const IpcBatchSyncRenderer = (store: Store) => {
  const dispatchAction = (_, chunksMap) =>
    store.dispatch(ipcBatchSync(chunksMap));
  ipcRenderer.on('IPC_BATCH_SYNC', dispatchAction);
  return () => ipcRenderer.off(IPC_BATCH_SYNC, dispatchAction);
};

export const getMyChunk = <K extends string, C extends PossibleState>(
  key: K,
  chunks: Record<K, C>
): C | null => chunks[key] || null;

type Primitive = string | number | boolean;
type AnyRecord = Record<string, any>;
type AnyList = any[];

const mergeState = <A>(state: A, next: A): A => {
  if (isObject(state) && isObject(next)) return { ...state, ...next };
  if (Array.isArray(state) && Array.isArray(next)) return next;
  if (typeof state === typeof next) return next;
  return state;
};

type PossibleState = Primitive | AnyRecord | AnyList;

export const reduceChunkUpdate = <
  S extends PossibleState,
  K extends string,
  C extends S
>(
  key: K,
  chunks: Record<K, C>,
  state: S
) => {
  const chunkData = getMyChunk(key, chunks);
  if (!chunkData) return state;
  return mergeState(state, chunkData);
};

export const ipcReducer = <S>(chunkName: string, initialState: S) => (
  state = initialState,
  action: CustomAction
) => {
  if (action.type !== IPC_BATCH_SYNC) return state;
  return reduceChunkUpdate(chunkName, action.payload, state);
};

export default IpcBatchSyncRenderer;
