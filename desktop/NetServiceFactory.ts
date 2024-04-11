import path from 'path';
import * as grpc from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { flatten } from 'ramda';

import { PublicService, SocketAddress } from '../shared/types';
import { delay, isNodeApiEq } from '../shared/utils';
import Logger from './logger';
import { getLocalNodeConnectionConfig } from './main/utils';
import NodeStartupStateStore from './main/nodeStartupStateStore';

// Types
type AnyRecord = { [k: string]: any };
type Proto = {
  spacemesh: { v1: AnyRecord; v2alpha1: AnyRecord; [k: string]: any };
  [k: string]: any;
};
export type Service<
  P extends Proto,
  Version extends keyof P['spacemesh'],
  ServiceName extends keyof P['spacemesh'][Version]
> = InstanceType<P['spacemesh'][Version][ServiceName]>;
export type ServiceOpts<
  P extends Proto,
  Version extends keyof P['spacemesh'],
  ServiceName extends keyof P['spacemesh'][Version],
  K extends keyof Service<P, Version, ServiceName>
> = Parameters<Service<P, Version, ServiceName>[K]>[0];
export type ServiceCallback<
  P extends Proto,
  Version extends keyof P['spacemesh'],
  ServiceName extends keyof P['spacemesh'][Version],
  K extends keyof Service<P, Version, ServiceName>
> = Parameters<Service<P, Version, ServiceName>[K]>[1];
export type ServiceCallbackResult<
  P extends Proto,
  Version extends keyof P['spacemesh'],
  ServiceName extends keyof P['spacemesh'][Version],
  K extends keyof Service<P, Version, ServiceName>
> =
  // @ts-ignore
  // TODO: It works fine, but TypeScript finds this errorish
  Parameters<ServiceCallback<P, Version, ServiceName, K>>[1];

export type ServiceStream<
  P extends Proto,
  Version extends keyof P['spacemesh'],
  ServiceName extends keyof P['spacemesh'][Version],
  K extends keyof Service<P, Version, ServiceName>
> = ReturnType<Service<P, Version, ServiceName>[K]>;

export type ServiceStreamResponse<
  P extends Proto,
  Version extends keyof P['spacemesh'],
  ServiceName extends keyof P['spacemesh'][Version],
  K extends keyof Service<P, Version, ServiceName>
> = ServiceStream<P, Version, ServiceName, K> extends grpc.ClientReadableStream<
  infer T
>
  ? T
  : never;

// Abstract Class
class NetServiceFactory<
  T extends Proto,
  Version extends keyof T['spacemesh'],
  ServiceName extends keyof T['spacemesh'][Version]
> {
  protected service: Service<T, Version, ServiceName> | null = null;

  protected serviceName: string | null = null;

  protected logger: ReturnType<typeof Logger> | null = null;

  private isStarted = false;

  private apiUrl: SocketAddress | null = null;

  private cancelStreamList: Record<
    keyof Service<T, Version, ServiceName>,
    Array<() => Promise<void>>
  > = {} as typeof this.cancelStreamList;

  private setIsStarted = (value: boolean) => {
    this.isStarted = value;
  };

  createNetService = (
    protoPath: string,
    apiUrl: SocketAddress | PublicService = getLocalNodeConnectionConfig(),
    version: Version,
    serviceName: string
  ) => {
    this.logger?.log(`createNetService(${serviceName})`, apiUrl);
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

    const STD_PROTOS = path.join(__dirname, '..', 'vendor', 'proto');
    const resolvedProtoPath = path.join(__dirname, '..', protoPath);
    const parentDir = path.dirname(resolvedProtoPath);
    const apiRootDir = path.resolve(parentDir, '../..');
    const packageDefinition = loadSync(resolvedProtoPath, {
      includeDirs: [STD_PROTOS, apiRootDir, parentDir],
    });
    const proto = (grpc.loadPackageDefinition(
      packageDefinition
    ) as unknown) as T;
    const Service = proto.spacemesh[version][serviceName];
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

  ensureService = (
    method: string
  ): Promise<Service<T, Version, ServiceName>> => {
    if (this.service) return Promise.resolve(this.service);

    this.logger?.error(
      'ensureService',
      `Cannot complete call to ${method} because Service is not started yet`
    );
    return Promise.reject(
      new Error(`Service "${this.serviceName}" is not running`)
    );
  };

  callService = <K extends keyof Service<T, Version, ServiceName>>(
    method: K,
    opts: ServiceOpts<T, Version, ServiceName, K>
  ) => {
    type ResultArg = ServiceCallbackResult<T, Version, ServiceName, K>;
    type Result = NonNullable<ResultArg>;
    return this.ensureService(String(method)).then(
      (_service: Service<T, Version, ServiceName>) =>
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

  callServiceWithRetries = <K extends keyof Service<T, Version, ServiceName>>(
    method: K,
    opts: ServiceOpts<T, Version, ServiceName, K>
  ) => {
    type ResultArg = ServiceCallbackResult<T, Version, ServiceName, K>;
    type Result = NonNullable<ResultArg>;

    return this.callService(method, opts).catch(
      async (err): Promise<Result> => {
        if (!NodeStartupStateStore.isReady()) {
          // If Node is not in Ready state — wait longer and then try again
          // And do not reduce the retries amount
          await delay(30000);
          this.logger?.log(
            `callServiceWithRetries(${String(method)}) after err`,
            err
          );
          return this.callServiceWithRetries(method, opts);
        }
        if (err.code === 14) {
          await delay(10000);
          this.logger?.log(
            `callServiceWithRetries(${String(method)}) after err(14)`,
            err
          );
          return this.callServiceWithRetries(method, opts);
        } else {
          this.logger?.error(
            `callServiceWithRetries(${String(method)}) throws`,
            err,
            opts
          );
          throw err;
        }
      }
    );
  };

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

  runStream = <K extends keyof Service<T, Version, ServiceName>>(
    method: K,
    opts: ServiceOpts<T, Version, ServiceName, K>,
    onData: (data: ServiceStreamResponse<T, Version, ServiceName, K>) => void,
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
      ServiceStreamResponse<T, Version, ServiceName, K>
    >;

    const cancel = () =>
      new Promise<void>((resolve) =>
        setImmediate(() => {
          if (stream && stream.cancel) {
            stream.cancel();
            stream.destroy();
            this.logger?.log(
              `grpc ${this.serviceName}.${String(method)}`,
              'cancelled'
            );
          }
          resolve();
        })
      );

    const startStream = async (attempt = 1) => {
      if (!NodeStartupStateStore.isReady()) {
        // If Node is not in Ready state — wait longer and then try again
        // And do not reduce the retries amount
        await delay(30000);
        await startStream(attempt);
        return;
      }

      if (!this.service) {
        this.logger?.error(
          `startStream > Service ${this.serviceName} is not running`,
          opts
        );
        return;
      }
      this.logger?.log(
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
          this.logger?.log(`grpc ${this.serviceName}.${String(method)}`, error);
        }
        onError(error);
      });
      stream.on('end', async () => {
        try {
          await delay(10000);
          if (this.isStarted) {
            // Do not log error messages if it is not fully connected yet
            this.logger?.log(
              `grpc ${this.serviceName}.${String(method)} reconnecting...`,
              null
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
