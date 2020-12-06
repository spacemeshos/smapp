import path from 'path';

const protoLoader = require('@grpc/proto-loader');

const grpc = require('grpc');

class NetServiceFactory {
  service: NetServiceFactory | null = null;

  constructor(protoPath: string, url: string, serviceName: string) {
    if (!this.service) {
      const resolvedProtoPath = path.join(__dirname, '..', protoPath);
      const packageDefinition = protoLoader.loadSync(resolvedProtoPath);
      const proto = grpc.loadPackageDefinition(packageDefinition);
      this.service = new proto.pb[serviceName](url, grpc.credentials.createInsecure());
    }
  }
}

export default NetServiceFactory;
