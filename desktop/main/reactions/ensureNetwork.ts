import { BrowserWindow } from 'electron';
import {
  combineLatest,
  distinctUntilChanged,
  filter,
  Observable,
  throttleTime,
} from 'rxjs';
import { equals } from 'ramda';
import { ipcConsts } from '../../../app/vars';
import { Network, Wallet } from '../../../shared/types';
import { isWalletOnlyType } from '../../../shared/utils';
import Logger from '../../logger';
import { hasNetwork } from '../Networks';
import { makeSubscription } from '../rx.utils';
import { isApiMissing, isGenesisIDMissing } from '../../walletValidation';

const logger = Logger({ className: 'ensureNetwork' });

export default (
  $wallet: Observable<Wallet | null>,
  $networks: Observable<Network[]>,
  $mainWindow: Observable<BrowserWindow>
) =>
  makeSubscription(
    combineLatest([$wallet, $networks, $mainWindow]).pipe(
      filter((a): a is [Wallet, Network[], BrowserWindow] => {
        const [wallet, nets] = a;
        return (
          // When wallet is opened
          !!wallet &&
          // And discovery service contains at least one network
          nets.length > 0
        );
      }),
      distinctUntilChanged(
        (prev, next) => prev[0] === next[0] && equals(prev[1], next[1])
      ),
      throttleTime(1000)
    ),
    ([wallet, nets, mw]) => {
      const isWalletOnly = isWalletOnlyType(wallet.meta.type);

      if (
        isGenesisIDMissing(wallet) ||
        !hasNetwork(wallet.meta.genesisID, nets)
      ) {
        logger.debug('REQUEST_SWITCH_NETWORK', wallet.meta);
        mw.webContents.send(ipcConsts.REQUEST_SWITCH_NETWORK, {
          isWalletOnly,
        });
      } else if (isWalletOnly && isApiMissing(wallet)) {
        logger.debug('REQUEST_SWITCH_API', wallet.meta);
        mw.webContents.send(ipcConsts.REQUEST_SWITCH_API, {
          isWalletOnly,
        });
      }
    }
  );
