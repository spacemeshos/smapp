import { RouteComponentProps, StaticContext } from 'react-router';
import { SocketAddress } from '../../../shared/types';

type AuthLocationState = {
  isLoggedOut?: boolean;
  switchApiProvider?: boolean;
  mnemonic?: string;
  apiUrl?: SocketAddress;
};

export type AuthRouterParams = RouteComponentProps<Record<string, any>, StaticContext, AuthLocationState>;
