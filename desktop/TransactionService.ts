import NetServiceFactory from './NetServiceFactory';
import { toHexString } from './utils';
import Logger from './logger';

const logger = Logger({ className: 'TransactionService' });
const PROTO_PATH = 'proto/tx.proto';

class TransactionService extends NetServiceFactory {
  createService = (url: string, port: string) => {
    super.createNetService(PROTO_PATH, url, port, 'TransactionService');
  };

  submitTransaction = ({ transaction }) =>
    new Promise((resolve) => {
      // @ts-ignore
      this.service.SubmitTransaction({ transaction }, (error, response) => {
        if (error) {
          logger.error('grpc SubmitTransaction', error);
          resolve({ error });
        }
        const layer = response.layer.number;
        const hashRoot = toHexString(response.root_hash);
        resolve({ layer, hashRoot });
      });
    });
}

export default TransactionService;
