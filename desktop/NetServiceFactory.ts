import path from 'path';
import * as grpc from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { PublicService, SocketAddress } from '../shared/types';
import { LOCAL_NODE_API_URL } from '../shared/constants';
import { debounceShared, delay, isNodeApiEq } from '../shared/utils';
import Logger from './logger';
import { MINUTE } from './main/constants';

// Types
type Proto = { spacemesh: { v1: any; [k: string]: any }; [k: string]: any };
export type Service<
  P extends Proto,
  ServiceName extends keyof P['spacemesh']['v1']
> = InstanceType<P['spacemesh']['v1'][ServiceName]>;
export type ServiceOpts<
  P extends Proto,
  ServiceName extends keyof P['spacemesh']['v1'],
  K extends keyof Service<P, ServiceName>
> = Parameters<Service<P, ServiceName>[K]>[0];
export type ServiceCallback<
  P extends Proto,
  ServiceName extends keyof P['spacemesh']['v1'],
  K extends keyof Service<P, ServiceName>
> = Parameters<Service<P, ServiceName>[K]>[1];
export type ServiceCallbackResult<
  P extends Proto,
  ServiceName extends keyof P['spacemesh']['v1'],
  K extends keyof Service<P, ServiceName>
> =
  // @ts-ignore
  // TODO: It works fine, but TypeScript finds this errorish
  Parameters<ServiceCallback<P, ServiceName, K>>[1];

export type ServiceStream<
  P extends Proto,
  ServiceName extends keyof P['spacemesh']['v1'],
  K extends keyof Service<P, ServiceName>
> = ReturnType<Service<P, ServiceName>[K]>;

export type ServiceStreamResponse<
  P extends Proto,
  ServiceName extends keyof P['spacemesh']['v1'],
  K extends keyof Service<P, ServiceName>
> = ServiceStream<P, ServiceName, K> extends grpc.ClientReadableStream<infer T>
  ? T
  : never;

const MAX_RETRIES = 5; // In a row

// Abstract Class

class NetServiceFactory<
  T extends { spacemesh: { v1: any; [k: string]: any }; [k: string]: any },
  ServiceName extends keyof T['spacemesh']['v1']
