import Bech32 from '@spacemesh/address-wasm';
import { SingleSigTemplate, TemplateRegistry } from '@spacemesh/sm-codec';
import { objOf } from 'ramda';
import { combineLatest, filter, map, Subject } from 'rxjs';
import { Wallet } from '../../../../shared/types';
import { fromHexString } from '../../../../shared/utils';

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
    accounts: wallet.crypto.accounts.map(({ displayName, publicKey }) => {
      const tpl = TemplateRegistry.get(SingleSigTemplate.key, 0);
      const principal = tpl.principal({
        PublicKey: fromHexString(publicKey),
      });
      const address = Bech32.generateAddress(principal);
      return {
        displayName,
        address,
      };
    }),
    contacts: wallet.crypto.contacts,
  };
};

export default (
  $wallet: Subject<Wallet | null>,
  $walletPath: Subject<string>
) =>
  combineLatest([$wallet, $walletPath] as const).pipe(
    map(([wallet, walletPath]) => walletRendererState(wallet, walletPath)),
    filter((state) => state.accounts.length > 0),
    map(objOf('wallet'))
  );
