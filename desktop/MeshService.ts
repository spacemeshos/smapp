import { ProtoGrpcType } from '../proto/mesh';
import NetServiceFactory from './NetServiceFactory';
import Logger from './logger';

const PROTO_PATH = 'proto/mesh.proto';

class MeshService extends NetServiceFactory<ProtoGrpcType, 'MeshService'> {
  logger = Logger({ className: 'MeshService' });

  createService = (url: string, port: string) => {
    this.createNetService(PROTO_PATH, url, port, 'MeshService');
  };

  getCurrentLayer = () =>
    this.callService('CurrentLayer', { a: 12 })
      .then((response) => {
        const currentLayer = response.layernum?.number || 0;
        return { currentLayer };
      })
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({ currentLayer: -1 }));

  sendAccountMeshDataQuery = ({ accountId, offset }: { accountId: Uint8Array; offset: number }) =>
    this.callService('AccountMeshDataQuery', { filter: { accountId: { address: accountId }, accountMeshDataFlags: 1 }, minLayer: { number: 0 }, maxResults: 50, offset })
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({ totalResults: 0, data: [] }));

  activateAccountMeshDataStream = ({ accountId, handler }: { accountId: Uint8Array; handler: ({ tx }: { tx: any }) => void }) => {
    if (!this.service) {
      throw new Error(`Service ${this.serviceName} is not running`);
    }

    const stream = this.service.AccountMeshDataStream({ filter: { accountId: { address: accountId }, accountMeshDataFlags: 1 } });
    stream.on('data', (response) => {
      handler({ tx: response });
    });
    stream.on('error', (error) => {
      console.log(`stream AccountMeshDataStream error: ${error}`); // eslint-disable-line no-console
      this.logger.error('grpc AccountMeshDataStream', error);
    });
    stream.on('end', () => {
      console.log('AccountMeshDataStream ended'); // eslint-disable-line no-console
      this.logger.log('grpc AccountMeshDataStream ended', null);
    });
    return () => stream.cancel();
  };
}

export default MeshService;
