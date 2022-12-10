import Bech32 from '@spacemesh/address-wasm';
import { fromHexString } from '../../shared/utils';

export type SmeshingOpts = {
  'smeshing-coinbase': string;
  'smeshing-opts': {
    'smeshing-opts-datadir': string;
    'smeshing-opts-numfiles': number;
    'smeshing-opts-numunits': number;
    'smeshing-opts-provider': number;
    'smeshing-opts-throttle': boolean;
  };
  'smeshing-start': boolean;
};

export const isSmeshingOpts = (a: any): a is SmeshingOpts =>
  a &&
  typeof a['smeshing-coinbase'] === 'string' &&
  typeof a['smeshing-start'] === 'boolean' &&
  typeof a['smeshing-opts'] === 'object' &&
  typeof a['smeshing-opts']['smeshing-opts-datadir'] === 'string' &&
  typeof a['smeshing-opts']['smeshing-opts-numfiles'] === 'number' &&
  typeof a['smeshing-opts']['smeshing-opts-numunits'] === 'number' &&
  typeof a['smeshing-opts']['smeshing-opts-provider'] === 'number' &&
  typeof a['smeshing-opts']['smeshing-opts-throttle'] === 'boolean' &&
  a['smeshing-coinbase'].length > 0 &&
  a['smeshing-opts']['smeshing-opts-numfiles'] >= 1 &&
  a['smeshing-opts']['smeshing-opts-numunits'] >= 1 &&
  a['smeshing-opts']['smeshing-opts-provider'] >= 0;

export const safeSmeshingOpts = (opts: SmeshingOpts) => {
  if (!isSmeshingOpts(opts)) return {};

  const oCoinbase = opts['smeshing-coinbase'];
  const coinbase =
    typeof oCoinbase === 'string' && oCoinbase.startsWith('0x')
      ? Bech32.generateAddress(fromHexString(oCoinbase))
      : oCoinbase;
  if (Bech32.verify(coinbase)) {
    return {
      ...opts,
      'smeshing-coinbase': coinbase,
    };
  } else {
    return {};
  }
};
