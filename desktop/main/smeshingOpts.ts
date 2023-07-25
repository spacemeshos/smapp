import { homedir } from 'os';
import { resolve } from 'path';
import Bech32 from '@spacemesh/address-wasm';
import { HexString } from '../../shared/types';
import { fromHexString, getShortGenesisId } from '../../shared/utils';
import { DEFAULT_SMESHING_BATCH_SIZE } from './constants';

export type NoSmeshingDefaults = {
  'smeshing-opts': {
    'smeshing-opts-datadir': string;
  };
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

  const oCoinbase = opts['smeshing-coinbase'];
  const coinbase =
    typeof oCoinbase === 'string' && oCoinbase.startsWith('0x')
      ? Bech32.generateAddress(fromHexString(oCoinbase))
      : oCoinbase;
  if (Bech32.verify(coinbase)) {
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
      'smeshing-coinbase': coinbase,
    };
  } else {
    return defaultSmeshingOpts;
  }
};
