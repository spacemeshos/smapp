import TOML from '@iarna/toml';
import { HexString, SocketAddress, WalletType } from './types';

export const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });

// Promisifed debounce function for multiple consumers
//
// It calls the callback function not more often than once
// per specified delay time. The result of callback function
// is spreaded (as resolved promise) to all callers.
// Callback function will be called with the latest arguments.
//
// Check out the example:
//   Let's say that we need to fetch some value from API
//   however, we have a lot of async events that may trigger
//   this function, to avoid making excessive fetch requests
//   you can wrap your function in the `debounceShared`.
//
//   const myFetch = debounceShared(1000, () => fetch('0.0.0.0:8000/value.txt'));
//   setInterval(() => myFetch().then(console.log), 800);
//   setInterval(() => myFetch().then(console.log), 300);
//   setInterval(() => myFetch().then(console.log), 400);
//
//   const myFetch = debounceShared(1000, async (x) => {
//     console.log('fetch!', x);
//     await delay(50);
//     return { timestamp: Date.now(), x };
//   }));
//   setInterval(() => myFetch(800).then((x) => console.log(800, '>', x)), 800);
//   setInterval(() => myFetch(300).then((x) => console.log(300, '>', x)), 300);
//   setInterval(() => myFetch(400).then((x) => console.log(400, '>', x)), 400);
//
//   Output:
//   fetch! 300
//   300 > { timestamp: 1674162027724, x: 300 }
//   400 > { timestamp: 1674162027724, x: 300 }
//   300 > { timestamp: 1674162027724, x: 300 }
//   800 > { timestamp: 1674162027724, x: 300 }
//   400 > { timestamp: 1674162027724, x: 300 }
//   300 > { timestamp: 1674162027724, x: 300 }
//   400 > { timestamp: 1674162027724, x: 300 }
//   300 > { timestamp: 1674162027724, x: 300 }
//   fetch! 300
//   300 > { timestamp: 1674162028933, x: 300 }
//   ...
//
//   Will send one fetch request every 1000ms, the result will be spreaded to
//   everyone who are awaiting for the result. So you will see bunches of results
//   in console, however all of them will refer to the single result with the same
//   `timestamp` and `x` properties.
//
//   In case if you want to have separate debounce "threads" for individual arguments
//   use `debounceByArgs`
//
export const debounceShared = <T extends unknown>(
  delay: number,
  cb: (...args: any[]) => T | Promise<T>
) => {
  type PromiseHandler = (T) => any;

  let t: ReturnType<typeof setTimeout> | null = null;
  let startedAt = 0;
  let thenResolvers: PromiseHandler[] = [];
  let thenRejecters: PromiseHandler[] = [];
  let catchResolvers: PromiseHandler[] = [];

  const resolve = (r: any) =>
    thenResolvers.forEach((fn: PromiseHandler) => fn(r));
  const reject = (r: any) => {
    thenRejecters.forEach((fn: PromiseHandler) => fn(r));
    catchResolvers.forEach((fn: PromiseHandler) => fn(r));
  };
  const clearHandlers = () => {
    thenResolvers = [];
    thenRejecters = [];
    catchResolvers = [];
  };

  return (...args: any[]) => {
    const now = Date.now();
    if (now > startedAt + delay) {
      t && clearTimeout(t);
      startedAt = now;
      t = setTimeout(() => {
        try {
          const r = cb(...args);
          if (r && r instanceof Promise) {
            // eslint-disable-next-line promise/catch-or-return
            r.then(resolve)
              .catch(reject)
              .then((x) => {
                clearHandlers();
                return x;
              });
          } else {
            resolve(r);
            clearHandlers();
          }
        } catch (err) {
          reject(err);
          clearHandlers();
        }
      }, delay);
    }
    return {
      then: (fn: PromiseHandler) =>
        new Promise((resolve, reject) => {
          thenResolvers.push((result: T) => resolve(fn(result)));
          thenRejecters.push((err: Error) => reject(err));
        }),
      catch: (fn: PromiseHandler) =>
        new Promise((resolve) => {
          catchResolvers.push((result: T) => resolve(fn(result)));
        }),
    } as Promise<T>;
  };
};

// The extended version of `debounceShared`
// This wrapper groups function calls by arguments in separate "threads".
// Saying simpler, if you take the example of `debounceShared` function
// and replace it with `debounceByArgs`, then there will be three
// calls for each argument set individually:
//   fetch! 300
//   300 > { timestamp: 1674162440796, x: 300 }
//   300 > { timestamp: 1674162440796, x: 300 }
//   300 > { timestamp: 1674162440796, x: 300 }
//   300 > { timestamp: 1674162440796, x: 300 }
//   fetch! 400
//   400 > { timestamp: 1674162440892, x: 400 }
//   400 > { timestamp: 1674162440892, x: 400 }
//   400 > { timestamp: 1674162440892, x: 400 }
//   fetch! 800
//   800 > { timestamp: 1674162441291, x: 800 }
//   800 > { timestamp: 1674162441291, x: 800 }
//   fetch! 300
//   300 > { timestamp: 1674162442008, x: 300 }
// ...
export const debounceByArgs = <T extends (...args: any[]) => any>(
  ms: number,
  callback: T
) => {
  const t = {};
  return (...args) => {
    const k = JSON.stringify(args);
    if (!t[k]) {
      t[k] = debounceShared(ms, callback);
    }
    return t[k](...args);
  };
};

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

//
//
export const configCodecByPath = (path: string) =>
  /\.toml$/.test(path) ? TOML : JSON;
export const configCodecByFirstChar = (data: string) =>
  data.trim().startsWith('{') ? JSON : TOML;

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
