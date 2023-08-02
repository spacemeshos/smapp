import { homedir } from 'os';
import { resolve } from 'path';
import { isEmpty } from 'ramda';
import { HexString } from '../../shared/types';
import { getShortGenesisId } from '../../shared/utils';
import { DEFAULT_SMESHING_BATCH_SIZE } from './constants';

export type NoSmeshingDefaults = {
  'smeshing-opts': {
    'smeshing-opts-datadir': string;
  };
};

export type SmeshingProvingOpts = {
  'smeshing-opts-proving-nonces': number;
  'smeshing-opts-proving-threads': number;
};

export type SmeshingOpts = {
  'smeshing-coinbase': string;
  'smeshing-opts': {
    'smeshing-opts-datadir': string;
    'smeshing-opts-maxfilesize': number;
    'smeshing-opts-numunits': number;
    'smeshing-opts-provider': number;
    'smeshing-opts-throttle': boolean;
    'smeshing-opts-compute-batch-size': number;
  };
  'smeshing-proving-opts'?: Partial<SmeshingProvingOpts>;
  'smeshing-start': boolean;
};

export type ValidSmeshingOpts =
  | NoSmeshingDefaults
  | SmeshingOpts
  | Partial<SmeshingOpts>;

export const isSmeshingOpts = (a: any): a is SmeshingOpts =>
  a &&
  typeof a['smeshing-coinbase'] === 'string' &&
  typeof a['smeshing-start'] === 'boolean' &&
  typeof a['smeshing-opts'] === 'object' &&
  typeof a['smeshing-opts']['smeshing-opts-datadir'] === 'string' &&
  typeof a['smeshing-opts']['smeshing-opts-maxfilesize'] === 'number' &&
  typeof a['smeshing-opts']['smeshing-opts-numunits'] === 'number' &&
  typeof a['smeshing-opts']['smeshing-opts-provider'] === 'number' &&
  typeof a['smeshing-opts']['smeshing-opts-throttle'] === 'boolean' &&
  a['smeshing-coinbase'].length > 0 &&
  a['smeshing-opts']['smeshing-opts-maxfilesize'] >= 1 &&
  a['smeshing-opts']['smeshing-opts-numunits'] >= 1 &&
  a['smeshing-opts']['smeshing-opts-provider'] >= 0;

export const getDefaultPosDir = (genesisId: HexString) =>
  resolve(homedir(), `./post/${getShortGenesisId(genesisId)}`);

export const isValidProvingOpts = (
  opts?: Partial<SmeshingProvingOpts>
): opts is SmeshingProvingOpts => {
  if (!opts || (typeof opts === 'object' && isEmpty(opts))) return true;

  const nonces = opts['smeshing-opts-proving-nonces'];
  const threads = opts['smeshing-opts-proving-threads'];
  return (
    typeof nonces === 'number' &&
    nonces > 0 &&
    typeof threads === 'number' &&
    threads > 0
  );
};

export const safeProvingOpts = (
  opts?: Partial<SmeshingProvingOpts>
): SmeshingProvingOpts | Record<string, never> =>
  isValidProvingOpts(opts) ? opts : {};

export const safeSmeshingOpts = (
  opts: any,
  genesisId: HexString
): ValidSmeshingOpts => {
  const defaultPosDir = getDefaultPosDir(genesisId);
  const defaultSmeshingOpts = {
    'smeshing-opts': {
      'smeshing-opts-datadir': defaultPosDir,
    },
  };

  if (!isSmeshingOpts(opts)) return defaultSmeshingOpts;

  return {
    ...opts,
    'smeshing-opts': {
      ...opts['smeshing-opts'],
      'smeshing-opts-datadir':
        opts['smeshing-opts']['smeshing-opts-datadir'] || defaultPosDir,
      'smeshing-opts-compute-batch-size':
        opts['smeshing-opts']['smeshing-opts-compute-batch-size'] ||
        DEFAULT_SMESHING_BATCH_SIZE,
    },
    'smeshing-proving-opts': safeProvingOpts(opts['smeshing-proving-opts']),
    'smeshing-coinbase': opts['smeshing-coinbase'],
  };
};
