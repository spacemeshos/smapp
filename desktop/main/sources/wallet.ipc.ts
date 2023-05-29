import * as R from 'ramda';
import {
  combineLatest,
  delay,
  filter,
  first,
  from,
  map,
  merge,
  Observable,
  of,
  OperatorFunction,
  pipe,
  retry,
  Subject,
  switchMap,
  throwError,
  withLatestFrom,
} from 'rxjs';
import { ipcConsts } from '../../../app/vars';
import {
  AddContactRequest,
  ChangePasswordRequest,
  CreateAccountResponse,
  CreateWalletRequest,
  CreateWalletResponse,
  RemoveContactRequest,
  RenameAccountRequest,
  SwitchApiRequest,
  UnlockWalletRequest,
  UnlockWalletResponse,
  UpdateWalletMetaRequest,
} from '../../../shared/ipcMessages';
import { Network, Wallet, WalletType } from '../../../shared/types';
import {
  isLocalNodeApi,
  isRemoteNodeApi,
  stringifySocketAddress,
} from '../../../shared/utils';
import Warning, {
  WarningType,
  WriteFilePermissionWarningKind,
} from '../../../shared/warning';
import Logger from '../../logger';
import { SmeshingSetupState } from '../../NodeManager';
import { hasNetwork } from '../Networks';
import {
  explodeResult,
  fromIPC,
  handleIPC,
  handlerError,
  handlerResult,
  hasResult,
  mapResult,
  wrapResult,
} from '../rx.utils';
import { createNewAccount, createWallet, isGenesisIDMissing } from '../Wallet';
import {
  loadAndMigrateWallet,
  loadWallet,
  saveWallet,
  updateWalletMeta,
  WRONG_PASSWORD_MESSAGE,
} from '../walletFile';
import { getLocalNodeConnectionConfig } from '../utils';

type WalletData = {
  // path to wallet file
  path: string;
  // wallet file contents
  wallet: Wallet;
  // some meta data for responses
  // e.g. to request network selection
  meta?: Record<string, any>;
  // password to save the wallet file
  password?: string;
  // true to save the wallet file
  save?: boolean;
  // true to reset $wallet state (e.g. on closing wallet)
  reset?: boolean;
};

type ResetWallet = { path: ''; wallet: null };
const RESET_WALLET: ResetWallet = { path: '', wallet: null };

const isWalletData = (a: any): a is WalletData =>
  Boolean(a.path) && Boolean(a.wallet);

const logger = Logger({ className: 'sources/wallet.ipc' });

// Utils
const updateWalletFile = async (next: WalletData) => {
  if (next.password) {
    await saveWallet(next.path, next.password, next.wallet).catch((err) => {
      if (err?.message === WRONG_PASSWORD_MESSAGE) return;
      logger.error('updateWalletFile/saveWallet', err, next.path);
      throw err;
    });
  } else {
    await updateWalletMeta(next.path, next.wallet.meta).catch((err) => {
      logger.error('updateWalletFile', err, next.path);
      throw err;
    });
  }
};

const loadWallet$ = (path: string, password: string) => {
  return from(
    wrapResult(
      loadWallet(path, password).then((wallet) => <WalletData>{ path, wallet })
    )
  );
};

// TODO: Replace it with `loadWallet$` in next release
const loadAndMigrateWallet$ = (path: string, password: string) => {
  return from(
    wrapResult(
      loadAndMigrateWallet(path, password).then(
        (wallet) => <WalletData>{ path, wallet }
      )
    )
  );
};

const changePassword = (path, prevPassword, nextPassword) =>
  loadWallet$(path, prevPassword).pipe(
    filter(hasResult),
    switchMap(([_, { path, wallet }]) =>
      from(saveWallet(path, nextPassword, wallet)).pipe(
        map(() => <WalletData>{ path, wallet, save: true })
      )
    )
  );

