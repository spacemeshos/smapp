import { LOCAL_NODE_API_URL } from './constants';
import { PublicService, SocketAddress } from './types';

// eslint-disable-next-line import/prefer-default-export
export const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });

// GRPC APIs
export const toSocketAddress = (url?: string): SocketAddress => {
  if (url === '' || url === undefined) return LOCAL_NODE_API_URL;

  const u = new URL(url.startsWith('http') ? url : `http://${url}`);
  if (u.protocol !== 'http:' && u.protocol !== 'https:') {
    throw new Error(`Unsupported protocol in GRPC remote API URL: ${url}`);
  }
  return {
    host: u.hostname,
    port: u.port,
    protocol: u.protocol
  };
};

export const stringifySocketAddress = (sa: SocketAddress): string => `${sa.protocol}//${sa.host}${sa.port && `:${sa.port}`}`;

export const isLocalNodeApi = (sa: SocketAddress) => sa === LOCAL_NODE_API_URL;

export const isRemoteNodeApi = (sa: SocketAddress) => !isLocalNodeApi(sa);

export const toPublicService = (netName: string, url: string): PublicService => ({
  name: netName,
  ...toSocketAddress(url)
});
