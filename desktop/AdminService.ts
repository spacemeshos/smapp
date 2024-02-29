import { ProtoGrpcType } from '../api/generated';
import { Event } from '../api/generated/spacemesh/v1/Event';

import Logger from './logger';
import NetServiceFactory from './NetServiceFactory';
import { getPrivateNodeConnectionConfig } from './main/utils';

const PROTO_PATH = 'vendor/api/spacemesh/v1/admin.proto';

class AdminService extends NetServiceFactory<
  ProtoGrpcType,
  'v1',
  'AdminService'
> {
  private cancelEventsStream: () => void = () => {};

  logger = Logger({ className: 'AdminService' });

  createService = () => {
    this.createNetService(
      PROTO_PATH,
      getPrivateNodeConnectionConfig(),
      'v1',
      'AdminService'
    );
  };

  activateEventsStream = (
    handler: (err: Error | null, event?: Event) => void
  ) => {
    this.cancelEventsStream();
    this.cancelEventsStream = this.runStream(
      'EventsStream',
      {},
      (event: Event) => handler(null, event),
      handler
    );
    return this.cancelEventsStream;
  };
}

export default AdminService;
