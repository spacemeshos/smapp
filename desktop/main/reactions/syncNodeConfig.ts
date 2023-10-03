import {
  BehaviorSubject,
  catchError,
  delay,
  distinctUntilChanged,
  filter,
  from,
  merge,
  Observable,
  retry,
  Subject,
  switchMap,
  throwError,
  withLatestFrom,
} from 'rxjs';
import { Network, NodeConfig } from '../../../shared/types';
import Warning, { WarningType } from '../../../shared/warning';
import { SmeshingSetupState } from '../../NodeManager';
import { downloadNodeConfig } from '../NodeConfig';
import { makeSubscription } from '../rx.utils';
import Logger from '../../logger';

const logger = Logger({ className: 'syncNodeConfig' });

export default (
  $currentNetwork: Observable<Network | null>,
  $nodeConfig: Subject<NodeConfig>,
  $smeshingSetupState: Subject<SmeshingSetupState>,
  $warnings: Subject<Warning>
) => {
  const $hash = new BehaviorSubject('startup'); // first time

  return makeSubscription(
    merge(
      $currentNetwork.pipe(filter(Boolean), distinctUntilChanged()),
      $smeshingSetupState.pipe(
        filter((value) => value !== SmeshingSetupState.ViaAPI),
        switchMap(() => $currentNetwork),
        filter(Boolean)
      )
    ).pipe(
      withLatestFrom($hash),
      switchMap(([net, hash]) => from(downloadNodeConfig(net.conf, hash))),
      retry(5),
      delay(500),
      catchError((err: any) => {
        $warnings.next(
          err instanceof Warning
            ? err
            : Warning.fromError(err.type || WarningType.Unknown, {}, err)
        );
        return throwError(() => err);
      })
    ),
    (conf) => {
      $nodeConfig.next(conf.mergedConfig as NodeConfig);
      if (conf.discoveryConfigHashChanged) {
        logger.debug('got new config from discovery', {
          prevHash: conf.discoveryConfigPrevHash,
          nextHash: conf.discoveryConfigHash,
        });
        $hash.next(conf.discoveryConfigHash);
      }
    }
  );
};
