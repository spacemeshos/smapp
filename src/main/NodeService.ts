import { ServiceError } from '@grpc/grpc-js';
import { captureException } from '@sentry/electron';
import { ProtoGrpcType } from '../../proto/node';
import {
  NodeError,
  NodeErrorLevel,
  NodeStatus,
  PublicService,
  SocketAddress,
} from '../shared/types';
import { delay, longToNumber } from '../shared/utils';
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

const asNodeError = (nodeError: NodeError): NodeError => nodeError;

const LOST_CONNECTION_ERROR = asNodeError({
  msg: 'Lost connection with the Node. Reconnecting...',
  level: NodeErrorLevel.LOG_LEVEL_DPANIC,
  module: 'NodeService',
  stackTrace: '',
});

const CAN_NOT_CONNECT_ERROR = asNodeError({
  msg: 'Node Service does not respond. Probably Node is down',
  level: NodeErrorLevel.LOG_LEVEL_FATAL,
  module: 'NodeService',
  stackTrace: '',
});

class NodeService extends NetServiceFactory<ProtoGrpcType, 'NodeService'> {
  private statusStream: ReturnType<
    Service<ProtoGrpcType, 'NodeService'>['StatusStream']
  > | null = null;

  private errorStream: ReturnType<
    Service<ProtoGrpcType, 'NodeService'>['ErrorStream']
  > | null = null;

  private isShuttingDown = false;

  logger = Logger({ className: 'NodeService' });

  createService = (apiUrl?: SocketAddress | PublicService) => {
    this.createNetService(PROTO_PATH, apiUrl, 'NodeService');
  };

  echo = () =>
    this.callService('Echo', { msg: { value: 'ready' } })
      .then(() => true)
      .catch(captureException);

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

        const {
          connectedPeers,
          isSynced,
          syncedLayer,
          topLayer,
          verifiedLayer,
        } = response.status;
        return {
          connectedPeers: longToNumber(connectedPeers || 0),
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
      .catch(() => false)
      .then((res) => {
        this.isShuttingDown = res;
        return res;
      });

  activateStatusStream = (
    statusHandler: StatusStreamHandler,
    errorHandler: ErrorStreamHandler,
    retries = 5
  ) => {
    if (!this.service) return;

    this.statusStream = this.service.StatusStream({});
    this.statusStream.on('data', (response: any) => {
      const {
        connectedPeers,
        isSynced,
        syncedLayer,
        topLayer,
        verifiedLayer,
      } = response.status;
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
    this.statusStream.on('end', async () => {
      console.log('StatusStream ended'); // eslint-disable-line no-console
      this.logger.log('grpc StatusStream ended', null);
      this.statusStream = null;
      if (this.isShuttingDown) {
        this.logger.log('grpc StatusStream shutted down', null);
        return;
      }
      if (retries > 0) {
        errorHandler(LOST_CONNECTION_ERROR);
        this.logger.log(
          'grpc StatusStream restarting',
          `Retries left: ${retries}`
        );
        await delay(5000);
        this.activateStatusStream(statusHandler, errorHandler, retries - 1);
      } else {
        errorHandler(CAN_NOT_CONNECT_ERROR);
        this.logger.error('grpc StatusStream can not restart', null);
      }
    });
  };

  cancelStatusStream = () => {
    if (!this.statusStream) return false;
    this.statusStream.cancel();
    this.statusStream = null;
    return true;
  };

  activateErrorStream = (handler: ErrorStreamHandler, retries = 5) => {
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
    this.errorStream.on('end', async () => {
      console.log('ErrorStream ended'); // eslint-disable-line no-console
      this.logger.log('grpc ErrorStream ended', null);
      this.errorStream = null;
      if (this.isShuttingDown) {
        this.logger.log('grpc ErrorStream shutted down', null);
        return;
      }
      if (retries > 0) {
        this.logger.log(
          'grpc ErrorStream restarting',
          `Retries left: ${retries}`
        );
        await delay(5000);
        this.activateErrorStream(handler, retries - 1);
      } else {
        this.logger.error('grpc ErrorStream can not restart', null);
      }
    });
  };

  cancelErrorStream = () => {
    if (!this.errorStream) return false;
    this.errorStream.cancel();
    this.errorStream = null;
    return true;
  };
}

export default NodeService;
