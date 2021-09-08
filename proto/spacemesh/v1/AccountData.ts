// Original file: proto/global_state_types.proto

import type { Reward as _spacemesh_v1_Reward, Reward__Output as _spacemesh_v1_Reward__Output } from '../../spacemesh/v1/Reward';
import type { TransactionReceipt as _spacemesh_v1_TransactionReceipt, TransactionReceipt__Output as _spacemesh_v1_TransactionReceipt__Output } from '../../spacemesh/v1/TransactionReceipt';
import type { Account as _spacemesh_v1_Account, Account__Output as _spacemesh_v1_Account__Output } from '../../spacemesh/v1/Account';

export interface AccountData {
  'reward'?: (_spacemesh_v1_Reward | null);
  'receipt'?: (_spacemesh_v1_TransactionReceipt | null);
  'accountWrapper'?: (_spacemesh_v1_Account | null);
  'datum'?: "reward"|"receipt"|"accountWrapper";
}

export interface AccountData__Output {
  'reward'?: (_spacemesh_v1_Reward__Output | null);
  'receipt'?: (_spacemesh_v1_TransactionReceipt__Output | null);
  'accountWrapper'?: (_spacemesh_v1_Account__Output | null);
  'datum': "reward"|"receipt"|"accountWrapper";
}
