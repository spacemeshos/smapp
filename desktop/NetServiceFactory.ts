import path from 'path';
import * as grpc from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { flatten } from 'ramda';

import { PublicService, SocketAddress } from '../shared/types';
import { delay, isNodeApiEq } from '../shared/utils';
import Logger from './logger';
import { getLocalNodeConnectionConfig } from './main/utils';

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

// Abstract Class

class NetServiceFactory<
  T extends { spacemesh: { v1: any; [k: string]: any }; [k: string]: any },
  ServiceName extends keyof T['spacemesh']['v1']
> {
  protected service: Service<T, ServiceName> | null = null;

  protected serviceName: string | null = null;

  protected logger: ReturnType<typeof Logger> | null = null;

  private isStarted = false;

  private apiUrl: SocketAddress | null = null;

  private cancelStreamList: Record<
    keyof Service<T, ServiceName>,
    Array<() => Promise<void>>
  > = {} as typeof this.cancelStreamList;

  private setIsStarted = (value: boolean) => {
    this.isStarted = value;
  };

  createNetService = (
    protoPath: string,
    apiUrl: SocketAddress | PublicService = getLocalNodeConnectionConfig(),
    serviceName: string
  ) => {
    this.logger?.debug(`createNetService(${serviceName})`, apiUrl);
    if (this.service && this.apiUrl && isNodeApiEq(this.apiUrl, apiUrl)) {
      this.logger?.debug(
        `createNetService(${serviceName}) cancelled: no change in apiUrl. Keep old one`
      );
      return;
    }

    if (this.service) {
      this.cancelStreams();
      this.dropNetService();
    }

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
    this.logger?.debug('dropNetService() called', null);
    this.setIsStarted(false);
  };

  ensureService = (method: string): Promise<Service<T, ServiceName>> => {
    if (this.service) return Promise.resolve(this.service);

    this.logger?.error(
      'ensureService',
      `Cannot complete call to ${method} because Service is not started yet`
    );
    return Promise.reject(
      new Error(`Service "${this.serviceName}" is not running`)
    );
  };

  callService = <K extends keyof Service<T, ServiceName>>(
    method: K,
    opts: ServiceOpts<T, ServiceName, K>
  ) => {
    type ResultArg = ServiceCallbackResult<T, ServiceName, K>;
    type Result = NonNullable<ResultArg>;
    return this.ensureService(String(method)).then(
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
                if (this.isStarted) {
                  // Skip logging failures when GRPC Service is not fully connected yet
                  this.logger?.error(
                    `grpc call ${this.serviceName}.${String(method)}`,
                    err
                  );
                }
                reject(err);
              } else if (result) {
                this.logger?.debug(
                  `${this.serviceName}.${String(
                    method
                  )} called successfully with args`,
                  opts
                );
                this.setIsStarted(true);
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
        await delay(5000);
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

    let stream: grpc.ClientReadableStream<
      ServiceStreamResponse<T, ServiceName, K>
    >;

    const cancel = () =>
      new Promise<void>((resolve) =>
        setImmediate(() => {
          this.logger?.debug(
            `grpc ${this.serviceName}.${String(method)}`,
            'cancel() called'
          );
          if (stream && stream.cancel) {
            stream.cancel();
            stream.destroy();
            this.logger?.debug(
              `grpc ${this.serviceName}.${String(method)}`,
              'cancelled'
            );
          }
          resolve();
        })
      );

    const startStream = async (attempt = 1) => {
      if (!this.service) {
        this.logger?.error(
          `startStream > Service ${this.serviceName} is not running`,
          opts
        );
        return;
      }
      this.logger?.debug(
        `${this.serviceName}.${String(method)} connecting`,
        `Attempt #${attempt}`
      );

      stream = this.service[method](opts);
      stream.on('data', (data) => {
        onData(data);
        // drop the retries counter every time we get data
        this.setIsStarted(true);
      });
      stream.on('error', async (error: grpc.ServiceError) => {
        if (error.code === 1) return; // Cancelled on client
        if (this.isStarted) {
          // Do not log error messages if it is not fully connected yet
          this.logger?.debug(
            `grpc ${this.serviceName}.${String(method)}`,
            error
          );
        }
        onError(error);
      });
      stream.on('end', async () => {
        try {
          await delay(10000);
          if (this.isStarted) {
            // Do not log error messages if it is not fully connected yet
            this.logger?.debug(
              `grpc ${this.serviceName}.${String(method)} reconnecting...`,
              opts
            );
          }
          await cancel();
          await startStream(attempt + 1);
        } catch (err) {
          this.logger?.error(
            `grpc ${this.serviceName}.${String(method)} reconnection failure`,
            err,
            opts
          );
        }
      });
    };
    startStream();

    this.cancelStreamList[method] = [
      ...(this.cancelStreamList[method] ?? []),
      () => cancel(),
    ];

    return cancel;
  };

  cancelStreams = () =>
    Promise.all(
      flatten(Object.values(this.cancelStreamList)).map((fn) => fn.call(this))
    );
}

export default NetServiceFactory;
