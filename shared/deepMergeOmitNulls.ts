import { compose, mergeWith, omit } from 'ramda';
import { isObject } from './utils';

type DeppAny<T> = T extends Record<string, any>
  ? Partial<{ [K in keyof T]: DeppAny<T[K]> | null }> & { [k: string]: any }
  : T;

const deepMergeOmitNulls = <T extends Record<string, any>>(
  prev: T,
  next: DeppAny<T>
): T => {
  const nextEntries = Object.entries(next);
  const nulls = nextEntries.filter(([_, v]) => v === null).map(([k]) => k);

  const res = compose(
    omit(nulls),
    mergeWith((a, b) => {
      if (isObject(a) && isObject(b)) {
        return deepMergeOmitNulls(a, b);
      } else {
        return b;
      }
    }, prev)
  )(next) as T;

  return res;
};

export default deepMergeOmitNulls;
