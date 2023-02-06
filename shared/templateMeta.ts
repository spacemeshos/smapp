import { StdPublicKeys } from '@spacemesh/sm-codec';
import { SingleSigMethods } from './templateConsts';
import { toHexString } from './utils';

const TEMPLATE_METAS = {
  [StdPublicKeys.SingleSig]: {
    name: 'SingleSig',
    methods: {
      [SingleSigMethods.Spawn]: 'Spawn',
      [SingleSigMethods.Spend]: 'Spend',
    },
  },
};

const getTemplateMeta = (tplAddress: string | Uint8Array) =>
  TEMPLATE_METAS[
    tplAddress instanceof Uint8Array ? toHexString(tplAddress) : tplAddress
  ];
// Takes template address in HexString format
export const getTemplateName = (tplAddress: string | Uint8Array) =>
  getTemplateMeta(tplAddress)?.name || 'UnknownTemplate';

export const getMethodName = (
  tplAddress: string | Uint8Array,
  method: number
) => getTemplateMeta(tplAddress)?.methods?.[method] || 'UnknownMethod';
