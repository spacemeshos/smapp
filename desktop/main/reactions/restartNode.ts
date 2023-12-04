import { BehaviorSubject, Observable, Subject, withLatestFrom } from 'rxjs';
import { Wallet } from '../../../shared/types';
import { makeSubscription } from '../rx.utils';
import Logger from '../../logger';
import { Managers } from '../app.types';

const logger = Logger({ className: 'reaction/restartNode' });

export default (
  $nodeRestartRequest: Subject<void>,
  $managers: Observable<Managers>,
  $wallet: BehaviorSubject<Wallet | null>
) =>
  makeSubscription(
    $nodeRestartRequest.pipe(withLatestFrom($wallet, $managers)),
    async ([_, wallet, managers]) => {
      logger.log('Restart the node', null);
      try {
        await managers.node.stopNode();
        logger.debug('Node stopped');
        if (wallet) {
          // Re-emit wallet to trigger wallet activation
          $wallet.next(wallet);
          logger.debug('Wallet re-emitted', wallet?.meta);
        } else {
          logger.debug('No wallet to re-emit');
        }
      } catch (err) {
        logger.error('Cannot restart the Node', err);
      }
    }
  );
