import { combineReducers } from 'redux';
import { Network } from '../../shared/types';
import { RootState } from '../types';
import wallet from './wallet/reducer';
import node from './node/reducer';
import ui from './ui/reducer';
import smesher from './smesher/reducer';
import updater from './updater/slice';
import { ipcReducer } from './ipcBatchSync';
import networkInitialState from './network/initialState';

export default combineReducers<RootState>({
  wallet,
  node,
  ui,
  smesher,
  updater: updater.reducer,
  network: ipcReducer('network', networkInitialState),
  networks: ipcReducer('networks', [] as Network[]),
});
