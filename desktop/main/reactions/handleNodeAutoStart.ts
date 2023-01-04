import * as $ from 'rxjs';
import { Observable, Subject } from 'rxjs';
import { makeSubscription } from '../rx.utils';
import { isLocalNodeType } from '../../../shared/utils';
import { Wallet } from '../../../shared/types';
import { Managers } from '../app.types';

export default (
  $runNodeBeforeLogin: Subject<boolean>,
  $wallet: Observable<Wallet | null>,
  $managers: Subject<Managers>
) =>
  makeSubscription(
    $.combineLatest($runNodeBeforeLogin, $managers, $wallet),
    ([runNode, managers, wallet]) => {
      if (!runNode) {
        return;
      }

      const type = wallet?.meta?.type;
      if (!type || isLocalNodeType(type)) {
        managers.node.startNode();
      }
    }
  );
