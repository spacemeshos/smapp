import { ProtoGrpcType } from '../api/generated';

import Logger from './logger';
import NetServiceFactory from './NetServiceFactory';
import { getPrivateNodeConnectionConfig } from './main/utils';

const PROTO_PATH = 'vendor/api/spacemesh/v1/debug.proto';

class DebugService extends NetServiceFactory<
  ProtoGrpcType,
  'v1',
  'DebugService'
> {
  logger = Logger({ className: 'DebugService' });

  createService = () => {
    this.createNetService(
      PROTO_PATH,
      getPrivateNodeConnectionConfig(),
      'v1',
      'DebugService'
    );
  };

  getNetworkInfo = () => this.callService('NetworkInfo', {});
}

export default DebugService;
