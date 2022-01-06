import { RouteComponentProps, StaticContext } from 'react-router';
import { SocketAddress } from '../../../shared/types';

type AuthLocationState = Partial<{
  isLoggedOut: boolean;
  switchApiProvider: boolean;
  mnemonic: string;
  creatingWallet: boolean;
  redirect: string; // TODO: Enums of paths?
  apiUrl: SocketAddress;
  netId: number;
  isWalletOnly: boolean;
}>;

export type AuthRouterParams = RouteComponentProps<Record<string, any>, StaticContext, AuthLocationState>;
