import { ProtoGrpcType } from '../proto/admin';
import { Event } from '../proto/spacemesh/v1/Event';

import Logger from './logger';
import NetServiceFactory from './NetServiceFactory';
import { getPrivateNodeConnectionConfig } from './main/utils';

const PROTO_PATH = 'proto/admin.proto';

class AdminService extends NetServiceFactory<ProtoGrpcType, 'AdminService'> {
  private cancelEventsStream: () => void = () => {};

  logger = Logger({ className: 'AdminService' });

  createService = () => {
    this.createNetService(
      PROTO_PATH,
      getPrivateNodeConnectionConfig(),
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
