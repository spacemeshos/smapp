import { createSlice } from '@reduxjs/toolkit';
import { NetworkState } from '../../types';
import compose from '../../../shared/fp-tools';
import { attachCurrentLayer, attachGlobalStateHash, attachNetworkDefinitions } from './actions';

const initialState: NetworkState = {
  netId: '',
  netName: '',
  genesisTime: '',
  layerDurationSec: 0,
  currentLayer: -1,
  rootHash: '',
  explorerUrl: '',
};

const slice = createSlice({
  name: 'network',
  initialState,
  reducers: {},
  extraReducers: compose(attachNetworkDefinitions, attachCurrentLayer, attachGlobalStateHash),
});

export default slice;
