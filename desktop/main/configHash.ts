import { hash } from '@spacemesh/sm-codec';
import {
  BehaviorSubject,
  Observable,
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs';
import { NetworkExtended } from '../../shared/types';
import { toHexString } from '../../shared/utils';

const INITIAL_CONFIG_HASH = 'startup';

const currentConfigHash$ = new BehaviorSubject<[string, string]>([
  '*',
  INITIAL_CONFIG_HASH,
]);

//

export type ConfigHash = typeof currentConfigHash$;
export const getConfigHashByURL = (url: string) => {
  const state = currentConfigHash$.getValue();
  return state[0] === url ? state[1] : INITIAL_CONFIG_HASH;
};

//

export const updateConfigHash = (
  $currentNetwork: Observable<NetworkExtended | null>
) => {
  const hash$ = $currentNetwork.pipe(
    filter(Boolean),
    distinctUntilChanged(),
    map((net) => [net.conf, toHexString(hash(JSON.stringify(net.config)))])
  );
  const sub = hash$.subscribe(([url, nextHash]) => {
    currentConfigHash$.next([url, nextHash]);
  });
  return () => sub.unsubscribe();
};
