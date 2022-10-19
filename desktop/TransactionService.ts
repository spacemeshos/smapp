import { ProtoGrpcType } from '../proto/tx';
import { Bech32Address, PublicService, SocketAddress } from '../shared/types';
import { TransactionsStateStreamResponse__Output } from '../proto/spacemesh/v1/TransactionsStateStreamResponse';
import { TransactionResult__Output } from '../proto/spacemesh/v1/TransactionResult';
import NetServiceFactory from './NetServiceFactory';
import Logger from './logger';

const PROTO_PATH = 'proto/tx.proto';

class TransactionService extends NetServiceFactory<
  ProtoGrpcType,
  'TransactionService'
> {
  logger = Logger({ className: 'TransactionService' });

  createService = (apiUrl?: PublicService | SocketAddress) => {
    this.createNetService(PROTO_PATH, apiUrl, 'TransactionService');
  };

  submitTransaction = ({ transaction }) =>
    this.callService('SubmitTransaction', { transaction })
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({}));

  getTxsState = (txIds: Uint8Array[]) =>
    this.callService('TransactionsState', {
      transactionId: txIds.map((id) => ({ id })),
      includeTransactions: true,
    });

  activateTxStream = (
    onData: (data: TransactionsStateStreamResponse__Output) => void,
    txIds: Uint8Array[]
  ) =>
    this.runStream(
      'TransactionsStateStream',
      {
        transactionId: txIds.map((id) => ({ id })),
        includeTransactions: true,
      },
      onData
    );

  watchTransactionsByAddress = (
    address: Bech32Address,
    onData: (data: TransactionResult__Output) => void
  ) =>
    this.runStream(
      'StreamResults',
      {
        address,
        watch: true,
      },
      onData
    );
}

export default TransactionService;
