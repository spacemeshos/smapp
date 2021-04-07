import NetServiceFactory from './NetServiceFactory';
import Logger from './logger';

const logger = Logger({ className: 'NodeService' });
const PROTO_PATH = 'proto/node.proto';

class NodeService extends NetServiceFactory {
  private stream;

  createService = () => {
    super.createNetService(PROTO_PATH, '', '', 'NodeService');
  };

  getNodeVersion = () =>
    new Promise((resolve) => {
      // @ts-ignore
      this.service.Version({}, (error, response) => {
        if (error) {
          logger.error('grpc Version', error);
          resolve({ version: '', error });
        }
        resolve({ version: response.version_string.value, error: null });
      });
    });

  getNodeBuild = () =>
    new Promise((resolve) => {
      // @ts-ignore
      this.service.Build({}, (error, response) => {
        if (error) {
          logger.error('grpc Build', error);
          resolve({ build: '', error });
        }
        resolve({ build: response.build_string.value, error: null });
      });
    });

  getNodeStatus = () =>
    new Promise((resolve) => {
      // @ts-ignore
      this.service.Status({}, (error, response) => {
        if (error) {
          logger.error('grpc Status', error);
          resolve({ status: null, error });
        }
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { connected_peers, is_synced, synced_layer, top_layer, verified_layer } = response;
        resolve({
          status: {
            connectedPeers: parseInt(connected_peers),
            isSynced: is_synced,
            syncedLayer: synced_layer.number,
            topLayer: top_layer.number,
            verifiedLayer: verified_layer.number
          },
          error: null
        });
      });
    });

  shutdown = () =>
    new Promise((resolve) => {
      // @ts-ignore
      this.service.Shutdown({}, (error) => {
        if (error) {
          logger.error('grpc Shutdown', error);
          resolve({ shuttingDown: false, error });
        }
        resolve({ shuttingDown: true, error: null });
      });
    });

  activateStatusStream = ({ handler }: { handler: ({ status, error }: { status: any; error: any }) => void }) => {
    // @ts-ignore
    this.stream = this.service.StatusStream({});
    this.stream.on('data', (response: any) => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { connected_peers, is_synced, synced_layer, top_layer, verified_layer } = response;
      handler({
        status: {
          connectedPeers: parseInt(connected_peers),
          isSynced: is_synced,
          syncedLayer: synced_layer.number,
          topLayer: top_layer.number,
          verifiedLayer: verified_layer.number
        },
        error: null
      });
    });
    this.stream.on('error', (error: any) => {
      logger.error('grpc StatusStream', error);
      // @ts-ignore
      handler({ status: null, error });
    });
    this.stream.on('end', () => {
      console.log('StatusStream ended'); // eslint-disable-line no-console
    });
  };

  activateErrorStream = ({ handler }: { handler: ({ error }: { error: any }) => void }) => {
    // @ts-ignore
    this.stream = this.service.ErrorStream({});
    this.stream.on('data', (response: any) => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { error } = response;
      handler({ error: error.level });
    });
    this.stream.on('end', () => {
      console.log('ErrorStream ended'); // eslint-disable-line no-console
    });
  };
}

export default NodeService;
