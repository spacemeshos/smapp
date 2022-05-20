import { assocPath, last, lensPath, lensProp, over, pair, prop } from 'ramda';
import {
  catchError,
  combineLatest,
  delay,
  distinctUntilChanged,
  filter,
  first,
  from,
  map,
  merge,
  of,
  pipe,
  retry,
  skip,
  Subject,
  switchMap,
  throwError,
} from 'rxjs';
import { ipcConsts } from '../../../app/vars';
import {
  CreateAccountResponse,
  createIpcResponse,
  CreateWalletRequest,
  CreateWalletResponse,
  UnlockWalletRequest,
  UnlockWalletResponse,
} from '../../../shared/ipcMessages';
import { SocketAddress, Wallet, WalletType } from '../../../shared/types';
import {
  isLocalNodeApi,
  isRemoteNodeApi,
  stringifySocketAddress,
} from '../../../shared/utils';
import Logger from '../../logger';
import { Network } from '../app.types';
import { fromIPC, handleIPC } from '../rx.utils';
import { createNewAccount, createWallet } from '../Wallet';
import { loadWallet, updateWalletMeta } from '../walletFile';

type WalletPair = { path: string; wallet: Wallet | null };
const walletPair = (path, wallet): WalletPair => ({ path, wallet });

const logger = Logger({ className: 'sources/wallet.ipc' });

const handleWalletIpcRequests = (
  $wallet: Subject<Wallet | null>,
  $walletPath: Subject<string>,
  $networks: Subject<Network[]>
) => {
  // Utils
  const handleNewWalletPair = async (next: WalletPair) => {
    $wallet.next(next.wallet);
    $walletPath.next(next.path);
  };
  const updateWalletFile = async (next: WalletPair) => {
    if (!next.wallet) return;
    updateWalletMeta(next.path, next.wallet.meta).catch((err) =>
      logger.error(
        'updateWalletFile',
        err,
        `Can not update walletMeta by path: ${next.path}`
      )
    );
  };

  const loadWallet$ = (path, password) => from(
    loadWallet(path, password).then((wallet) => ({
      pair: walletPair(path, wallet),
      error: null,
    }))
  ).pipe(
    catchError((error: Error) =>
      of({ pair: walletPair('', null), error })
    )
  );
  

  const getPair = () => pipe(map(prop('pair')));
  // Handle IPC requests and produce `Wallet | null`
  const $nextWallet = merge(
    //
    handleIPC(
      ipcConsts.W_M_UNLOCK_WALLET,
      ({ path, password }: UnlockWalletRequest) => loadWallet$(path, password),
      ({ pair, error }): UnlockWalletResponse =>
        createIpcResponse(error, pair?.wallet?.meta)
    ).pipe(getPair()),
    //
    handleIPC(
      ipcConsts.W_M_CREATE_WALLET,
      (data: CreateWalletRequest) => from(createWallet(data)),
      ({ path }): CreateWalletResponse => createIpcResponse(null, { path })
    ),
    //
    fromIPC<number>(ipcConsts.SWITCH_NETWORK).pipe(
      switchMap((netId) =>
        combineLatest([of(netId), $wallet, $walletPath, $networks])
      ),
      first(),
      switchMap(([netId, wallet, path, nets]) => {
        if (nets.length === 0)
          return throwError(() => Error('No networks to switch on'));
        if (!wallet) return throwError(() => Error('No opened wallet'));

        const selectedNet = nets.find((net) => net.netID === netId);
        if (!selectedNet) return throwError(() => Error('No network found'));

        return of(
          walletPair(path, assocPath(['meta', 'netId'], netId, wallet))
        );
      }),
      retry(3),
      delay(1000),
      catchError(() => of(walletPair('', null)))
    ),
    //
    handleIPC(
      ipcConsts.SWITCH_API_PROVIDER,
      (apiUrl: SocketAddress | null) =>
        combineLatest([$wallet, $walletPath] as const).pipe(
          filter((pair): pair is [Wallet, string] => pair[0] !== null),
          map(([wallet, path]) => {
            const changes = {
              remoteApi:
                apiUrl && isRemoteNodeApi(apiUrl)
                  ? stringifySocketAddress(apiUrl)
                  : '',
              type:
                apiUrl && isLocalNodeApi(apiUrl)
                  ? WalletType.LocalNode
                  : WalletType.RemoteApi,
            };
            const nextWallet: Wallet = {
              ...wallet,
              meta: { ...wallet.meta, ...changes },
            };

            return { path, wallet: nextWallet };
          })
        ),
      ({ wallet }) => createIpcResponse(null, wallet.meta)
    ),
    //
    handleIPC(
      ipcConsts.W_M_CREATE_NEW_ACCOUNT,
      ({ path, password }: UnlockWalletRequest) =>
        loadWallet$(path, password).pipe(
          map((res) => {
            if (res.error) return res;
            return over(
              lensPath(['pair', 'wallet']),
              (wallet) => (wallet && createNewAccount(wallet)) || null,
              res
            );
          })
        ),
      ({ pair, error }): CreateAccountResponse =>
        createIpcResponse(
          error,
          pair.wallet ? last(pair.wallet.crypto.accounts) : null
        )
    ).pipe(getPair())
    // TODO: W_M_UPDATE_WALLET_META
    // TODO: W_M_UPDATE_WALLET_SECRETS
    // isn't it a bit silly to have such generic messages?
  );

  const subs = [
    // Update wallet in state
    $nextWallet.subscribe(handleNewWalletPair),
    // Store new wallet on FS
    $nextWallet
      .pipe(skip(1), distinctUntilChanged())
      .subscribe(updateWalletFile),
  ];

  return () => subs.forEach((sub) => sub.unsubscribe());
};

export default handleWalletIpcRequests;
