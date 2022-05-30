import {
  Account,
  Contact,
  Network,
  PublicService,
  SocketAddress,
  WalletMeta,
  WalletType,
} from './types';

// Utils
enum IpcResponseStatus {
  Done,
  Error,
}

type IpcResponseError = {
  status: IpcResponseStatus.Error;
  error: Error;
  payload: null;
};
export type IpcResponse<T> =
  | { status: IpcResponseStatus.Done; error: null; payload: T }
  | IpcResponseError;

export const createIpcResponse = <T>(
  error: Error | null,
  payload?: T | null
): IpcResponse<T> => {
  if (error)
    return {
      status: IpcResponseStatus.Error,
      error,
      payload: null,
    } as IpcResponseError;

  return {
    status: IpcResponseStatus.Done,
    payload: payload || ({} as T),
    error: null,
  };
};

// IPC Message types

export type UnlockWalletRequest = {
  path: string;
  password: string;
};
export type UnlockWalletResponse = IpcResponse<WalletMeta>;
export type CreateAccountResponse = IpcResponse<Account | null>;

export type CreateWalletRequest = {
  password: string;
  existingMnemonic: string;
  type: WalletType;
  apiUrl: SocketAddress | null;
  netId: number;
};
export type CreateWalletResponse = IpcResponse<{ path: string }>;

export type UpdateWalletMetaRequest = {
  key: keyof WalletMeta;
  value: WalletMeta[keyof WalletMeta];
};

export type ChangePasswordRequest = {
  path: string;
  prevPassword: string;
  nextPassword: string;
};

export type RenameAccountRequest = {
  path: string;
  index: number;
  name: string;
  password: string;
};

export type AddContactRequest = {
  path: string;
  password: string;
  contact: Contact;
};

export type SwitchApiRequest = {
  netId: number;
  apiUrl: SocketAddress | null;
};

export type RemoveContactRequest = AddContactRequest;

export type ListNetworksResponse = IpcResponse<Network[]>;

export type ListPublicApisResponse = IpcResponse<PublicService[]>;
