import { NetworkState } from '../../types';

const networkInitialState: NetworkState = {
  genesisID: '',
  netName: '',
  genesisTime: '',
  layerDurationSec: 0,
  currentLayer: -1,
  rootHash: '',
  explorerUrl: '',
  layersPerEpoch: 0,
  tapBotDiscordURL: '',
};

export default networkInitialState;
