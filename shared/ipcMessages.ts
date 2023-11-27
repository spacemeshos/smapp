import {
  KeyPair,
  Contact,
  Network,
  PublicService,
  SocketAddress,
  WalletMeta,
  WalletType,
  MnemonicOpts,
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
export type UnlockWalletResponse = IpcResponse<{
  meta: WalletMeta;
  forceNetworkSelection: boolean;
}>;
export type CreateAccountResponse = IpcResponse<KeyPair | null>;

export type CreateWalletRequest = {
  password: string;
  type: WalletType;
  apiUrl: SocketAddress | null;
  genesisID: string;
  name?: string;
  mnemonic: MnemonicOpts;
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
  genesisID: string;
  apiUrl: SocketAddress | null;
};

export type RemoveContactRequest = AddContactRequest;

export type ListNetworksResponse = IpcResponse<Network[]>;

export type ListPublicApisResponse = IpcResponse<PublicService[]>;

export type AppLogs = {
  nodeLogs: string;
  appLogs: string;
  genesisID: string;
  appLogsFileName: string;
};

export type ShowFileRequest = { filePath?: string; isLogFile?: boolean };

export type ImportWalletWarningRequest = {
  isDuplicateName: boolean;
  isDuplicateWallet: boolean;
  isDuplicatePath: boolean;
};
