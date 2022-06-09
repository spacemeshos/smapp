import { NetworkState } from '../../types';

const networkInitialState: NetworkState = {
  netId: -1,
  netName: '',
  genesisTime: '',
  layerDurationSec: 0,
  currentLayer: -1,
  rootHash: '',
  explorerUrl: '',
};

export default networkInitialState;
