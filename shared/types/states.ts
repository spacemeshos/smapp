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
  NotRunning = 'NotRunning',
  Starting = 'Starting',
  Compacting = 'Compacting',
  Vacuuming = 'Vacuuming',
  VerifyingLayers = 'VerifyingLayers',
  StartingGRPC = 'StartingGRPC',
  SyncingAtxs = 'SyncingAtxs',
  SyncingMaliciousProofs = 'SyncingMaliciousProofs',
  Ready = 'Ready',
}
