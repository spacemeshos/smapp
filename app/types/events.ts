type NetDescriptor = {
  genesisID: string;
  netName: string;
};

type MiscNetParams = {
  genesisTime: string;
  layerDurationSec: number;
  explorerUrl: string;
};

export type NetworkDefinitions =
  | (NetDescriptor & MiscNetParams)
  | NetDescriptor;

export type CurrentLayer = {
  currentLayer: number;
};

export type GlobalStateHash = {
  layer: number;
  rootHash: string;
};
