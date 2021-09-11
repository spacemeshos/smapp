export interface NodeVersionAndBuild {
  version: string;
  build: string;
}

export type PublicServices = Array<{
  url: string;
  name: string;
}>;

export type SocketAddress = {
  ip: string;
  port: string;
};
