import { BrowserWindow } from 'electron';
import { combineLatest, Observable, Subject } from 'rxjs';
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
  $mainWindow: Observable<BrowserWindow>,
  $isWalletActivated: Subject<void>
) =>
  makeSubscription(
    combineLatest([$wallet, $managers, $mainWindow]),
    async ([wallet, managers, mw]) => {
      try {
        if (
          !wallet ||
          !wallet.meta.genesisID ||
          (isWalletOnlyType(wallet.meta.type) && !wallet.meta.remoteApi)
        ) {
          return;
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
      } catch (err) {
        logger.error('Cannot activate wallet', err);
        mw.webContents.send(ipcConsts.WALLET_ACTIVATED);
      }
    }
  );
