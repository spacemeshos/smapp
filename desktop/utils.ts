import cs from 'checksum';
import electronFetch, { RequestInit } from 'electron-fetch';
import { NodeConfig } from '../shared/types';
import {
  getTestModeNodeConfig,
  isTestMode,
  STANDALONE_GENESIS_EXTRA,
} from './testMode';
import { getEnvInfo } from './envinfo';
import Logger from './logger';

const logger = Logger({ className: 'desktop/utils' });

// --------------------------------------------------------
// Network
// --------------------------------------------------------

export const patchQueryString = (
  url: string,
  queryParams: Record<string, string>
) =>
  Object.entries(queryParams)
    .reduce((acc, [key, val]) => {
      acc.searchParams.set(key, val);
      return acc;
    }, new URL(url))
    .toString();

export const fetch = async (url: string, options?: RequestInit) => {
  try {
    const res = await electronFetch(url, {
      // Use `https` or `http` modules of NodeJS stdlib
      // instead of electron's `net` module
      // to avoid caching on the client
      useElectronNet: false,
      // But keep the flexibility
      ...options,
    });
    logger.log('fetch:success', res.status, { url, options });
    return res;
  } catch (err) {
    logger.error('fetch:error', err, { url, options });
    throw err;
  }
};

export const fetchJSON = async (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      logger.error('fetchJSON', { url, status: res.status });
      throw new Error(
        `Cannot fetch ${url}.\nResponse status code: ${res.status}`
      );
    }
    return res.json();
  });

export const fetchNodeConfig = async (
  url: string,
  prevHash?: string
): Promise<NodeConfig> =>
  isTestMode() && url === STANDALONE_GENESIS_EXTRA
    ? getTestModeNodeConfig()
    : fetchJSON(
        patchQueryString(url, {
          ...(await getEnvInfo()),
          ...(prevHash ? { hash: prevHash } : {}),
        })
      );

export const isNetError = (error: Error) => error.message.startsWith('net::');

// --------------------------------------------------------
// Guards
// --------------------------------------------------------

export const isByteArray = (a: any): a is Uint8Array => a instanceof Uint8Array;

/**
 * Creates a pool of objects T which will be collected
 * until some delay passed since the last object added to the pool.
 * Then it calls the callback function with the collected pool.
 *
 * Example:
 * Adding objects: ---1-2---3--4--------5--6--------->
 * Debounce delay:    *-*---*--*-----|  *--*-----|
 * Result:         ------------------X-----------Y--->
 * X = [1,2,3,4]
 * Y = [5,6]
 */
export const createDebouncePool = <T extends unknown>(
  delay: number,
  callback: (errors: T[], resetPool: () => void) => void
) => {
  let bucket: T[] = [];
  let timer: ReturnType<typeof setTimeout> | null = null;

  const resetPool = () => {
    bucket = [];
  };

  return (error: T) => {
    bucket = [...bucket, error];
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      callback(bucket, resetPool);
      bucket = [];
    }, delay);
  };
};

// --------------------------------------------------------
// Checksums
// --------------------------------------------------------
export const checksum = (path: string) =>
  new Promise((resolve, reject) => {
    cs.file(path, (err, hash) => (err ? reject(err) : resolve(hash)));
  });

//
//
//

// Transforms errors into user-friendly reason by codes (if exist)
// It maps both types of system errors for Linux-based OS and Windows
export const getSpawnErrorReason = (err: any) => {
  switch (err?.code || 'UNKNOWN') {
    case 'EPERM':
    case 'EACCES':
    case 'ERROR_ACCESS_DENIED':
      return ': check permissions';
    case 'ENOENT':
    case 'ERROR_FILE_NOT_FOUND':
    case 'ERROR_PATH_NOT_FOUND':
      return ': go-spacemesh binary not found';
    case 'UNKNOWN':
    default:
      return '';
  }
};
