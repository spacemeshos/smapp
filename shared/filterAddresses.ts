import { isHRP } from './hrp';
import { Bech32Address } from './types';

type Filterable<T> = T[] | Record<string, T>;

const isFilterable = <T>(input: any): input is Filterable<T> =>
  Array.isArray(input) || (typeof input === 'object' && input !== null);

const deepValues = (o: Filterable<any>): any[] =>
  Object.values(o).reduce((acc, next) => {
    if (isFilterable(next)) {
      return [...acc, ...deepValues(next)];
    }
    return [...acc, next];
  }, []);

export default <I extends Filterable<any>>(input: I): Bech32Address[] =>
  deepValues(input).filter(
    (x) => typeof x === 'string' && isHRP(x.split('1')[0])
  );
