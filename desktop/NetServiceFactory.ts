import path from 'path';
import * as grpc from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';

const DEFAULT_URL = 'localhost';
const DEFAULT_PORT = '9092';

class NetServiceFactory {
  private service: grpc.Client | null = null;

  private url = '';

  private port = '';

  createNetService = (protoPath: string, url: string = DEFAULT_URL, port: string = DEFAULT_PORT, serviceName: string) => {
    if (this.url !== url || this.port !== port) {
      if (this.service) {
        this.service.close();
      }
      const resolvedProtoPath = path.join(__dirname, '..', protoPath);
      const packageDefinition = loadSync(resolvedProtoPath);
      const Api = grpc.loadPackageDefinition(packageDefinition)[serviceName];
      //   this.service = new proto.pb[serviceName](`${url}:${port}`, grpc.credentials.createInsecure());
      // @ts-ignore
      this.service = new Api(`${url}:${port}`, grpc.credentials.createInsecure());
      this.url = url;
      this.port = port;
    }
  };
}

export default NetServiceFactory;
