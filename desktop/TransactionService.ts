import { ProtoGrpcType } from '../proto/tx';
import { PublicService, SocketAddress } from '../shared/types';
import { TransactionsStateStreamResponse__Output } from '../proto/spacemesh/v1/TransactionsStateStreamResponse';
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
}

export default TransactionService;
