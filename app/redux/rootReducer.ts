import { combineReducers } from 'redux';
import { Network } from '../../shared/types';
import { RootState } from '../types';
import { initialState } from './network/slice';
import wallet from './wallet/reducer';
import node from './node/reducer';
import ui from './ui/reducer';
import smesher from './smesher/reducer';
import updater from './updater/slice';
import { ipcReducer } from './ipcBatchSync';

export default combineReducers<RootState>({
  wallet,
  node,
  ui,
  smesher,
  updater: updater.reducer,
  network: ipcReducer('network', initialState),
  networks: ipcReducer('networks', [] as Network[]),
});
