import { combineLatest, Observable, Subject } from 'rxjs';
import { Wallet } from '../../../shared/types';
import { isRemoteNodeApi, toSocketAddress } from '../../../shared/utils';
import { Managers } from '../app.types';
import { makeSubscription } from '../rx.utils';

export default ($wallet: Subject<Wallet>, $managers: Observable<Managers>) =>
  makeSubscription(
    combineLatest([$wallet, $managers] as const),
    ([wallet, managers]) => {
      if (wallet.meta.remoteApi.length > 0) {
        const apiUrl = toSocketAddress(wallet.meta.remoteApi);
        apiUrl && isRemoteNodeApi(apiUrl) && managers.node.stopNode();
      }
    }
  );
