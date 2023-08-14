import { RouteComponentProps, StaticContext } from 'react-router';
import { SocketAddress, MnemonicStrengthType } from '../../../shared/types';
import { AuthPath } from '../../routerPaths';

export type AuthLocationState = Partial<{
  isLoggedOut: boolean;
  mnemonic: {
    existing?: string;
    generate?: MnemonicStrengthType;
  };
  creatingWallet: boolean;
  redirect:
    | AuthPath.Auth
    | AuthPath.Unlock
    | AuthPath.SwitchNetwork
    | AuthPath.ProtectWalletMnemonicStrength
    | AuthPath.CreateWallet;
  apiUrl: SocketAddress | null;
  genesisID: string;
  isWalletOnly: boolean;
}>;

export type AuthRouterParams = RouteComponentProps<
  Record<string, any>,
  StaticContext,
  AuthLocationState
>;
