export interface NetworkState {
  netName: string;
  isMainNet: boolean;
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
  RunningMigrations = 'RunningMigrations',
  InitializingTortoise = 'InitializingTortoise',
  InitializedTortoise = 'InitializedTortoise',
  PreparingCache = 'PreparingCache',
  Vacuuming = 'Vacuuming',
  VerifyingLayers = 'VerifyingLayers',
  SyncingAtxs = 'SyncingAtxs',
  SyncingMaliciousProofs = 'SyncingMaliciousProofs',
  Ready = 'Ready',
}
