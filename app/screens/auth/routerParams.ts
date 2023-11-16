import { RouteComponentProps, StaticContext } from 'react-router';
import { MnemonicOpts, SocketAddress } from '../../../shared/types';
import { AuthPath } from '../../routerPaths';

export type AuthLocationState = Partial<{
  isLoggedOut: boolean;
  mnemonic: MnemonicOpts;
  creatingWallet: boolean;
  redirect:
    | AuthPath.Auth
    | AuthPath.Unlock
    | AuthPath.SwitchNetwork
    | AuthPath.ProtectWalletMnemonicStrength
    | AuthPath.CreateWallet;
  apiUrl: SocketAddress | null;
  genesisID: string;
}>;

export type AuthRouterParams = RouteComponentProps<
  Record<string, any>,
  StaticContext,
  AuthLocationState
>;
