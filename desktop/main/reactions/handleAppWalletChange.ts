import * as $ from 'rxjs';
import { Observable, Subject } from 'rxjs';
import { makeSubscription } from '../rx.utils';
import { isLocalNodeType } from '../../../shared/utils';
import { Wallet } from '../../../shared/types';
import { Managers } from '../app.types';

export default (
  $isWalletActivated: Subject<void>,
  $wallet: Observable<Wallet | null>,
  $managers: Subject<Managers>
) =>
  makeSubscription(
    $isWalletActivated.pipe($.withLatestFrom($managers, $wallet)),
    ([_, managers, wallet]) => {
      const type = wallet?.meta?.type;

      if (!type || !isLocalNodeType(type)) {
        return;
      }

      (async () => {
        await managers.node.startNode();
        await managers.node.updateNodeStatus();
        await managers.smesher.serviceStartupFlow();
        await managers.smesher.updateSmesherState();
      })();
    }
  );
