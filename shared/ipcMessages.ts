import { SocketAddress, WalletMeta, WalletType } from './types';

enum IpcResponseStatus {
  Done,
  Error,
}

export type IpcResponse<T> =
  | { status: IpcResponseStatus.Done; error: null; payload: T }
  | { status: IpcResponseStatus.Error; error: Error; payload: null };

export const createIpcResponse = <T>(error, payload?: T): IpcResponse<T> => {
  if (error)
    return {
      status: IpcResponseStatus.Error,
      error,
      payload: null,
    };
  return {
    status: IpcResponseStatus.Done,
    payload: payload || ({} as T),
    error: null,
  };
};

export type UnlockWalletRequest = {
  path: string;
  password: string;
};

export type UnlockWalletResponse = IpcResponse<WalletMeta>;
export type CreateWalletRequest = {
  password: string;
  existingMnemonic: string;
  type: WalletType;
  apiUrl: SocketAddress | null;
  netId: number;
};
export type CreateWalletResponse = IpcResponse<{ path: string }>;
