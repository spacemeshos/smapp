import {
  firstLayerInEpoch,
  timestampByLayer,
} from '../../../shared/layerUtils';
import { RootState } from '../../types';

export const getNetworkInfo = (state: RootState) => state.network;

export const getNetworkName = (state: RootState) =>
  getNetworkInfo(state).netName;

export const getGenesisID = (state: RootState) =>
  getNetworkInfo(state).genesisID;

export const getTimestampByLayerFn = (state: RootState) =>
  timestampByLayer(state.network.genesisTime, state.network.layerDurationSec);

export const getFirstLayerInEpochFn = (state: RootState) =>
  firstLayerInEpoch(state.network.layersPerEpoch);

export const isGenesisPhase = (state: RootState) =>
  (state.node.status?.topLayer || 0) < getFirstLayerInEpochFn(state)(2);

export const getNetworkTapBotDiscordURL = (state: RootState) =>
  getNetworkInfo(state).tapBotDiscordURL;