> {
  protected service: Service<T, ServiceName> | null = null;

  protected serviceName: string | null = null;

  protected logger: ReturnType<typeof Logger> | null = null;

  private protoPath: string | null = null;

  private apiUrl: SocketAddress | null = null;

  private startStreamList: Record<
    keyof Service<T, ServiceName>,
    () => Promise<void>
  > = {} as typeof this.startStreamList;

  private cancelStreamList: Record<
    keyof Service<T, ServiceName>,
    () => Promise<void>
  > = {} as typeof this.cancelStreamList;

  createNetService = (
    protoPath: string,
    apiUrl: SocketAddress | PublicService = LOCAL_NODE_API_URL,
    serviceName: string
  ) => {
    this.logger?.debug(`createNetService(${serviceName})`, apiUrl);
    if (this.service && this.apiUrl && isNodeApiEq(this.apiUrl, apiUrl)) {
      this.logger?.debug(
        `createNetService(${serviceName}) cancelled: no change in apiUrl. Keep old one`
      );
      return;
    }

    this.logger?.debug(`createNetService(${serviceName})`, apiUrl);
    if (this.service) {
      this.cancelStreams();
      this.dropNetService();
    }

    this.protoPath = protoPath;
    this.apiUrl = apiUrl;

    const resolvedProtoPath = path.join(__dirname, '..', protoPath);
    const packageDefinition = loadSync(resolvedProtoPath);
    const proto = (grpc.loadPackageDefinition(
      packageDefinition
    ) as unknown) as T;
    const Service = proto.spacemesh.v1[serviceName];
    const connectionType =
      this.apiUrl.protocol === 'http:'
        ? grpc.credentials.createInsecure()
        : grpc.credentials.createSsl();
    this.service = new Service(
      `${this.apiUrl.host}:${this.apiUrl.port}`,
      connectionType
    );
    this.serviceName = serviceName;
    this.logger?.debug(
      `${serviceName} started`,
      `${this.apiUrl.host}:${this.apiUrl.port}`
    );
  };

  dropNetService = () => {
    this.service && this.service.close();
    this.service = null;
  };

  restartNetService = debounceShared(5000, async () => {
    if (!this.protoPath || !this.apiUrl || !this.serviceName) return false;
    this.logger?.debug(
      `Restarting ${this.serviceName}`,
      this.protoPath,
      this.apiUrl
    );
    await this.createNetService(this.protoPath, this.apiUrl, this.serviceName);
    return true;
  });

  ensureService = (): Promise<Service<T, ServiceName>> =>
    this.service
      ? Promise.resolve(this.service)
      : Promise.reject(
          new Error(`Service "${this.serviceName}" is not running`)
        );

  callService = <K extends keyof Service<T, ServiceName>>(
    method: K,
    opts: ServiceOpts<T, ServiceName, K>
  ) => {
    this.logger?.debug(`${this.serviceName}.${String(method)} called`, opts);
    type ResultArg = ServiceCallbackResult<T, ServiceName, K>;
    type Result = NonNullable<ResultArg>;
    return this.ensureService().then(
      (_service: Service<T, ServiceName>) =>
        new Promise<Result>((resolve, reject) => {
          _service[method](
            opts,
            (error: grpc.ServiceError, result: ResultArg) => {
              if (error || !result) {
                const err =
                  error ||
                  new Error(
                    `No result or error received: ${this.serviceName}.${String(
                      method
                    )}`
                  );
                this.logger?.error(
                  `grpc call ${this.serviceName}.${String(method)}`,
                  err
                );
                reject(err);
              } else if (result) {
                resolve(result);
              }
            }
          );
        })
    );
  };

  callServiceWithRetries = <K extends keyof Service<T, ServiceName>>(
    method: K,
    opts: ServiceOpts<T, ServiceName, K>,
    retriesLeft = 300
  ) =>
    this.callService(method, opts).catch(async (err) => {
      if (err.code === 14 && retriesLeft > 0) {
        await delay(1000);
        return this.callServiceWithRetries(method, opts, retriesLeft - 1);
      } else {
        throw err;
      }
    });

  // TODO: Get rid of mixing with `error`
  normalizeServiceResponse = <ResponseData extends Record<string, any>>(
    data: ResponseData
  ): ResponseData & { error: null } => ({
    ...data,
    error: null,
  });

  // TODO: Get rid of mixing with `error`
  normalizeServiceError = <D extends Record<string, any>>(defaults: D) => (
    error: Error
  ) => ({
    ...defaults,
    error,
  });

  runStream = <K extends keyof Service<T, ServiceName>>(
    method: K,
    opts: ServiceOpts<T, ServiceName, K>,
    onData: (data: ServiceStreamResponse<T, ServiceName, K>) => void,
    onError: (error: grpc.ServiceError) => void = () => {}
  ) => {
    if (!this.service) {
      this.logger?.debug(
        `${this.serviceName}.${String(method)} > Service ${
          this.serviceName
        } is not running`,
        opts
      );
      return () => {};
    }
    this.logger?.debug(
      `running stream ${this.serviceName}.${String(method)} with`,
      opts
    );

    let retries = MAX_RETRIES;
    let stream: grpc.ClientReadableStream<
      ServiceStreamResponse<T, ServiceName, K>
    >;

    const cancel = () =>
      new Promise<void>((resolve) =>
        setImmediate(() => {
          if (stream && stream.cancel) {
            stream.cancel();
            stream.destroy();
          }
          resolve();
        })
      );

    const startStream = async (afterRestart) => {
      if (!this.service) {
        this.logger?.error(
          `startStream > Service ${this.serviceName} is not running`,
          opts
        );
        return;
      }
      this.logger?.debug(
        `${this.serviceName}.${String(method)} started. Attempt #${
          MAX_RETRIES - retries
        }`
      );

      await cancel();

      stream = this.service[method](opts);
      stream.on('data', (data) => {
        retries = MAX_RETRIES;
        onData(data);
      });
      stream.on('error', async (error: grpc.ServiceError) => {
        if (error.code === 1) return; // Cancelled on client
        this.logger?.debug(
          `grpc ${this.serviceName}.${String(method)}`,
          error,
          `Retries left: ${retries}`
        );
        onError(error);
      });
      stream.on('end', async () => {
        if (retries > 0) {
          await delay(5000);
          this.logger?.debug(
            `grpc ${this.serviceName}.${String(method)} restarting...`,
            null
          );
          retries -= 1;
          await startStream(afterRestart);
        } else if (afterRestart) {
          this.logger?.error(
            `grpc ${this.serviceName}.${String(
              method
            )} can not restart after restarting NetService. Will retry in a minute`,
            {}
          );
          await delay(MINUTE);
          retries = MAX_RETRIES;
          await startStream(false);
        } else {
          this.logger?.error(
            `grpc ${this.serviceName}.${String(
              method
            )} failed to connect. Restarting NetService...`,
            {}
          );
          await this.restartNetService();
          await startStream(true);
        }
      });
    };
    startStream(false);

    this.cancelStreamList[method] = () => cancel();
    this.startStreamList[method] = () => startStream(true);

    return cancel;
  };

  private callStreamList = (
    list: typeof this.startStreamList | typeof this.cancelStreamList
  ) => Promise.all(Object.values(list).map((fn) => fn.call(this)));

  restartStreams = () => this.callStreamList(this.startStreamList);

  cancelStreams = () => this.callStreamList(this.cancelStreamList);
}

export default NetServiceFactory;
