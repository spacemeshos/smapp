import { ServiceError } from '@grpc/grpc-js';
import { ProtoGrpcType } from '../proto/node';
import { NodeError, NodeErrorLevel, NodeStatus, PublicService, SocketAddress } from '../shared/types';
import NetServiceFactory, { Service } from './NetServiceFactory';
import Logger from './logger';

const PROTO_PATH = 'proto/node.proto';

export type StatusStreamHandler = (status: NodeStatus) => void;
export type ErrorStreamHandler = (error: NodeError) => void;

const normalizeGrpcErrorToNodeError = (error: ServiceError): NodeError => ({
  msg: error.details,
  stackTrace: error.stack || '',
  module: 'NodeService',
  level: NodeErrorLevel.LOG_LEVEL_ERROR,
});

class NodeService extends NetServiceFactory<ProtoGrpcType, 'NodeService'> {
  private statusStream: ReturnType<Service<ProtoGrpcType, 'NodeService'>['StatusStream']> | null = null;

  private errorStream: ReturnType<Service<ProtoGrpcType, 'NodeService'>['ErrorStream']> | null = null;

  logger = Logger({ className: 'NodeService' });

  createService = (apiUrl?: SocketAddress | PublicService) => {
    this.createNetService(PROTO_PATH, apiUrl, 'NodeService');
  };

  echo = () =>
    this.callService('Echo', { msg: { value: 'ready' } })
      .then(() => true)
      .catch(() => false);

  getNodeVersion = (): Promise<string> =>
    this.callService('Version', {})
      .then((response) => response.versionString?.value || 'v?.?.?')
      .catch((error) => {
        throw normalizeGrpcErrorToNodeError(error);
      });

  getNodeBuild = (): Promise<string> =>
    this.callService('Build', {})
      .then((response) => response.buildString?.value || '')
      .catch((error) => {
        throw normalizeGrpcErrorToNodeError(error);
      });

  getNodeStatus = (): Promise<NodeStatus> =>
    this.callService('Status', {})
      .then((response) => {
        const DEFAULTS = {
          connectedPeers: 0,
          isSynced: false,
          syncedLayer: 0,
          topLayer: 0,
          verifiedLayer: 0,
        };
        if (!response.status) return { ...DEFAULTS };

        const { connectedPeers, isSynced, syncedLayer, topLayer, verifiedLayer } = response.status;
        return {
          connectedPeers: parseInt(connectedPeers),
          isSynced: !!isSynced,
          syncedLayer: syncedLayer?.number || 0,
          topLayer: topLayer?.number || 0,
          verifiedLayer: verifiedLayer?.number || 0,
        } as NodeStatus;
      })
      .catch((error) => {
        throw normalizeGrpcErrorToNodeError(error);
      });

  shutdown = (): Promise<boolean> =>
    this.callService('Shutdown', {})
      .then(() => true)
      .catch(() => false);

  activateStatusStream = (statusHandler: StatusStreamHandler, errorHandler: ErrorStreamHandler) => {
    if (!this.service) return;

    this.statusStream = this.service.StatusStream({});
    this.statusStream.on('data', (response: any) => {
      const { connectedPeers, isSynced, syncedLayer, topLayer, verifiedLayer } = response.status;
      statusHandler({
        connectedPeers: parseInt(connectedPeers),
        isSynced: !!isSynced,
        syncedLayer: syncedLayer.number,
        topLayer: topLayer.number,
        verifiedLayer: verifiedLayer.number,
      });
    });
    this.statusStream.on('error', (error: ServiceError) => {
      this.logger.error('grpc StatusStream', error);
      errorHandler(normalizeGrpcErrorToNodeError(error));
    });
    this.statusStream.on('end', () => {
      console.log('StatusStream ended'); // eslint-disable-line no-console
      this.logger.log('grpc StatusStream ended', null);
      this.statusStream = null;
    });
  };

  activateErrorStream = (handler: ErrorStreamHandler) => {
    if (!this.service) return;

    this.errorStream = this.service.ErrorStream({});
    this.errorStream.on('data', (response: any) => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { error } = response;
      handler(error);
    });
    this.errorStream.on('error', (error: any) => {
      this.logger.error('grpc ErrorStream', error);
      handler(normalizeGrpcErrorToNodeError(error));
    });
    this.errorStream.on('end', () => {
      console.log('ErrorStream ended'); // eslint-disable-line no-console
      this.logger.log('grpc ErrorStream ended', null);
      this.errorStream = null;
    });
  };
}

export default NodeService;
