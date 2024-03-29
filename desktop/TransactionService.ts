import { ProtoGrpcType } from '../api/generated';
import { Bech32Address, PublicService, SocketAddress } from '../shared/types';
import { TransactionsStateStreamResponse__Output } from '../api/generated/spacemesh/v1/TransactionsStateStreamResponse';
import { TransactionResult__Output } from '../api/generated/spacemesh/v1/TransactionResult';
import NetServiceFactory from './NetServiceFactory';
import Logger from './logger';

const PROTO_PATH = 'vendor/api/spacemesh/v1/tx.proto';

class TransactionService extends NetServiceFactory<
  ProtoGrpcType,
  'v1',
  'TransactionService'
> {
  logger = Logger({ className: 'TransactionService' });

  createService = (apiUrl?: PublicService | SocketAddress) => {
    this.createNetService(PROTO_PATH, apiUrl, 'v1', 'TransactionService');
  };

  submitTransaction = ({ transaction }) =>
    this.callService('SubmitTransaction', { transaction })
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({}));

  parseTransaction = ({ transaction }) =>
    this.callService('ParseTransaction', { transaction })
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({}));

  getTxsState = (txIds: Uint8Array[]) =>
    this.callServiceWithRetries('TransactionsState', {
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
