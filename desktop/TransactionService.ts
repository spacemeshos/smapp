import NetServiceFactory from './NetServiceFactory';
import Logger from './logger';

const logger = Logger({ className: 'TransactionService' });

const PROTO_PATH = 'proto/tx.proto';

class TransactionService extends NetServiceFactory {
  createService = (url: string, port: string) => {
    this.createNetService(PROTO_PATH, url, port, 'TransactionService');
  };

  submitTransaction = ({ transaction }) =>
    new Promise((resolve) => {
      // @ts-ignore
      this.service.SubmitTransaction({ transaction }, (error, response) => {
        if (error) {
          logger.error('grpc SubmitTransaction', error);
          resolve({ error });
        }
        resolve({ error: null, txstate: response.response.txstate });
      });
    });
}

export default TransactionService;
