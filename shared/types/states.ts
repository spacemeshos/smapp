export interface NetworkState {
  netName: string;
  genesisTime: string;
  currentLayer: number;
  layerDurationSec: number;
  layersPerEpoch: number;
  rootHash: string;
  explorerUrl: string;
  genesisID: string;
  tapBotDiscordURL: string;
}

export enum NodeStartupState {
  Starting,
  Compacting,
  Vacuuming,
  VerifyingLayers,
  StartingGRPC,
  SyncingAtxs,
  SyncingMaliciousProofs,
  Ready,
}