const handleUpdateWalletSecrets = <
  T extends { path: string; password: string }
>(
  mapFn: (inputs: T, pair: WalletData) => WalletData
): OperatorFunction<T, WalletData> =>
  pipe(
    switchMap((t) =>
      loadWallet$(t.path, t.password).pipe(
        filter(hasResult),
        map((hr) =>
          mapResult(
            (pair) => mapFn(t, { ...pair, password: t.password, save: true }),
            hr
          )
        ),
        map((x) => explodeResult(x))
      )
    )
  );

// Subscription

const handleWalletIpcRequests = (
  $wallet: Subject<Wallet | null>,
  $walletPath: Subject<string>,
  $networks: Subject<Network[]>,
  $smeshingStarted: Observable<SmeshingSetupState>,
  $warnings: Subject<Warning>
) => {
  // Handle IPC requests and produces WalletUpdate
  const $nextWallet = merge(
    //
    handleIPC(
      ipcConsts.W_M_UNLOCK_WALLET,
      ({ path, password }: UnlockWalletRequest) =>
        loadAndMigrateWallet$(path, password).pipe(
          withLatestFrom($networks),
          map(([hr, nets]) =>
            mapResult(
              (pair) =>
                <WalletData>{
                  ...pair,
                  meta: {
                    forceNetworkSelection:
                      isGenesisIDMissing(pair.wallet) ||
                      !hasNetwork(pair.wallet.meta.genesisID, nets),
                  },
                },
              hr
            )
          )
        ),
      ({ wallet, meta }): UnlockWalletResponse['payload'] => ({
        meta: wallet.meta,
        forceNetworkSelection: meta?.forceNetworkSelection,
      })
    ),
    //
    handleIPC(
      ipcConsts.W_M_CREATE_WALLET,
      (data: CreateWalletRequest) =>
        from(
          wrapResult(
            createWallet(data).then((walletData) => ({
              ...walletData,
              save: true,
            })) as Promise<WalletData>
          )
        ),
      ({ path }): CreateWalletResponse['payload'] => ({ path })
    ),
    //
    fromIPC<string>(ipcConsts.SWITCH_NETWORK).pipe(
      withLatestFrom($wallet, $walletPath, $networks),
      switchMap(([genesisID, wallet, path, nets]) => {
        if (nets.length === 0)
          return throwError(() => Error('No networks to switch on'));
        if (!wallet) return throwError(() => Error('No opened wallet'));

        const selectedNet = nets.find((net) => net.genesisID === genesisID);
        if (!selectedNet) return throwError(() => Error('No network found'));

        return of(<WalletData>{
          path,
          wallet: R.assocPath(['meta', 'genesisID'], genesisID, wallet),
          save: true,
        });
      }),
      retry(3),
      delay(1000)
    ),
    //
    handleIPC(
      ipcConsts.SWITCH_API_PROVIDER,
      ({
        apiUrl = getLocalNodeConnectionConfig(),
        genesisID,
      }: SwitchApiRequest) =>
        of(null).pipe(
          withLatestFrom($wallet, $walletPath),
          map(([_, wallet, path]) => {
            if (!wallet)
              return handlerError(
                Error(
                  'Can not switch API provider: open the wallet file before'
                )
              );
            if (!genesisID)
              return handlerError(
                Error('Switch API Provider failed: missing net id in request')
              );

            const changes = {
              genesisID,
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

            return handlerResult(<WalletData>{
              path,
              wallet: nextWallet,
              save: true,
              reset: true,
            });
          })
        ),
      ({ wallet }) => wallet.meta
    ),
    //
    handleIPC(
      ipcConsts.W_M_CREATE_NEW_ACCOUNT,
      ({ path, password }: UnlockWalletRequest) =>
        loadWallet$(path, password).pipe(
          map((res) =>
            hasResult(res)
              ? mapResult(
                  (pair) => ({
                    ...pair,
                    wallet: createNewAccount(pair.wallet),
                    password,
                    save: true,
                  }),
                  res
                )
              : res
          )
        ),
      (pair): CreateAccountResponse['payload'] =>
        R.last(pair.wallet.crypto.accounts) || null
    ),
    //
    fromIPC<UpdateWalletMetaRequest>(ipcConsts.W_M_UPDATE_WALLET_META).pipe(
      withLatestFrom($wallet, $walletPath),
      filter((tuple): tuple is [UpdateWalletMetaRequest, Wallet, string] =>
        Boolean(tuple[1])
      ), // or throw error?
      map(([upd, wallet, path]) => {
        return <WalletData>{
          path,
          wallet: {
            ...wallet,
            meta: {
              ...wallet.meta,
              [upd.key]: upd.value,
            },
          },
          save: true,
        };
      })
    ),
    //
    fromIPC<ChangePasswordRequest>(ipcConsts.W_M_CHANGE_PASSWORD).pipe(
      switchMap(({ path, prevPassword, nextPassword }) =>
        changePassword(path, prevPassword, nextPassword)
      )
    ),
    //
    fromIPC<RenameAccountRequest>(ipcConsts.W_M_RENAME_ACCOUNT).pipe(
      handleUpdateWalletSecrets(({ index, name }, pair) =>
        R.assocPath(
          ['wallet', 'crypto', 'accounts', index, 'displayName'],
          name,
          pair
        )
      )
    ),
    //
    fromIPC<AddContactRequest>(ipcConsts.W_M_ADD_CONTACT).pipe(
      handleUpdateWalletSecrets(({ contact }, pair) =>
        R.over(
          R.lensPath(['wallet', 'crypto', 'contacts']),
          R.append(contact),
          pair
        )
      )
    ),
    //
    fromIPC<RemoveContactRequest>(ipcConsts.W_M_REMOVE_CONTACT).pipe(
      handleUpdateWalletSecrets(({ contact }, pair) =>
        R.over(
          R.lensPath(['wallet', 'crypto', 'contacts']),
          R.filter(R.complement(R.equals(contact))),
          pair
        )
      )
    ),
    //
    fromIPC<void>(ipcConsts.W_M_CLOSE_WALLET).pipe(
      switchMap(() => of(RESET_WALLET))
    ),
    //
    $smeshingStarted.pipe(
      switchMap(() => combineLatest([$wallet, $walletPath])),
      first(),
      filter(
        (pair): pair is [Wallet, string] =>
          Boolean(pair[0]) && typeof pair[1] === 'string'
      ),
      map(
        ([wallet, path]): WalletData => ({
          wallet: {
            ...wallet,
            meta: {
              ...wallet.meta,
              remoteApi: stringifySocketAddress(getLocalNodeConnectionConfig()),
              type: WalletType.LocalNode,
            },
          },
          path,
        })
      )
    )
  );

  const subs = [
    // Update wallet and wallet path subjects
    $nextWallet.subscribe({
      next: (next) => {
        if (next.wallet && next.reset) {
          $wallet.next(null);
          $walletPath.next('');
        } else {
          $wallet.next(next.wallet);
          $walletPath.next(next.path);
        }
        if (isWalletData(next) && next.save) {
          updateWalletFile(next).catch((err: any) => {
            $warnings.next(
              Warning.fromError(
                WarningType.WriteFilePermission,
                {
                  kind: WriteFilePermissionWarningKind.WalletFile,
                  filePath: next.path,
                },
                err
              )
            );
          });
        }
      },
      error: (error: Error) => {
        logger.debug('$nextWallet', error);
        $warnings.next(Warning.fromError(WarningType.Unknown, {}, error));
      },
      complete: () => {
        logger.error('$nextWallet', 'Observable is completed');
      },
    }),
  ];

  return () => subs.forEach((sub) => sub.unsubscribe());
};

export default handleWalletIpcRequests;
