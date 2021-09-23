import { RouteComponentProps, StaticContext } from 'react-router';

type AuthLocationState = {
  isLoggedOut?: boolean;
  switchApiProvider?: boolean;
  ip?: string;
  port?: string;
  mnemonic?: string;
};

export type AuthRouterParams = RouteComponentProps<Record<string, any>, StaticContext, AuthLocationState>;
