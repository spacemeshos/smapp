import { createSlice } from '@reduxjs/toolkit';
import * as R from 'ramda';
import { NetworkState } from '../../types';
import {
  attachCurrentLayer,
  attachGlobalStateHash,
  attachNetworkDefinitions,
} from './actions';

export const initialState: NetworkState = {
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
  extraReducers: R.compose(
    attachNetworkDefinitions,
    attachCurrentLayer,
    attachGlobalStateHash
  ),
});

export default slice;
