import * as R from 'ramda';
import { LOCAL_NODE_API_URL } from './constants';
import { PublicService, SocketAddress } from './types';

// eslint-disable-next-line import/prefer-default-export
export const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });

// GRPC APIs
export const toSocketAddress = (url?: string): SocketAddress => {
  if (!url) return LOCAL_NODE_API_URL;

  const u = new URL(url.startsWith('http') ? url : `http://${url}`);
  if (u.protocol !== 'http:' && u.protocol !== 'https:') {
    throw new Error(`Unsupported protocol in GRPC remote API URL: ${url}`);
  }
  return {
    host: u.hostname,
    port: u.port || u.protocol === 'https:' ? '443' : '9090',
    protocol: u.protocol,
  };
};

export const stringifySocketAddress = (sa: SocketAddress): string => (sa ? `${sa.protocol}//${sa.host}${sa.port && `:${sa.port}`}` : '');

export const isLocalNodeApi = (sa: SocketAddress) => R.equals(sa, LOCAL_NODE_API_URL);

export const isRemoteNodeApi = (sa: SocketAddress) => !isLocalNodeApi(sa);

export const toPublicService = (netName: string, url: string): PublicService => ({
  name: netName,
  ...toSocketAddress(url),
});
