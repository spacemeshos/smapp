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
          resolve({ layer: -1, rootHash: '', error });
        } else {
          const layer = response.response.layer.number;
          const rootHash = toHexString(response.response.rootHash);
          resolve({ layer, rootHash, error: null });
        }
      });
    });

  sendAccountDataQuery = ({ filter, offset }: { filter: { accountId: { address: Uint8Array }; accountDataFlags: number }; offset: number }) =>
    new Promise((resolve) => {
      // @ts-ignore
      this.service.AccountDataQuery({ filter, maxResults: 0, offset }, (error, response) => {
        if (error) {
          logger.error('grpc AccountDataQuery', error);
        } else if (!response || !response.accountItem) {
          resolve({ totalResults: 0, data: [], error: null });
        } else {
          const { totalResults, accountItem } = response;
          resolve({ totalResults, data: accountItem, error: null });
        }
      });
    });

  activateAccountDataStream = ({ filter, handler }: { filter: { accountId: { address: Uint8Array }; accountDataFlags: number }; handler: ({ data }: { data: any }) => void }) => {
    // @ts-ignore
    const stream = this.service.AccountDataStream({ filter });
    stream.on('data', (response: any) => {
      const { datum } = response;
      handler({ data: datum });
    });
    stream.on('error', (error: any) => {
      console.log(`stream AccountDataStream error: ${error}`); // eslint-disable-line no-console
      logger.error('grpc AccountDataStream', error);
    });
    stream.on('end', () => {
      console.log('grpc stream AccountDataStream ended'); // eslint-disable-line no-console
      logger.log('grpc AccountDataStream ended', null);
    });
  };
}

export default GlobalStateService;
