import Bech32 from '@spacemesh/address-wasm';
import { TemplateRegistry } from '@spacemesh/sm-codec';
import { bytesToHex } from '@spacemesh/sm-codec/lib/utils/hex';
import { toHexString } from '../../desktop/utils';
import { Transaction__Output } from '../../proto/spacemesh/v1/Transaction';
import { TransactionReceipt__Output } from '../../proto/spacemesh/v1/TransactionReceipt';
import { TransactionState__Output } from '../../proto/spacemesh/v1/TransactionState';
import { hasRequiredTxFields } from './guards';
import { Tx, TxState } from './tx';

export const deriveHRP = (addr: string) => addr.match(/^(\w+)1/)?.[1] || null;

export const toTx = (
  tx: Transaction__Output,
  txState: TransactionState__Output | null
) => {
  if (!hasRequiredTxFields(tx)) return null;
  const hrp = deriveHRP(tx.template.address);
  if (!hrp) {
    throw new Error(`Transaction TemplateAddress is not BECH32`);
  }
  const tplAddress = Bech32.parse(tx.template.address, hrp);
  const tpl = TemplateRegistry.get(bytesToHex(tplAddress), tx.method as 0 | 1);
  const payload = tpl.decode(tx.raw);
  const res = {
    id: toHexString(tx.id),
    principal: tx.principal.address,
    template: tx.template.address,
    method: tx.method,
    status: txState?.state || TxState.TRANSACTION_STATE_UNSPECIFIED,
    payload,
  };
  return res;
};

export const addReceiptToTx = <T>(
  tx: Tx<T>,
  receipt: TransactionReceipt__Output
): Tx<T> => ({
  ...tx,
  layer: receipt.layer?.number || tx.layer,
  receipt: {
    result: receipt.result,
    gasUsed: receipt.gasUsed.toNumber(),
    fee: receipt.fee?.value.toNumber() || 0,
    svmData: toHexString(receipt.svmData),
  },
});
