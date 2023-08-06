import { RouteComponentProps, StaticContext } from 'react-router';
import { SocketAddress } from '../../../shared/types';
import { MnemonicStrengthType } from '../../../shared/ipcMessages';

export type AuthLocationState = Partial<{
  isLoggedOut: boolean;
  mnemonic: string;
  creatingWallet: boolean;
  redirect: string; // TODO: Enums of paths?
  apiUrl: SocketAddress | null;
  genesisID: string;
  isWalletOnly: boolean;
  mnemonicType: MnemonicStrengthType;
}>;

export type AuthRouterParams = RouteComponentProps<
  Record<string, any>,
  StaticContext,
  AuthLocationState
>;
