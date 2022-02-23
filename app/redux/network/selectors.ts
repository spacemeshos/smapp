import { RootState } from '../../types';

export const getNetworkInfo = (state: RootState) => state.network;

export const getNetworkName = (state: RootState) => getNetworkInfo(state).netName;

export const getNetworkId = (state: RootState) => getNetworkInfo(state).netId;
