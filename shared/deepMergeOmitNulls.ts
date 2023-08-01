import { compose, mergeWith, omit } from 'ramda';
import { isObject } from './utils';

const deepMergeOmitNulls = <T extends Record<string, any>>(
  prev: T,
  next: Partial<T>
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
