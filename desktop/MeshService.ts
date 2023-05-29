import { ProtoGrpcType } from '../proto/mesh';
import { AccountMeshDataStreamResponse__Output } from '../proto/spacemesh/v1/AccountMeshDataStreamResponse';
import { AccountMeshDataFlag } from '../proto/spacemesh/v1/AccountMeshDataFlag';
import { PublicService, SocketAddress } from '../shared/types';
import { CurrentLayer } from '../app/types/events';
import NetServiceFactory from './NetServiceFactory';
import Logger from './logger';

const PROTO_PATH = 'proto/mesh.proto';

class MeshService extends NetServiceFactory<ProtoGrpcType, 'MeshService'> {
  logger = Logger({ className: 'MeshService' });

  createService = (apiUrl?: SocketAddress | PublicService) => {
    this.createNetService(PROTO_PATH, apiUrl, 'MeshService');
  };

  getCurrentLayer = (): Promise<CurrentLayer> =>
    this.callService('CurrentLayer', { a: 12 })
      .then((response) => {
        const currentLayer = response.layernum?.number || 0;
        return { currentLayer };
      })
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({ currentLayer: -1 }));

  sendAccountMeshDataQuery = ({
    accountId,
    offset,
  }: {
    accountId: Uint8Array;
    offset: number;
  }) =>
    this.callService('AccountMeshDataQuery', {
      filter: { accountId: { address: accountId }, accountMeshDataFlags: 1 },
      minLayer: { number: 0 },
      maxResults: 50,
      offset,
    })
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({ totalResults: 0, data: [] }));

  activateAccountMeshDataStream = (
    accountId: Uint8Array,
    handler: (tx: any) => void
  ) =>
    this.runStream(
      'AccountMeshDataStream',
      {
        filter: {
          accountId: { address: accountId },
          accountMeshDataFlags:
            AccountMeshDataFlag.ACCOUNT_MESH_DATA_FLAG_TRANSACTIONS,
        },
      },
      (data: AccountMeshDataStreamResponse__Output) => {
        if (!data.datum?.meshTransaction) return;
        handler(data.datum?.meshTransaction);
      }
    );
}

export default MeshService;
