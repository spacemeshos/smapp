import NetServiceFactory from './NetServiceFactory';
import Logger from './logger';

const logger = Logger({ className: 'NodeService' });
const PROTO_PATH = 'proto/node.proto';

class NodeService extends NetServiceFactory {
  private statusStream;

  private errorStream;

  createService = () => {
    this.createNetService(PROTO_PATH, '', '', 'NodeService');
  };

  getNodeVersion = () =>
    new Promise((resolve) => {
      // @ts-ignore
      this.service.Version({}, (error, response) => {
        if (error) {
          logger.error('grpc Version', error);
          resolve({ version: '', error });
        } else {
          resolve({ version: response.versionString.value, error: null });
        }
      });
    });

  getNodeBuild = () =>
    new Promise((resolve) => {
      // @ts-ignore
      this.service.Build({}, (error, response) => {
        if (error) {
          logger.error('grpc Build', error);
          resolve({ build: '', error });
        } else {
          resolve({ build: response.buildString.value, error: null });
        }
      });
    });

  getNodeStatus = () =>
    new Promise((resolve) => {
      // @ts-ignore
      this.service.Status({}, (error, response) => {
        if (error) {
          logger.error('grpc Status', error);
          resolve({ status: null, error });
        } else {
          const { connectedPeers, isSynced, syncedLayer, topLayer, verifiedLayer } = response.status;
          resolve({
            status: {
              connectedPeers: parseInt(connectedPeers),
              isSynced: !!isSynced,
              syncedLayer: syncedLayer.number,
              topLayer: topLayer.number,
              verifiedLayer: verifiedLayer.number
            },
            error: null
          });
        }
      });
    });

  shutdown = () =>
    new Promise((resolve) => {
      // @ts-ignore
      this.service.Shutdown({}, (error) => {
        if (error) {
          logger.error('grpc Shutdown', error);
          resolve({ shuttingDown: false, error });
        } else {
          resolve({ shuttingDown: true, error: null });
        }
      });
    });

  activateStatusStream = ({ handler }: { handler: ({ status, error }: { status: any; error: any }) => void }) => {
    // @ts-ignore
    this.statusStream = this.service.StatusStream({});
    this.statusStream.on('data', (response: any) => {
      const { connectedPeers, isSynced, syncedLayer, topLayer, verifiedLayer } = response.status;
      handler({
        status: {
          connectedPeers: parseInt(connectedPeers),
          isSynced: !!isSynced,
          syncedLayer: syncedLayer.number,
          topLayer: topLayer.number,
          verifiedLayer: verifiedLayer.number
        },
        error: null
      });
    });
    this.statusStream.on('error', (error: any) => {
      logger.error('grpc StatusStream', error);
      // @ts-ignore
      handler({ status: null, error });
    });
    this.statusStream.on('end', () => {
      console.log('StatusStream ended'); // eslint-disable-line no-console
      logger.log('grpc StatusStream ended', null);
    });
  };

  activateErrorStream = ({ handler }: { handler: ({ error }: { error: any }) => void }) => {
    // @ts-ignore
    this.errorStream = this.service.ErrorStream({});
    this.errorStream.on('data', (response: any) => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { error } = response;
      handler({ error: error.level });
    });
    this.errorStream.on('end', () => {
      console.log('ErrorStream ended'); // eslint-disable-line no-console
      logger.log('grpc ErrorStream ended', null);
    });
  };
}

export default NodeService;
