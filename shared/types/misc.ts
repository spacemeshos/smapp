export interface NodeVersionAndBuild {
  version: string;
  build: string;
}

export type PublicService = { name: string } & SocketAddress;

export type SocketAddress = {
  ip: string;
  port: string;
};
