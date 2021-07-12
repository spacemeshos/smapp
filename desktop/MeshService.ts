import NetServiceFactory from './NetServiceFactory';
import Logger from './logger';

const logger = Logger({ className: 'MeshService' });

const PROTO_PATH = 'proto/mesh.proto';

class MeshService extends NetServiceFactory {
  createService = (url: string, port: string) => {
    this.createNetService(PROTO_PATH, url, port, 'MeshService');
  };

  getCurrentLayer = () =>
    new Promise((resolve) => {
      // @ts-ignore
      this.service.CurrentLayer({}, (error, response) => {
        if (error) {
          logger.error('grpc MeshService', error);
          resolve({ currentLayer: -1, error });
        } else {
          const currentLayer = response.layernum.number;
          resolve({ currentLayer, error: null });
        }
      });
    });

  sendAccountMeshDataQuery = ({ accountId, offset }: { accountId: Uint8Array; offset: number }) =>
    new Promise((resolve) => {
      // @ts-ignore
      this.service.AccountMeshDataQuery(
        { filter: { accountId: { address: accountId }, accountMeshDataFlags: 1 }, minLayer: { number: 0 }, maxResults: 50, offset },
        (error, response) => {
          if (error) {
            logger.error('grpc AccountMeshDataQuery', error);
            resolve({ totalResults: 0, data: null, error });
          } else if (!response || !response.data) {
            resolve({ data: [], totalResults: 0, error: null });
          } else {
            const { data, totalResults } = response;
            resolve({ data, totalResults, error: null });
          }
        }
      );
    });

  activateAccountMeshDataStream = ({ accountId, handler }: { accountId: Uint8Array; handler: ({ tx }: { tx: any }) => void }) => {
    // @ts-ignore
    const stream = this.service.AccountMeshDataStream({ filter: { accountId: { address: accountId }, accountMeshDataFlags: 1 } });
    stream.on('data', (response: any) => {
      handler({ tx: response });
    });
    stream.on('error', (error: any) => {
      console.log(`stream AccountMeshDataStream error: ${error}`); // eslint-disable-line no-console
      logger.error('grpc AccountMeshDataStream', error);
    });
    stream.on('end', () => {
      console.log('AccountMeshDataStream ended'); // eslint-disable-line no-console
      logger.log('grpc AccountMeshDataStream ended', null);
    });
  };
}

export default MeshService;
