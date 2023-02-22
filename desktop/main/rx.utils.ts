import { app, ipcMain } from 'electron';
import * as R from 'ramda';
import {
  Subject,
  pipe,
  startWith,
  pairwise,
  map,
  OperatorFunction,
  switchMap,
  Observable,
  combineLatest,
  fromEvent,
  firstValueFrom,
  filter,
  Subscription,
  ReplaySubject,
} from 'rxjs';
import { createIpcResponse, IpcResponse } from '../../shared/ipcMessages';
import Logger from '../logger';

const logger = Logger({ className: 'rxUtils' });

export const fromIPC = <T>(channel: string) => {
  const ipcSubject = new Subject<T>();
  ipcMain.on(channel, (_, payload: T) => {
    logger.debug(`fromIPC(${channel}) got message:`, payload);
    ipcSubject.next(payload);
  });
  return ipcSubject;
};

export type HandlerOk<A> = [null, A];
export type HandlerError = [Error, null];
export type HandlerResult<A> = HandlerError | HandlerOk<A>;
export const handlerError = (error: Error): HandlerError => [error, null];
export const handlerResult = <A>(result: A): HandlerOk<A> => [null, result];
export const hasResult = <A>(hr: HandlerResult<A>): hr is HandlerOk<A> =>
  !hr[0] && Boolean(hr[1]);
export const hasError = <A>(hr: HandlerResult<A>): hr is HandlerError =>
  Boolean(hr[0]) && !hr[1];
export const mapResult = <A, B>(
  fn: (a: A) => B,
  hr: HandlerResult<A>
): HandlerResult<B> => (hasResult(hr) ? handlerResult(fn(hr[1])) : hr);

export const explodeResult = <A>(hr: HandlerResult<A>): A => {
  if (!hasResult(hr)) {
    throw new Error('Trying to explode Errorish Handler Result: ', hr[0]);
  }
  return hr[1];
};

export const wrapResult = <A>(promise: Promise<A>): Promise<HandlerResult<A>> =>
  promise.then((x) => handlerResult(x)).catch((err) => handlerError(err));

export const handleIPC = <Request, Response, Output>(
  channel: string,
  handler: (input: Request) => Observable<HandlerResult<Output>>,
  selector: (output: Output) => Response
): Observable<Output> => {
  const ipcResponse = new Subject<IpcResponse<Response>>();
  const ipcSubject = new Subject<Request>();

  ipcMain.handle(channel, (_, payload: Request) => {
    logger.debug(`handleIPC(${channel}) got request:`, payload);
    ipcSubject.next(payload);
    return firstValueFrom(ipcResponse).then(
      R.tap((response) =>
        logger.debug(`handleIPC(${channel}) replied:`, response)
      )
    );
  });

  return ipcSubject.pipe(
    switchMap((payload) => handler(payload)),
    map((output) => {
      if (hasResult(output)) {
        ipcResponse.next(createIpcResponse(null, selector(output[1])));
        return output[1];
      }
      if (hasError(output)) {
        ipcResponse.next(createIpcResponse<Response>(output[0], null));
        return null;
      }
      return null;
    }),
    filter(Boolean)
  );
};

export const withPreviousItem = <T>(): OperatorFunction<
  T,
  { previous?: T; current: T }
> =>
  pipe(
    startWith(undefined),
    pairwise(),
    map(([previous, current]) => ({ previous, current: current as T }))
  );

export const withLatest = <T, N>(
  o: Observable<N>
): OperatorFunction<T, [N, T]> =>
  pipe(
    switchMap((t) => combineLatest([o]).pipe(map(([n]) => [n, t] as [N, T])))
  );

export const fromAppEvent = (channel: string) =>
  fromEvent(app, channel, (event: Electron.Event) => event);

export const makeSubscription = <T>(
  source: Observable<T>,
  cb: (a: T) => void
) => {
  const sub = source.subscribe({
    next: cb,
    error: (err) => {
      logger.error('makeSubscription', err, { source, cb });
    },
  });
  return sub.unsubscribe;
};

export class ResettableSubject<T> extends Subject<T> {
  private modifierSubj = new Subject<T>();

  private subscription: Subscription;

  private factoryResultSubj: Subject<T>;

  private factoryFn: () => Subject<T>;

  private value$: Observable<T>;

  private defaultValue: T;

  constructor(
    defaultValue: T,
    factoryFn: () => Subject<T> = () => new ReplaySubject<T>(1)
  ) {
    super();

    this.defaultValue = defaultValue;
    this.factoryFn = factoryFn;
    this.factoryResultSubj = this.factoryFn();
    this.subscription = this.modifierSubj.subscribe(this.factoryResultSubj);
    this.value$ = this.pipe(
      startWith(defaultValue),
      switchMap(() => this.factoryResultSubj)
    );
  }

  asObservable(): Observable<T> {
    return this.value$;
  }

  reset(): void {
    this.subscription.unsubscribe();
    this.next(this.defaultValue);
    this.factoryResultSubj = this.factoryFn();
    this.subscription = this.modifierSubj.subscribe(this.factoryResultSubj);
  }

  next(value: T): void {
    this.modifierSubj.next(value);
  }
}
