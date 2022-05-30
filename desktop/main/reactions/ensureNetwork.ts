import { BrowserWindow } from 'electron';
import { combineLatest, filter, Observable, throttleTime } from 'rxjs';
import { ipcConsts } from '../../../app/vars';
import { Network, Wallet } from '../../../shared/types';
import { isWalletOnlyType } from '../../../shared/utils';
import Logger from '../../logger';
import { makeSubscription } from '../rx.utils';

const logger = Logger({ className: 'ensureNetwork' });

const getNetworkById = (
  netId: number,
  networks: Network[]
): Network | undefined => networks.find((net) => net.netID === netId);

const hasNetwork = (netId: number, networks: Network[]): boolean =>
  !!getNetworkById(netId, networks);

const isNetIdMissing = (wallet: Wallet) => !wallet.meta.netId;
const isApiMissing = (wallet: Wallet) => !wallet.meta.remoteApi;

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
      throttleTime(1000)
    ),
    ([wallet, nets, mw]) => {
      const isWalletOnly = isWalletOnlyType(wallet.meta.type);

      if (isNetIdMissing(wallet) || !hasNetwork(wallet.meta.netId, nets)) {
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
