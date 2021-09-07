import { ProtoGrpcType } from '../proto/tx';
import { PublicService, SocketAddress } from '../shared/types';
import { TransactionsStateStreamResponse__Output } from '../proto/spacemesh/v1/TransactionsStateStreamResponse';
import NetServiceFactory from './NetServiceFactory';
import Logger from './logger';

const PROTO_PATH = 'proto/tx.proto';

class TransactionService extends NetServiceFactory<ProtoGrpcType, 'TransactionService'> {
  logger = Logger({ className: 'TransactionService' });

  createService = (apiUrl?: PublicService | SocketAddress) => {
    this.createNetService(PROTO_PATH, apiUrl, 'TransactionService');
  };

  submitTransaction = ({ transaction }) => this.callService('SubmitTransaction', { transaction }).then(this.normalizeServiceResponse).catch(this.normalizeServiceError({}));

  getTxsState = (txIds: Uint8Array[]) =>
    this.callService('TransactionsState', {
      transactionId: txIds.map((id) => ({ id })),
      includeTransactions: true,
    });

  activateTxStream = (onData: (data: TransactionsStateStreamResponse__Output) => void, txIds: Uint8Array[]) => {
    if (!this.service) {
      throw new Error(`Service ${this.serviceName} is not running`);
    }
    const stream = this.service.TransactionsStateStream({
      transactionId: txIds.map((id) => ({ id })),
      includeTransactions: true,
    });
    stream.on('data', onData);
    stream.on('error', (error: Error & { code: number }) => {
      if (error.code === 1) return; // Cancelled on client
      console.log(`stream TransactionsStateStream error: ${error}`); // eslint-disable-line no-console
      this.logger.error('grpc TransactionStateStream', error);
    });
    return () => setImmediate(() => stream.cancel());
  };
}

export default TransactionService;
