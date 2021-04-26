import path from 'path';
import * as grpc from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';

const DEFAULT_URL = 'localhost';
const DEFAULT_PORT = '9092';

class NetServiceFactory {
  private service: grpc.Client | null = null;

  private url = DEFAULT_URL;

  private port = DEFAULT_PORT;

  createNetService = (protoPath: string, url: string, port: string, serviceName: string) => {
    if (this.url !== url || this.port !== port) {
      if (this.service) {
        this.service.close();
      }
      const resolvedProtoPath = path.join(__dirname, '..', protoPath);
      const packageDefinition = loadSync(resolvedProtoPath);
      // @ts-ignore
      const Services = grpc.loadPackageDefinition(packageDefinition).spacemesh.v1;
      this.service = new Services[serviceName](`${url}:${port}`, grpc.credentials.createInsecure());
      this.url = url;
      this.port = port;
    }
  };
}

export default NetServiceFactory;
