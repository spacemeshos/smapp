import path from 'path';
import * as grpc from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';

const DEFAULT_URL = 'localhost';
const DEFAULT_PORT = '9092';

class NetServiceFactory {
  private service: grpc.Client | null = null;

  private url;

  private port;

  createNetService = (protoPath: string, url = '', port = '', serviceName: string) => {
    if (this.url !== url || this.port !== port) {
      if (this.service) {
        this.service.close();
      }
      const resolvedUrl = url || DEFAULT_URL;
      const resolvedPort = port || DEFAULT_PORT;
      const resolvedProtoPath = path.join(__dirname, '..', protoPath);
      const packageDefinition = loadSync(resolvedProtoPath);
      // @ts-ignore
      const Services = grpc.loadPackageDefinition(packageDefinition).spacemesh.v1;
      this.service = new Services[serviceName](`${resolvedUrl}:${resolvedPort}`, grpc.credentials.createInsecure());
      this.url = resolvedUrl;
      this.port = resolvedPort;
    }
  };
}

export default NetServiceFactory;
