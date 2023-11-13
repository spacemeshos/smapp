import os from 'os';
import { Timestamp } from '@grpc/grpc-js/build/src/generated/google/protobuf/Timestamp';
import { Event } from '../proto/spacemesh/v1/Event';
import { Duration } from '../proto/google/protobuf/Duration';
import { HexString, NodeEvent, SocketAddress, WalletType } from './types';

export const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });

// Func utils
export const shallowEq = <T extends Record<string, any> | Array<any>>(
  a: T,
  b: T
) => {
  if (a === b) return true;

  if (Array.isArray(a) && Array.isArray(b)) {
    return a.reduce((acc, next, idx) => acc && next === b[idx], true);
  }
  if (typeof a !== typeof b || Array.isArray(a) || Array.isArray(b) || !a || !b)
    return false;
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;

  return aKeys.reduce((acc, key) => acc && a[key] === b[key], true);
};

export const ifTruish = <V extends any, R extends Record<any, any>>(
  v: V,
  then: (v: V) => R,
  def: R
) => (v ? then(v) : def);

export const stringifySocketAddress = (sa: SocketAddress): string =>
  sa ? `${sa.protocol}//${sa.host}${sa.port && `:${sa.port}`}` : '';

export const isLocalNodeApi = (sa: SocketAddress) =>
  shallowEq(
    { host: 'localhost', protocol: 'http:' },
    { host: sa.host, protocol: sa.protocol }
  ) && parseInt(sa.port, 10);

export const isNodeApiEq = (a: SocketAddress, b: SocketAddress) =>
  shallowEq(a, b);

export const isRemoteNodeApi = (sa: SocketAddress) => !isLocalNodeApi(sa);

export const isWalletOnlyType = (walletType: WalletType) =>
  walletType === WalletType.RemoteApi;

export const isLocalNodeType = (walletType: WalletType) =>
  walletType === WalletType.LocalNode;

export const isObject = (o: any): o is Record<string, any> =>
  typeof o === 'object' && !Array.isArray(o) && o !== null;

// --------------------------------------------------------
// HexString conversion
// --------------------------------------------------------
export const fromHexString = (hexString: HexString) => {
  const bytes: number[] = [];
  for (let i = 0; i < hexString.length; i += 2) {
    bytes.push(parseInt(hexString.slice(i, i + 2), 16));
  }
  return Uint8Array.from(bytes);
};
export const toHexString = (
  bytes: Uint8Array | Buffer | ArrayBuffer
): HexString =>
  bytes instanceof Buffer
    ? bytes.toString('hex')
    : new Uint8Array(bytes).reduce(
        (str: string, byte: number) => str + byte.toString(16).padStart(2, '0'),
        ''
      );

//
//
//

export const deriveHRP = (addr: string) => addr.match(/^(\w+)1/)?.[1] || null;

export const longToNumber = (val: Long | number) =>
  typeof val === 'number' ? val : val.toNumber();

export const convertBytesToMiB = (maxFileSize: number) =>
  maxFileSize / 1024 / 1024;

export const convertBytesToGiB = (maxFileSize: number) =>
  maxFileSize / 1024 / 1024 / 1024;
export const convertMiBToBytes = (maxFileSize: number) =>
  maxFileSize * 1024 * 1024;

export const distribute = (min: number, max: number, steps: number) => {
  const delta = max - min;
  const stepsSafe = delta > steps ? steps : delta + 1;
  const step = delta / (stepsSafe - 1);
  const res = <number[]>[];
  for (let i = 0; i < stepsSafe; i += 1) {
    res.push(min + i * step);
  }
  return res;
};

export function enumFromStringValue<T>(
  enm: { [s: string]: T },
  value: string
): T | undefined {
  return ((Object.values(enm) as unknown) as string[]).includes(value)
    ? ((value as unknown) as T)
    : undefined;
}

export const parseTimestamp = (t: Timestamp | Duration) => {
  const sec =
    typeof t.seconds === 'string'
      ? parseInt(t.seconds)
      : longToNumber(t.seconds || 0);
  const nanos =
    typeof t.nanos === 'string'
      ? parseInt(t.nanos)
      : longToNumber(t.nanos || 0);
  return sec * 1000 + nanos / 1e6;
};

export const getEventType = (event: NodeEvent): Event['details'] => {
  if (!event) return event;
  if (event.details) return event.details;
  const eventType = (Object.keys(event).filter(
    (e) => !['timestamp', 'failure', 'help'].includes(e)
  )[0] as unknown) as typeof event.details;
  if (!eventType) {
    throw new Error(`Unknown Node Event: ${JSON.stringify(event)}`);
  }
  return eventType;
};

export const getShortGenesisId = (genesisID: HexString) =>
  genesisID.substring(0, 8);

/**
 * @see https://stackoverflow.com/questions/66974771/see-build-target-of-electron-builder-in-running-application
 */
export const isDebPackage = () =>
  os.platform() === 'linux' && !process.env.APPIMAGE;

export const isLinuxAppImage = () =>
  os.platform() === 'linux' && !!process.env.APPIMAGE;
