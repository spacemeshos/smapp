export interface NetworkState {
  genesisID: string;
  netName: string;
  genesisTime: string;
  currentLayer: number;
  layerDurationSec: number;
  layersPerEpoch: number;
  rootHash: string;
  explorerUrl: string;
}
