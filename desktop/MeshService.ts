import { ProtoGrpcType } from '../proto/mesh';
import { AccountMeshDataStreamResponse__Output } from '../proto/spacemesh/v1/AccountMeshDataStreamResponse';
import { AccountMeshDataFlag } from '../proto/spacemesh/v1/AccountMeshDataFlag';
import { MeshTransaction__Output } from '../proto/spacemesh/v1/MeshTransaction';
import { AccountMeshData__Output } from '../proto/spacemesh/v1/AccountMeshData';
import { PublicService, SocketAddress } from '../shared/types';
import { delay } from '../shared/utils';
import { CurrentLayer } from '../app/types/events';
import NetServiceFactory from './NetServiceFactory';
import Logger from './logger';
import { GRPC_QUERY_BATCH_SIZE } from './main/constants';

const PROTO_PATH = 'proto/mesh.proto';

class MeshService extends NetServiceFactory<ProtoGrpcType, 'MeshService'> {
  logger = Logger({ className: 'MeshService' });

  createService = (apiUrl?: SocketAddress | PublicService) => {
    this.createNetService(PROTO_PATH, apiUrl, 'MeshService');
  };

  getCurrentLayer = (): Promise<CurrentLayer> =>
    this.callService('CurrentLayer', {})
      .then(({ layernum }) => ({
        currentLayer: layernum?.number || 0,
      }))
      .catch((err) => {
        this.logger.error('getCurrentLayer', err);
        // eslint-disable-next-line promise/no-nesting
        return delay(1000).then(() => this.getCurrentLayer());
      });

  private sendAccountMeshDataQuery = (
    accountId: Uint8Array,
    accountMeshDataFlags: AccountMeshDataFlag,
    offset: number
  ) => {
    return this.callService('AccountMeshDataQuery', {
      filter: {
        accountId: { address: accountId },
        accountMeshDataFlags,
      },
      minLayer: { number: 0 },
      maxResults: GRPC_QUERY_BATCH_SIZE,
      offset,
    })
      .then(this.normalizeServiceResponse)
      .catch(
        this.normalizeServiceError({
          totalResults: 0,
          data: <AccountMeshData__Output[]>[],
        })
      );
  };

  public requestMeshTransactions = (accountId: Uint8Array, offset: number) =>
    this.sendAccountMeshDataQuery(
      accountId,
      AccountMeshDataFlag.ACCOUNT_MESH_DATA_FLAG_TRANSACTIONS,
      offset
    );

  public requestMeshActivations = (accountId: Uint8Array, offset: number) => {
    return this.sendAccountMeshDataQuery(
      accountId,
      AccountMeshDataFlag.ACCOUNT_MESH_DATA_FLAG_ACTIVATIONS,
      offset
    );
  };

  private activateAccountMeshDataStream = (
    accountId: Uint8Array,
    accountMeshDataFlags: AccountMeshDataFlag,
    handler: (payload: any) => void
  ) =>
    this.runStream(
      'AccountMeshDataStream',
      {
        filter: {
          accountId: { address: accountId },
          accountMeshDataFlags,
        },
      },
      (data: AccountMeshDataStreamResponse__Output) => {
        if (
          accountMeshDataFlags ===
            AccountMeshDataFlag.ACCOUNT_MESH_DATA_FLAG_TRANSACTIONS &&
          data.datum?.meshTransaction
        ) {
          handler(data.datum.meshTransaction);
        } else if (
          accountMeshDataFlags ===
            AccountMeshDataFlag.ACCOUNT_MESH_DATA_FLAG_ACTIVATIONS &&
          data.datum?.activation
        ) {
          handler(data.datum.activation);
        } else {
          this.logger.error('Unknown Account Mesh data:', data);
        }
      }
    );

  public listenMeshTransactions = (
    accountId: Uint8Array,
    handler: (tx: MeshTransaction__Output) => void
  ) =>
    this.activateAccountMeshDataStream(
      accountId,
      AccountMeshDataFlag.ACCOUNT_MESH_DATA_FLAG_TRANSACTIONS,
      handler
    );

  public listenMeshActivations = (
    accountId: Uint8Array,
    handler: (atx: any) => void
  ) =>
    this.activateAccountMeshDataStream(
      accountId,
      AccountMeshDataFlag.ACCOUNT_MESH_DATA_FLAG_ACTIVATIONS,
      handler
    );
}

export default MeshService;
