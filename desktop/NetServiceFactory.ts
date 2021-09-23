import path from 'path';
import * as grpc from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { NodeError, NodeErrorLevel } from '../shared/types';
import Logger from './logger';

const DEFAULT_URL = 'localhost';
const DEFAULT_PORT = '9092';

// Types
type Proto = { spacemesh: { v1: any; [k: string]: any }; [k: string]: any };
export type Service<P extends Proto, ServiceName extends keyof P['spacemesh']['v1']> = InstanceType<P['spacemesh']['v1'][ServiceName]>;
export type ServiceOpts<P extends Proto, ServiceName extends keyof P['spacemesh']['v1'], K extends keyof Service<P, ServiceName>> = Parameters<Service<P, ServiceName>[K]>[0];
export type ServiceCallback<P extends Proto, ServiceName extends keyof P['spacemesh']['v1'], K extends keyof Service<P, ServiceName>> = Parameters<Service<P, ServiceName>[K]>[1];
export type ServiceCallbackResult<P extends Proto, ServiceName extends keyof P['spacemesh']['v1'], K extends keyof Service<P, ServiceName>> =
  // @ts-ignore
  // TODO: It works fine, but TypeScript finds this errorish
  Parameters<ServiceCallback<P, ServiceName, K>>[1];

// Abstract Class

class NetServiceFactory<T extends { spacemesh: { v1: any; [k: string]: any }; [k: string]: any }, ServiceName extends keyof T['spacemesh']['v1']> {
  protected service: Service<T, ServiceName> | null = null;

  protected serviceName: string | null = null;

  protected logger: ReturnType<typeof Logger> | null = null;

  private url: string | null = null;

  private port: string | null = null;

  createNetService = (protoPath: string, url = '', port = '', serviceName: string) => {
    if (this.url !== url || this.port !== port) {
      if (this.service) {
        this.service.close();
      }
      const resolvedUrl = url || DEFAULT_URL;
      const resolvedPort = port || DEFAULT_PORT;
      const resolvedProtoPath = path.join(__dirname, '..', protoPath);
      const packageDefinition = loadSync(resolvedProtoPath);
      const proto = (grpc.loadPackageDefinition(packageDefinition) as unknown) as T;
      const Service = proto.spacemesh.v1[serviceName];
      const cred = url === '' ? grpc.credentials.createInsecure() : grpc.credentials.createSsl();
      this.service = new Service(`${resolvedUrl}:${resolvedPort}`, cred);
      this.serviceName = serviceName;
      this.url = resolvedUrl;
      this.port = resolvedPort;
    }
  };

  ensureService = (): Promise<Service<T, ServiceName>> =>
    this.service ? Promise.resolve(this.service) : Promise.reject(new Error(`Service "${this.serviceName}" is not running`));

  callService = <K extends keyof Service<T, ServiceName>>(method: K, opts: ServiceOpts<T, ServiceName, K>) => {
    type ResultArg = ServiceCallbackResult<T, ServiceName, K>;
    type Result = NonNullable<ResultArg>;
    return this.ensureService().then(
      (_service) =>
        new Promise<Result>((resolve, reject) => {
          _service[method](opts, (error: grpc.ServiceError, result: ResultArg) => {
            if (error || !result) {
              const err = error || new Error(`No result or error received: ${this.serviceName}.${fn.name}`);
              this.logger?.error(`grpc call ${this.serviceName}.${method}`, err);
              reject(err);
            } else if (result) {
              resolve(result as Result); // TODO ?
            }
          });
        })
    );
  };

  // TODO: Get rid of mixing with `error`
  normalizeServiceResponse = <ResponseData extends Record<string, any>>(data: ResponseData): ResponseData & { error: null } => ({
    ...data,
    error: null
  });

  // TODO: Get rid of mixing with `error`
  normalizeServiceError = <D extends Record<string, any>>(defaults: D) => (error) => ({
    ...defaults,
    error: error.msg
      ? error
      : ({
          msg: error.message,
          stackTrace: error?.stack || '',
          module: this.serviceName,
          level: NodeErrorLevel.LOG_LEVEL_ERROR
        } as NodeError)
  });
}

export default NetServiceFactory;
