import { ActionReducerMapBuilder, createSlice } from '@reduxjs/toolkit';
import { NetworkState } from '../../types';
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
  extraReducers: (builder: ActionReducerMapBuilder<NetworkState>) => {
    attachNetworkDefinitions(builder);
    attachCurrentLayer(builder);
    attachGlobalStateHash(builder);
  },
});

export default slice;
