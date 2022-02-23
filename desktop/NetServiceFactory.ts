import path from 'path';
import * as grpc from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { PublicService, SocketAddress } from '../shared/types';
import { LOCAL_NODE_API_URL } from '../shared/constants';
import Logger from './logger';

// Types
type Proto = { spacemesh: { v1: any; [k: string]: any }; [k: string]: any };
export type Service<P extends Proto, ServiceName extends keyof P['spacemesh']['v1']> = InstanceType<P['spacemesh']['v1'][ServiceName]>;
export type ServiceOpts<P extends Proto, ServiceName extends keyof P['spacemesh']['v1'], K extends keyof Service<P, ServiceName>> = Parameters<Service<P, ServiceName>[K]>[0];
export type ServiceCallback<P extends Proto, ServiceName extends keyof P['spacemesh']['v1'], K extends keyof Service<P, ServiceName>> = Parameters<Service<P, ServiceName>[K]>[1];
export type ServiceCallbackResult<P extends Proto, ServiceName extends keyof P['spacemesh']['v1'], K extends keyof Service<P, ServiceName>> =
  // @ts-ignore
  // TODO: It works fine, but TypeScript finds this errorish
  Parameters<ServiceCallback<P, ServiceName, K>>[1];

const ERROR_CODE_TO_RESTART_STREAM = [
  2, // UNKNOWN
  13, // INTERNAL, including nginx TIMEOUT
  14, // UNAVAILABLE
  15, // DATA_LOSS
];

// Abstract Class

class NetServiceFactory<T extends { spacemesh: { v1: any; [k: string]: any }; [k: string]: any }, ServiceName extends keyof T['spacemesh']['v1']> {
  protected service: Service<T, ServiceName> | null = null;

  protected serviceName: string | null = null;

  protected logger: ReturnType<typeof Logger> | null = null;

  private apiUrl: SocketAddress | null = null;

  private restartStreamList: Record<keyof Service<T, ServiceName>, () => void> = <typeof this.restartStreamList>{};

  createNetService = (protoPath: string, apiUrl: SocketAddress | PublicService = LOCAL_NODE_API_URL, serviceName: string) => {
    if (this.apiUrl === apiUrl) return;

    if (this.service) {
      this.service.close();
    }
    this.apiUrl = apiUrl;

    const resolvedProtoPath = path.join(__dirname, '..', protoPath);
    const packageDefinition = loadSync(resolvedProtoPath);
    const proto = (grpc.loadPackageDefinition(packageDefinition) as unknown) as T;
    const Service = proto.spacemesh.v1[serviceName];
    const connectionType = this.apiUrl.protocol === 'http:' ? grpc.credentials.createInsecure() : grpc.credentials.createSsl();
    this.service = new Service(`${this.apiUrl.host}:${this.apiUrl.port}`, connectionType);
    this.serviceName = serviceName;
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
              const err = error || new Error(`No result or error received: ${this.serviceName}.${method}`);
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
    error: null,
  });

  // TODO: Get rid of mixing with `error`
  normalizeServiceError = <D extends Record<string, any>>(defaults: D) => (error: Error) => ({
    ...defaults,
    error,
  });

  runStream = <K extends keyof Service<T, ServiceName>>(method: K, opts: ServiceOpts<T, ServiceName, K>, onData: (data: ServiceCallbackResult<T, ServiceName, K>) => void) => {
    if (!this.service) {
      throw new Error(`${this.serviceName} is not running`);
    }

    let stream: ReturnType<typeof this.service[typeof method]>;
    let timeout: NodeJS.Timeout;

    const startStream = () => {
      if (!this.service) {
        throw new Error(`${this.serviceName} is not running`);
      }
      stream = this.service[method](opts);
      stream.on('data', onData);
      stream.on('error', (error: Error & { code: number }) => {
        if (error.code === 1) return; // Cancelled on client
        console.log(`${this.serviceName}.${method}: ${error}`); // eslint-disable-line no-console
        this.logger?.error(`grpc ${this.serviceName}.${method}`, error);
        if (ERROR_CODE_TO_RESTART_STREAM.includes(error.code)) {
          stream.cancel();
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            console.log(`${this.serviceName}.${method} restarting...`); // eslint-disable-line no-console
            this.logger?.error(`grpc ${this.serviceName}.${method} restarting...`, null);
            startStream();
          }, 5000);
        }
      });
    };
    startStream();
    const cancel = () =>
      new Promise<void>((resolve) =>
        setImmediate(() => {
          stream && stream.cancel && stream.cancel();
          resolve();
        })
      );

    this.restartStreamList[method] = async () => {
      await cancel();
      startStream();
    };

    return cancel;
  };

  restartStreams = () => Object.values(this.restartStreamList).forEach((fn) => fn.call(this));
}

export default NetServiceFactory;
