import { ServiceError } from '@grpc/grpc-js';
import { NodeError, NodeErrorLevel, NodeStatus } from '../shared/types';
import NetServiceFactory from './NetServiceFactory';
import Logger from './logger';

const logger = Logger({ className: 'NodeService' });
const PROTO_PATH = 'proto/node.proto';

export type StreamHandler = ({ status, error }: { status?: NodeStatus; error?: NodeError }) => void;

const normalizeGrpcErrorToNodeError = (error: ServiceError): NodeError => ({
  msg: error.details,
  stackTrace: error.stack || '',
  module: 'NodeService',
  level: NodeErrorLevel.LOG_LEVEL_ERROR
});

class NodeService extends NetServiceFactory {
  private statusStream;

  private errorStream;

  createService = () => {
    this.createNetService(PROTO_PATH, '', '', 'NodeService');
  };

  echo = () =>
    new Promise<boolean>((resolve) => {
      // @ts-ignore
      this.service.Echo({ msg: { value: 'ready' } }, (error) => {
        if (error) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });

  getNodeVersion = (): Promise<string> =>
    new Promise((resolve, reject) => {
      // @ts-ignore
      this.service.Version({}, (error, response) => {
        if (error) {
          logger.error('grpc Version', error);
          reject(normalizeGrpcErrorToNodeError(error));
        } else {
          resolve(response.versionString.value);
        }
      });
    });

  getNodeBuild = (): Promise<string> =>
    new Promise((resolve, reject) => {
      // @ts-ignore
      this.service.Build({}, (error, response) => {
        if (error) {
          logger.error('grpc Build', error);
          reject(normalizeGrpcErrorToNodeError(error));
        } else {
          resolve(response.buildString.value);
        }
      });
    });

  getNodeStatus = (): Promise<NodeStatus> =>
    new Promise((resolve, reject) => {
      // @ts-ignore
      this.service.Status({}, (error, response) => {
        if (error) {
          logger.error('grpc Status', error);
          reject(normalizeGrpcErrorToNodeError(error));
        } else {
          const { connectedPeers, isSynced, syncedLayer, topLayer, verifiedLayer } = response.status;
          resolve({
            connectedPeers: parseInt(connectedPeers),
            isSynced: !!isSynced,
            syncedLayer: syncedLayer.number,
            topLayer: topLayer.number,
            verifiedLayer: verifiedLayer.number
          });
        }
      });
    });

  shutdown = (): Promise<boolean> =>
    new Promise((resolve) => {
      // @ts-ignore
      this.service.Shutdown({}, (error) => {
        if (error) {
          logger.error('grpc Shutdown', error);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });

  activateStatusStream = (handler: StreamHandler) => {
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
        }
      });
    });
    this.statusStream.on('error', (error: ServiceError) => {
      logger.error('grpc StatusStream', error);
      handler({ error: normalizeGrpcErrorToNodeError(error) });
    });
    this.statusStream.on('end', () => {
      console.log('StatusStream ended'); // eslint-disable-line no-console
      logger.log('grpc StatusStream ended', null);
    });
  };

  activateErrorStream = (handler: StreamHandler) => {
    // @ts-ignore
    this.errorStream = this.service.ErrorStream({});
    this.errorStream.on('data', (response: any) => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { error } = response;
      handler({ error });
    });
    this.errorStream.on('error', (error: any) => {
      logger.error('grpc ErrorStream', error);
      handler({ error: normalizeGrpcErrorToNodeError(error) });
    });
    this.errorStream.on('end', () => {
      console.log('ErrorStream ended'); // eslint-disable-line no-console
      logger.log('grpc ErrorStream ended', null);
    });
  };
}

export default NodeService;
