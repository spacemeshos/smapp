import { ProtoGrpcType } from '../proto/tx';
import NetServiceFactory from './NetServiceFactory';
import Logger from './logger';

const PROTO_PATH = 'proto/tx.proto';

class TransactionService extends NetServiceFactory<ProtoGrpcType, 'TransactionService'> {
  logger = Logger({ className: 'TransactionService' });

  createService = (url: string, port: string) => {
    this.createNetService(PROTO_PATH, url, port, 'TransactionService');
  };

  submitTransaction = ({ transaction }) => this.callService('SubmitTransaction', { transaction }).then(this.normalizeServiceResponse).catch(this.normalizeServiceError);
}

export default TransactionService;
