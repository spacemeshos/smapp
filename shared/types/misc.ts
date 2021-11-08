export type PublicService = { name: string } & SocketAddress;

export type SocketAddress = {
  host: string;
  port: string;
  protocol: 'http:' | 'https:';
};
