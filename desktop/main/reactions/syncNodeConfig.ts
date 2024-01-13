import {
  BehaviorSubject,
  catchError,
  distinctUntilChanged,
  filter,
  from,
  merge,
  Observable,
  Subject,
  switchMap,
  throwError,
  withLatestFrom,
} from 'rxjs';
import { NetworkExtended, NodeConfig } from '../../../shared/types';
import Warning, { WarningType } from '../../../shared/warning';
import { SmeshingSetupState } from '../../NodeManager';
import { makeSubscription } from '../rx.utils';
import Logger from '../../logger';
import { mergeConfigs } from '../NodeConfig';

const logger = Logger({ className: 'syncNodeConfig' });

export default (
  $currentNetwork: Observable<NetworkExtended | null>,
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
      switchMap(([net, prevHash]) =>
        from(mergeConfigs(net.genesisID, prevHash, net.config))
      ),
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
      if (conf.hashChanged) {
        logger.debug('got new config from discovery', {
          prevHash: conf.prevHash,
          nextHash: conf.nextHash,
        });
        $hash.next(conf.nextHash);
      }
    }
  );
};
