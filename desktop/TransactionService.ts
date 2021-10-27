import { ProtoGrpcType } from '../proto/tx';
import { PublicService, SocketAddress } from '../shared/types';
import NetServiceFactory from './NetServiceFactory';
import Logger from './logger';

const PROTO_PATH = 'proto/tx.proto';

class TransactionService extends NetServiceFactory<ProtoGrpcType, 'TransactionService'> {
  logger = Logger({ className: 'TransactionService' });

  createService = (apiUrl?: PublicService | SocketAddress) => {
    this.createNetService(PROTO_PATH, apiUrl, 'TransactionService');
  };

  submitTransaction = ({ transaction }) => this.callService('SubmitTransaction', { transaction }).then(this.normalizeServiceResponse).catch(this.normalizeServiceError);
}

export default TransactionService;
