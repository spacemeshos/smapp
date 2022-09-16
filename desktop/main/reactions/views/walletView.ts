import Bech32 from '@spacemesh/address-wasm';
import { hexToBytes } from '@spacemesh/sm-codec/lib/utils/hex';
import { objOf } from 'ramda';
import { combineLatest, map, Subject } from 'rxjs';
import { Wallet } from '../../../../shared/types';
import HRP from '../../../hrp';

const walletRendererState = (
  wallet: Wallet | null,
  currentWalletPath: string
) => {
  if (!wallet)
    return {
      currentWalletPath,
      meta: {},
      mnemonic: '',
      accounts: [],
      contacts: [],
    };

  return {
    currentWalletPath,
    meta: wallet.meta,
    mnemonic: wallet.crypto.mnemonic,
    keychain: wallet.crypto.accounts.map((acc) => ({
      displayName: acc.displayName,
      publicKey: acc.publicKey,
      created: acc.created,
    })),
    accounts: wallet.crypto.accounts.map((acc) => ({
      displayName: acc.displayName,
      address: Bech32.generateAddress(hexToBytes(acc.publicKey), HRP.TestNet), // TODO
      currentState: {
        balance: 0,
        counter: 0,
      },
      projectedState: {
        balance: 0,
        counter: 0,
      },
    })),
    contacts: wallet.crypto.contacts,
  };
};

export default (
  $wallet: Subject<Wallet | null>,
  $walletPath: Subject<string>
) =>
  combineLatest([$wallet, $walletPath] as const).pipe(
    map(([wallet, walletPath]) => walletRendererState(wallet, walletPath)),
    map(objOf('wallet'))
  );
