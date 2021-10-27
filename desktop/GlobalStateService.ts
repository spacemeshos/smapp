import { ProtoGrpcType } from '../proto/global_state';
import { PublicService, SocketAddress } from '../shared/types';
import Logger from './logger';
import NetServiceFactory from './NetServiceFactory';
import { toHexString } from './utils';

const PROTO_PATH = 'proto/global_state.proto';

class GlobalStateService extends NetServiceFactory<ProtoGrpcType, 'GlobalStateService'> {
  logger = Logger({ className: 'GlobalStateService' });

  createService = (apiUrl?: SocketAddress | PublicService) => {
    this.createNetService(PROTO_PATH, apiUrl, 'GlobalStateService');
  };

  getGlobalStateHash = () =>
    this.callService('GlobalStateHash', {})
      .then((response) => ({
        layer: response.response?.layer?.number || 0,
        rootHash: response.response?.rootHash ? toHexString(response.response.rootHash) : ''
      }))
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({ layer: -1, rootHash: '' }));

  sendAccountDataQuery = ({ filter, offset }: { filter: { accountId: { address: Uint8Array }; accountDataFlags: number }; offset: number }) =>
    this.callService('AccountDataQuery', { filter, maxResults: 0, offset })
      .then((response) => ({
        totalResults: response.totalResults,
        data: response.accountItem
      }))
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({ totalResults: 0, data: [] }));

  activateAccountDataStream = ({ filter, handler }: { filter: { accountId: { address: Uint8Array }; accountDataFlags: number }; handler: ({ data }: { data: any }) => void }) => {
    if (!this.service) {
      throw new Error(`GlobalStateService is not running`);
    }

    const stream = this.service.AccountDataStream({ filter });
    stream.on('data', (response: any) => {
      const { datum } = response;
      handler({ data: datum });
    });
    stream.on('error', (error: Error & { code: number }) => {
      if (error.code === 1) return; // Cancelled on client
      console.log(`stream AccountDataStream error: ${error}`); // eslint-disable-line no-console
      this.logger.error('grpc AccountDataStream', error);
    });
    stream.on('end', () => {
      console.log('grpc stream AccountDataStream ended'); // eslint-disable-line no-console
      this.logger.log('grpc AccountDataStream ended', null);
    });

    return () => stream.cancel();
  };
}

export default GlobalStateService;
