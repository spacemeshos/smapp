import { ProtoGrpcType } from '../api/generated';
import { Activation__Output } from '../api/generated/spacemesh/v2alpha1/Activation';
import NetServiceFactory from './NetServiceFactory';
import Logger from './logger';
import { getPrivateNodeConnectionConfig } from './main/utils';

const PROTO_PATH = 'vendor/api/spacemesh/v2alpha1/activation.proto';

class ActivationV2Service extends NetServiceFactory<
  ProtoGrpcType,
  'v2alpha1',
  'ActivationStreamService'
> {
  logger = Logger({ className: 'ActivationV2Service' });

  createService = () => {
    this.createNetService(
      PROTO_PATH,
      getPrivateNodeConnectionConfig(),
      'v2alpha1',
      'ActivationStreamService'
    );
  };

  public watchForAnyATXs = (handler: (payload: Activation__Output) => void) =>
    this.runStream('Stream', { watch: true }, handler);
}

export default ActivationV2Service;
