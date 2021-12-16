import { toHexString } from '../../desktop/utils';
import { Transaction__Output } from '../../proto/spacemesh/v1/Transaction';
import { TransactionReceipt__Output } from '../../proto/spacemesh/v1/TransactionReceipt';
import { TransactionState__Output } from '../../proto/spacemesh/v1/TransactionState';
import { hasRequiredTxFields } from './guards';
import { HexString } from './misc';
import { Tx, TxState } from './tx';

const getTxReceiver = (tx: Transaction__Output): HexString =>
  // eslint-disable-next-line no-nested-ternary
  tx.coinTransfer?.receiver?.address ? toHexString(tx.coinTransfer.receiver.address) : tx.smartContract?.accountId?.address ? toHexString(tx.smartContract.accountId.address) : '0';

export const toTx = (tx: Transaction__Output, txState: TransactionState__Output | null): Tx | null => {
  if (!hasRequiredTxFields(tx)) return null;
  return {
    id: toHexString(tx.id.id),
    sender: toHexString(tx.sender.address),
    receiver: getTxReceiver(tx),
    status: txState?.state || TxState.TRANSACTION_STATE_UNSPECIFIED,
    amount: tx.amount.value.toNumber(),
    gasOffered: {
      price: tx.gasOffered?.gasPrice?.toNumber() || 0,
      provided: tx.gasOffered?.gasProvided?.toNumber() || 0,
    },
  };
};

export const addReceiptToTx = (tx: Tx, receipt: TransactionReceipt__Output): Tx => ({
  ...tx,
  layer: receipt.layer?.number || tx.layer,
  receipt: {
    result: receipt.result,
    gasUsed: receipt.gasUsed.toNumber(),
    fee: receipt.fee?.value.toNumber() || 0,
    svmData: toHexString(receipt.svmData),
  },
});
