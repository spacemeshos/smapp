import { ProtoGrpcType } from '../api/generated';
import NetServiceFactory from './NetServiceFactory';
import Logger from './logger';
import { getLocalNodeConnectionConfig } from './main/utils';

const PROTO_PATH = 'vendor/api/spacemesh/v2alpha1/activation.proto';

class ActivationV2Service extends NetServiceFactory<
  ProtoGrpcType,
  'v2alpha1',
  'ActivationService'
> {
  logger = Logger({ className: 'ActivationV2Service' });

  createService = () => {
    this.createNetService(
      PROTO_PATH,
      getLocalNodeConnectionConfig(),
      'v2alpha1',
      'ActivationService'
    );
  };

  public watchForAtxAmount = (handler: (amount: number) => void) =>
    setInterval(() => {
      this.callService('ActivationsCount', {})
        .then((res) => handler(res.count))
        .catch((err) => {
          this.logger.error('watchForAtxAmount', err);
        });
    }, 30000);
}

export default ActivationV2Service;
