import { ProtoGrpcType } from '../api/generated';
import { PublicService, SocketAddress } from '../shared/types';
import NetServiceFactory from './NetServiceFactory';
import Logger from './logger';
import { Activation__Output } from '../api/generated/spacemesh/v2alpha1/Activation';

const PROTO_PATH = 'vendor/api/spacemesh/v2alpha1/activation.proto';

class ActivationV2Service extends NetServiceFactory<
  ProtoGrpcType,
  'v2alpha1',
  'ActivationStreamService'
> {
  logger = Logger({ className: 'ActivationV2Service' });

  createService = (apiUrl?: SocketAddress | PublicService) => {
    this.createNetService(PROTO_PATH, apiUrl, 'v2alpha1', 'ActivationStreamService');
  };

  public watchForAnyATXs = (
    handler: (payload: Activation__Output) => void
  ) =>
    this.runStream(
      'Stream',
      { watch: true },
      handler
    );
}

export default ActivationV2Service;
