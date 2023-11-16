import { BrowserWindow } from 'electron';
import { combineLatest, map, Observable, startWith, Subject } from 'rxjs';
import { ipcConsts } from '../../../app/vars';
import { Wallet } from '../../../shared/types';
import { isWalletOnlyType } from '../../../shared/utils';
import { Managers } from '../app.types';
import { makeSubscription } from '../rx.utils';
import Logger from '../../logger';

const logger = Logger({ className: 'activateWallet' });

export default (
  $wallet: Observable<Wallet | null>,
  $managers: Observable<Managers>,
  $isWalletActivated: Subject<void>,
  $mainWindow: Observable<BrowserWindow>,
  $nodeRestartRequest: Observable<void>
) =>
  makeSubscription(
    combineLatest([
      $wallet,
      $managers,
      $mainWindow,
      $nodeRestartRequest.pipe(
        map(() => true),
        startWith(false)
      ),
    ]),
    async ([wallet, managers, mw, shallRestart]) => {
      if (
        !wallet ||
        !wallet.meta.genesisID ||
        (isWalletOnlyType(wallet.meta.type) && !wallet.meta.remoteApi)
      ) {
        return;
      }
      if (shallRestart) {
        await managers.node.stopNode();
      }

      const res = await managers.wallet.activate(wallet);
      if (res) {
        managers.wallet.setAccounts(wallet.crypto.accounts);
        managers.node
          .isNodeAlive()
          .then(() => managers.wallet.subscribeAccounts())
          .catch((err) => {
            logger.error('activateWallet', err);
          });
        $isWalletActivated.next();
      }
      // Renderer waits for WALLET_ACTIVATED event
      // to show the next screen, so we send it anyway
      mw.webContents.send(ipcConsts.WALLET_ACTIVATED);
      logger.debug('Send IPC Event WALLET_ACTIVATE IPC');
    }
  );
