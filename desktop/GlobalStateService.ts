import Logger from './logger';
import NetServiceFactory from './NetServiceFactory';
import { toHexString } from './utils';

const logger = Logger({ className: 'GlobalStateService' });

const PROTO_PATH = 'proto/global_state.proto';

class GlobalStateService extends NetServiceFactory {
  createService = (url: string, port: string) => {
    this.createNetService(PROTO_PATH, url, port, 'GlobalStateService');
  };

  getGlobalStateHash = () =>
    new Promise((resolve) => {
      // @ts-ignore
      this.service.GlobalStateHash({}, (error, response) => {
        if (error) {
          logger.error('grpc GlobalStateHash', error);
          resolve({ error });
        }
        const layer = response.layer.number;
        const hashRoot = toHexString(response.root_hash);
        resolve({ layer, hashRoot });
      });
    });

  sendAccountDataQuery = ({ filter, offset }: { filter: any; offset: any }) =>
    new Promise((resolve) => {
      // @ts-ignore
      this.service.AccountDataQuery({ filter, max_results: 0, offset }, (error, response) => {
        if (error) {
          logger.error('grpc AccountDataQuery', error);
          resolve({ data: null, error });
        }
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { total_results, account_item } = response;
        resolve({ totalResults: total_results, data: account_item });
      });
    });

  activateAccountDataStream = ({ filter, handler }: { filter: any; handler: ({ data }: { data: any }) => void }) => {
    // @ts-ignore
    const stream = this.service.AccountDataStream({ filter });
    stream.on('data', (response: any) => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { datum } = response;
      handler({ data: datum });
    });
    stream.on('error', (error: any) => {
      logger.error('grpc AccountDataStream', error);
      // @ts-ignore
      handler({ status: null, error });
    });
    stream.on('end', () => {
      console.log('AccountDataStream ended'); // eslint-disable-line no-console
    });
  };
}

export default GlobalStateService;
