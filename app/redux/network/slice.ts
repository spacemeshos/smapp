import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NetworkState } from '../../types';

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
  reducers: {
    setNetworkDefinitions: (state, action: PayloadAction<NetworkState>) => {
      const {
        payload: { netId, netName, genesisTime, explorerUrl, layerDurationSec },
      } = action;
      return { ...state, netId, netName, genesisTime, explorerUrl, layerDurationSec };
    },
    setCurrentLayer: (state, action: PayloadAction<number>) => {
      const currentLayer = action.payload;
      return currentLayer === -1 ? state : { ...state, currentLayer };
    },
    setStateRootHash: (state, action: PayloadAction<string>) => {
      const rootHash = action.payload;
      return rootHash ? { ...state, rootHash } : state;
    },
  },
});

export default slice;
