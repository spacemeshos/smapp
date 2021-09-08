import { ProtoGrpcType } from '../proto/global_state';
import Logger from './logger';
import NetServiceFactory, { Service } from './NetServiceFactory';
import { toHexString } from './utils';

const PROTO_PATH = 'proto/global_state.proto';

class GlobalStateService extends NetServiceFactory<ProtoGrpcType, 'GlobalStateService'> {
  private stream: ReturnType<Service<ProtoGrpcType, 'GlobalStateService'>['AccountDataStream']> | null = null;

  logger = Logger({ className: 'GlobalStateService' });

  createService = (url: string, port: string) => {
    this.createNetService(PROTO_PATH, url, port, 'GlobalStateService');
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
    if (this.service && !this.stream) {
      this.stream = this.service.AccountDataStream({ filter });
      this.stream.on('data', (response: any) => {
        const { datum } = response;
        handler({ data: datum });
      });
      this.stream.on('error', (error: any) => {
        console.log(`stream AccountDataStream error: ${error}`); // eslint-disable-line no-console
        this.logger.error('grpc AccountDataStream', error);
      });
      this.stream.on('end', () => {
        console.log('grpc stream AccountDataStream ended'); // eslint-disable-line no-console
        this.logger.log('grpc AccountDataStream ended', null);
        this.stream = null;
      });
    }
  };
}

export default GlobalStateService;
