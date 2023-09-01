import { ServiceError } from '@grpc/grpc-js';
import { ProtoGrpcType } from '../proto/node';
import {
  asNodeError,
  NodeError,
  NodeErrorLevel,
  NodeStatus,
  PublicService,
  SocketAddress,
} from '../shared/types';
import { longToNumber } from '../shared/utils';
import { DEFAULT_NODE_STATUS } from '../shared/constants';
import NetServiceFactory from './NetServiceFactory';
import Logger from './logger';
import { getLocalNodeConnectionConfig } from './main/utils';

const PROTO_PATH = 'proto/node.proto';

export type StatusStreamHandler = (status: NodeStatus) => void;
export type ErrorStreamHandler = (error: NodeError) => void;

const normalizeGrpcErrorToNodeError = (error: ServiceError): NodeError => ({
  msg: error.details,
  stackTrace: error.stack || '',
  module: 'NodeService',
  level: NodeErrorLevel.LOG_LEVEL_WARN,
});

const LOST_CONNECTION_ERROR = asNodeError({
  msg: 'Lost connection with the Node. Reconnecting...',
  level: NodeErrorLevel.LOG_LEVEL_ERROR,
  module: 'NodeService',
  stackTrace: new Error().stack || '',
});

const NODE_NOT_RESPONDING_ERROR = asNodeError({
  msg: 'Can not connect to Node. Probably Node is down',
  level: NodeErrorLevel.LOG_LEVEL_FATAL,
  module: 'NodeService',
  stackTrace: new Error().stack || '',
});

class NodeService extends NetServiceFactory<ProtoGrpcType, 'NodeService'> {
  logger = Logger({ className: 'NodeService' });

  createService = (apiUrl?: SocketAddress | PublicService) => {
    this.createNetService(
      PROTO_PATH,
      apiUrl || getLocalNodeConnectionConfig(),
      'NodeService'
    );
  };

  echo = () =>
    this.callService('Echo', { msg: { value: 'ready' } })
      .then(() => true)
      .catch(() => false);

  getNodeVersion = (): Promise<string> =>
    this.callServiceWithRetries('Version', {})
      .then((response) => response.versionString?.value || 'v?.?.?')
      .catch((error) => {
        throw normalizeGrpcErrorToNodeError(error);
      });

  getNodeBuild = (): Promise<string> =>
    this.callServiceWithRetries('Build', {})
      .then((response) => response.buildString?.value || '')
      .catch((error) => {
        throw normalizeGrpcErrorToNodeError(error);
      });

  getNodeStatus = (): Promise<NodeStatus> =>
    this.callServiceWithRetries('Status', {})
      .then((response) => {
        if (!response.status) return { ...DEFAULT_NODE_STATUS };

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

  activateStatusStream = (
    statusHandler: StatusStreamHandler,
    errorHandler: ErrorStreamHandler
  ) => {
    let errCount = 0;
    return this.runStream(
      'StatusStream',
      {},
      (response) => {
        if (!response.status) return;
        const {
          connectedPeers,
          isSynced,
          syncedLayer,
          topLayer,
          verifiedLayer,
        } = response.status;
        statusHandler({
          connectedPeers: longToNumber(connectedPeers || 0),
          isSynced: !!isSynced,
          syncedLayer: syncedLayer?.number || 0,
          topLayer: topLayer?.number || 0,
          verifiedLayer: verifiedLayer?.number || 0,
        });
        errCount = 0;
      },
      () => {
        if (errCount === 5) {
          errorHandler(NODE_NOT_RESPONDING_ERROR);
        } else if (errCount === 3) {
          errorHandler(LOST_CONNECTION_ERROR);
        }
        errCount += 1;
      }
    );
  };

  activateErrorStream = (handler: ErrorStreamHandler) =>
    this.runStream(
      'ErrorStream',
      {},
      (err) =>
        err.error &&
        handler(
          asNodeError({
            ...err.error,
            level: (err.error.level as unknown) as NodeErrorLevel,
          })
        )
    );
}

export default NodeService;
