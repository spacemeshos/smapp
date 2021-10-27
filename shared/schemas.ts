//
// This file contains interfaces for data received in runtime,
// like fetching JSON from API or reading a file.
// Could be transformed in a validator functions in the future.
//

export interface DiscoveryItem {
  netName: string;
  netID: string;
  conf: string;
  peers: string;
  grpcAPI: string;
  jsonAPI: string;
  explorer: string;
  explorerAPI: string;
  explorerVersion: string;
  explorerConf: string;
  dash: string;
  dashAPI: string;
  dashVersion: string;
  minNodeVersion: string;
  maxNodeVersion: string;
  minSmappRelease: string;
  latestSmappRelease: string;
  smappBaseDownloadUrl: string;
  nodeBaseDownloadUrl: string;
}

export type DiscoveryResponce = DiscoveryItem[];
