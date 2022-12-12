import util from 'util';
import fs from 'fs';
import logger from 'electron-log';
import { F_OK } from 'constants';
import cs from 'checksum';
import fetch from 'electron-fetch';
import { configCodecByFirstChar } from '../shared/utils';
import { generateGenesisIDFromConfig } from './main/Networks';
import { getNodeLogsPath, readLinesFromBottom } from './main/utils';
import NodeConfig from './main/NodeConfig';

// --------------------------------------------------------
// ENV modes
// --------------------------------------------------------
export const isProd = () => process.env.NODE_ENV === 'production';
export const isDev = () => process.env.NODE_ENV === 'development';
export const isDebug = () => isDev() || !!process.env.DEBUG_PROD;

export const isDevNet = (
  proc = process
): proc is NodeJS.Process & {
  env: { NODE_ENV: 'development'; DEV_NET_URL: string };
} => proc.env.NODE_ENV === 'development' && !!proc.env.DEV_NET_URL;

// --------------------------------------------------------
// Network
// --------------------------------------------------------

export const fetchJSON = async (url?: string) =>
  url ? fetch(`${url}?no-cache=${Date.now()}`).then((res) => res.json()) : null;

export const fetchNodeConfig = async (url: string) =>
  fetch(`${url}?no-cache=${Date.now()}`)
    .then((res) => res.text())
    .then((res) => configCodecByFirstChar(res).parse(res));

export const isNetError = (error: Error) => error.message.startsWith('net::');

// --------------------------------------------------------
// Guards
// --------------------------------------------------------

export const isByteArray = (a: any): a is Uint8Array => a instanceof Uint8Array;

// --------------------------------------------------------
// FS Utils
// --------------------------------------------------------

export const readFileAsync = util.promisify(fs.readFile);

export const writeFileAsync = util.promisify(fs.writeFile);

export const isFileExists = (filePath: string) =>
  fs.promises
    .access(filePath, F_OK)
    .then(() => true)
    .catch(() => false);

export const isEmptyDir = async (path: string) => {
  try {
    const fsp = fs.promises;
    const directory = await fsp.opendir(path);
    const entry = await directory.read();
    await directory.close();
    return entry === null;
  } catch (error) {
    return false;
  }
};

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
  callback: (errors: T[]) => void
) => {
  let bucket: T[] = [];
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (error: T) => {
    bucket = [...bucket, error];
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      callback(bucket);
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

export const addNodeLogFile = async () => {
  const nodeConfig = await NodeConfig.load();
  const genesisID = generateGenesisIDFromConfig(nodeConfig);
  const logFilePath = getNodeLogsPath(generateGenesisIDFromConfig(nodeConfig));
  // Otherwise if Node exited, but there are no critical errors
  // in the pool — search for fatal error in the logs
  const lastLines = await readLinesFromBottom(logFilePath, 4000);
  return {
    genesisID,
    content: lastLines.reverse().join('\n\t'),
  };
};

export const addAppLogFile = async () => {
  const logFilePath = logger.transports.file.getFile().path;

  const lastLines = await readLinesFromBottom(logFilePath, 1000);
  const appStartFrom = logFilePath.indexOf('app-log');
  const fileName = logFilePath.slice(appStartFrom > 0 ? appStartFrom : 0, logFilePath.length - 4)
  return {
    fileName,
    content: lastLines.reverse().join('\n\t'),
};
}