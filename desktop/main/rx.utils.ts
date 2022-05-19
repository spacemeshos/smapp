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
  tap,
  firstValueFrom,
} from 'rxjs';
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

export const pipeAndResponse = <Input, Response, Output>(
  handler: (input: Input) => Observable<Output>,
  selector: (output: Output) => Response
): OperatorFunction<[Subject<Response>, Input], Output> =>
  pipe(
    switchMap(([response, payload]) =>
      handler(payload).pipe(map((value) => ({ response, value })))
    ),
    tap(({ response, value }) => response.next(selector(value))),
    map(({ value }) => value)
  );

export const handleIPC = <Request, Response, Output>(
  channel: string,
  handler: (input: Request) => Observable<Output>,
  selector: (output: Output) => Response
): Observable<Output> => {
  const ipcResponse = new Subject<Response>();
  const ipcSubject = new Subject<[typeof ipcResponse, Request]>();

  ipcMain.handle(channel, (_, payload: Request) => {
    logger.debug(`handleIPC(${channel}) got request:`, payload);
    ipcSubject.next([ipcResponse, payload] as [Subject<Response>, Request]);
    return firstValueFrom(ipcResponse).then(
      R.tap((response) =>
        logger.debug(`handleIPC(${channel}) replied:`, response)
      )
    );
  });

  return ipcSubject.pipe(
    pipeAndResponse<Request, Response, Output>(handler, selector)
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

export const makeSubscription = <T>(source: Observable<T>, cb: (a: T) => void) => {
  const sub = source.subscribe(cb);
  return sub.unsubscribe;
};
