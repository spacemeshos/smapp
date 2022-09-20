import { StdPublicKeys } from '@spacemesh/sm-codec';
import { bytesToHex } from '@spacemesh/sm-codec/lib/utils/hex';

const TEMPLATE_METAS = {
  [StdPublicKeys.SingleSig]: {
    name: 'SingleSig',
    methods: {
      0: 'Spawn',
      1: 'Spend',
    },
  },
};

// Takes template address in HexString format
export const getTemplateName = (tplAddress: string | Uint8Array) =>
  TEMPLATE_METAS[
    tplAddress instanceof Uint8Array ? bytesToHex(tplAddress) : tplAddress
  ]?.name || null;

export const getMethodName = (
  tplAddress: string | Uint8Array,
  method: number
): string | null =>
  TEMPLATE_METAS[
    tplAddress instanceof Uint8Array ? bytesToHex(tplAddress) : tplAddress
  ]?.methods?.[method] || null;
