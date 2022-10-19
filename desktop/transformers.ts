import Bech32 from '@spacemesh/address-wasm';
import { TemplateRegistry } from '@spacemesh/sm-codec';
import { Transaction__Output } from '../proto/spacemesh/v1/Transaction';
import { TransactionReceipt__Output } from '../proto/spacemesh/v1/TransactionReceipt';
import { TransactionState__Output } from '../proto/spacemesh/v1/TransactionState';
import { getMethodName, getTemplateName } from '../shared/templateMeta';
import { hasRequiredTxFields } from '../shared/types/guards';
import { Tx, TxState } from '../shared/types/tx';
import { isObject, toHexString } from '../shared/utils';

const prettifyPayload = (payload: Record<string, any>) =>
  Object.fromEntries(
    Object.entries(payload).map(([key, val]) => {
      if (val instanceof Uint8Array || val instanceof Buffer) {
        switch (key) {
          case 'Destination':
            return [key, Bech32.generateAddress(val)];
          case 'PublicKey':
            return [key, `0x${toHexString(val)}`];
          default:
            return [key, `0x${toHexString(val)}`];
        }
      }
      if (isObject(val)) return [key, prettifyPayload(val)];
      return [key, val];
    })
  );

export const toTx = (
  tx: Transaction__Output,
  txState: TransactionState__Output | null
) => {
  if (!hasRequiredTxFields(tx)) return null;
  // const hrp = deriveHRP(tx.template.address);
  // if (!hrp) {
  //   throw new Error(`Transaction TemplateAddress is not BECH32`);
  // }
  const tplAddress = Bech32.parse(tx.template.address);
  const tpl = TemplateRegistry.get(
    toHexString(tplAddress),
    (tx.method || 0) as 0 | 1
  );
  const decoded = tpl.decode(Uint8Array.from(tx.raw));
  const method = Number(decoded.MethodSelector) || tx.method || 0;
  const gasPrice = tx.gasPrice.toNumber();
  const maxGas = tx.maxGas.toNumber();
  const fee = gasPrice * maxGas;
  const res = <Tx<typeof decoded.Payload>>{
    id: toHexString(tx.id),
    principal: tx.principal.address,
    template: tx.template.address,
    method,
    status: txState?.state || TxState.TRANSACTION_STATE_UNSPECIFIED,
    payload: prettifyPayload(decoded.Payload),
    gas: {
      gasPrice,
      maxGas,
      fee,
    },
    meta: {
      templateName: getTemplateName(tplAddress),
      methodName: getMethodName(tplAddress, method),
    },
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
