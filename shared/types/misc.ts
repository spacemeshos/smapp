export type HexString = string;

export type Bech32Address = string;

export type PublicService = { name: string } & SocketAddress;

export type SocketAddress = {
  host: string;
  port: string;
  protocol: 'http:' | 'https:';
};

export type Network = {
  netID: number;
  netName: string;
  conf: string;
  explorer: string;
  dash: string;
  grpcAPI: string;
  jsonAPI: string;
  minNodeVersion: string;
  maxNodeVersion: string;
  minSmappRelease: string;
  latestSmappRelease: string;
  smappBaseDownloadUrl: string;
  nodeBaseDownloadUrl: string;
  [key: string]: any;
};
