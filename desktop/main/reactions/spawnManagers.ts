import { BrowserWindow } from 'electron';
import {
  delay,
  distinctUntilChanged,
  ReplaySubject,
  skip,
  Subject,
  withLatestFrom,
} from 'rxjs';
import { NodeConfig } from '../../../shared/types';
import Logger from '../../logger';
import { Managers } from '../app.types';
import { spawnManagers } from '../Networks';
import { withLatest } from '../rx.utils';

const logger = Logger({ className: 'rx' });

const spawnManagers$ = (
  $nodeConfig: Subject<NodeConfig>,
  $managers: Subject<Managers>,
  $mainWindow: ReplaySubject<BrowserWindow>
) => {
  const $uniqNodeCondig = $nodeConfig.pipe(
    distinctUntilChanged(
      (prev, next) => JSON.stringify(prev) === JSON.stringify(next)
    )
  );
  const subs = [
    // If node config changed, then unsubscribe managers
    $uniqNodeCondig
      .pipe(skip(1), withLatestFrom($managers))
      .subscribe(([_, managers]) => {
        if (managers) {
          managers.wallet?.unsubscribe();
          managers.smesher?.unsubscribe();
          managers.node?.unsubscribe();
        }
      }),
    // And then spawn new managers
    $uniqNodeCondig
      .pipe(delay(1), withLatest($mainWindow))
      .subscribe(([mw, nodeConfig]) => {
        const netId: number = nodeConfig.p2p['network-id'];
        spawnManagers(mw, netId)
          .then((nextManagers) => {
            $managers.next(nextManagers);
            return nextManagers;
          })
          .catch((err) =>
            logger.error(
              'spawnManagers$ > Can not spawn new managers',
              err,
              netId
            )
          );
      }),
  ];
  return () => subs.forEach((unsub) => unsub.unsubscribe());
};

export default spawnManagers$;
