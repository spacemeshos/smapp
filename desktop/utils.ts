import util from 'util';
import fs from 'fs';

export const fromHexString = (hexString: string) => {
  const bytes = [];
  for (let i = 0; i < hexString.length; i += 2) {
    // @ts-ignore
    bytes.push(parseInt(hexString.slice(i, i + 2), 16));
  }
  return Uint8Array.from(bytes);
};

export const toHexString = (bytes: Uint8Array) => bytes.reduce((str: string, byte: number) => str + byte.toString(16).padStart(2, '0'), '');

export const readFileAsync = util.promisify(fs.readFile);

export const writeFileAsync = util.promisify(fs.writeFile);

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
export const createDebouncePool = <T extends unknown>(delay: number, callback: (errors: T[]) => void) => {
  let bucket: T[] = [];
  let timer: NodeJS.Timeout | null = null;

  return (error: T) => {
    bucket = [...bucket, error];
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      callback(bucket);
      bucket = [];
    }, delay);
  };
};
