import { homedir } from 'os';
import { resolve } from 'path';
import Bech32 from '@spacemesh/address-wasm';
import { HexString } from '../../shared/types';
import { fromHexString } from '../../shared/utils';

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

export const safeSmeshingOpts = (
  opts: any,
  genesisId: HexString
): ValidSmeshingOpts => {
  const defaultPosDir = resolve(
    homedir(),
    `./post/${genesisId.substring(0, 8)}`
  );
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
        // Temporary kludge
        // TODO: Remove it once https://github.com/spacemeshos/go-spacemesh/pull/4293
        //       will be merged and newer go-spacemesh version will be released
        /* eslint-disable no-bitwise */
        'smeshing-opts-compute-batch-size':
          opts['smeshing-opts']['smeshing-opts-provider'] === 1
            ? 1 << 10 // Kludge that makes Node behave well with CPU provider
            : 1 << 22,
        /* eslint-enable no-bitwise */
      },
      'smeshing-coinbase': coinbase,
    };
  } else {
    return defaultSmeshingOpts;
  }
};
