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
          resolve({ error });
        }
        const currentLayer = response.layernum.number;
        resolve({ currentLayer });
      });
    });

  sendAccountMeshDataQuery = ({ accountId, offset }: { accountId: Uint8Array; offset: number }) =>
    new Promise((resolve) => {
      // @ts-ignore
      this.service.AccountMeshDataQuery({ filter: { account_id: accountId, account_mesh_data_flags: 1 }, min_layer: { number: 0 }, max_results: 50, offset }, (error, response) => {
        if (error) {
          logger.error('grpc AccountMeshDataQuery', error);
          resolve({ totalResults: 0, data: null, error });
        }
        if (!response) {
          resolve({ data: [], totalResults: 0, error: null });
        } else {
          const { data, totalResults } = response;
          resolve({ data, totalResults, error: null });
        }
      });
    });

  activateAccountMeshDataStream = ({ accountId, handler }: { accountId: Uint8Array; handler: ({ tx }: { tx: any }) => void }) => {
    // @ts-ignore
    const stream = this.service.AccountMeshDataStream({ filter: { account_id: accountId, account_mesh_data_flags: 1 } });
    stream.on('data', (response: any) => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { datum } = response;
      handler({ tx: datum });
    });
    stream.on('error', (error: any) => {
      logger.error('grpc AccountMeshDataStream', error);
      // @ts-ignore
      handler({ status: null, error });
    });
    stream.on('end', () => {
      console.log('AccountMeshDataStream ended'); // eslint-disable-line no-console
    });
  };
}

export default MeshService;
