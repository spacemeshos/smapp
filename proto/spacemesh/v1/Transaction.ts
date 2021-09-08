// Original file: proto/types.proto

import type { TransactionId as _spacemesh_v1_TransactionId, TransactionId__Output as _spacemesh_v1_TransactionId__Output } from '../../spacemesh/v1/TransactionId';
import type { CoinTransferTransaction as _spacemesh_v1_CoinTransferTransaction, CoinTransferTransaction__Output as _spacemesh_v1_CoinTransferTransaction__Output } from '../../spacemesh/v1/CoinTransferTransaction';
import type { SmartContractTransaction as _spacemesh_v1_SmartContractTransaction, SmartContractTransaction__Output as _spacemesh_v1_SmartContractTransaction__Output } from '../../spacemesh/v1/SmartContractTransaction';
import type { AccountId as _spacemesh_v1_AccountId, AccountId__Output as _spacemesh_v1_AccountId__Output } from '../../spacemesh/v1/AccountId';
import type { GasOffered as _spacemesh_v1_GasOffered, GasOffered__Output as _spacemesh_v1_GasOffered__Output } from '../../spacemesh/v1/GasOffered';
import type { Amount as _spacemesh_v1_Amount, Amount__Output as _spacemesh_v1_Amount__Output } from '../../spacemesh/v1/Amount';
import type { Signature as _spacemesh_v1_Signature, Signature__Output as _spacemesh_v1_Signature__Output } from '../../spacemesh/v1/Signature';
import type { Long } from '@grpc/proto-loader';

export interface Transaction {
  'id'?: (_spacemesh_v1_TransactionId | null);
  'coinTransfer'?: (_spacemesh_v1_CoinTransferTransaction | null);
  'smartContract'?: (_spacemesh_v1_SmartContractTransaction | null);
  'sender'?: (_spacemesh_v1_AccountId | null);
  'gasOffered'?: (_spacemesh_v1_GasOffered | null);
  'amount'?: (_spacemesh_v1_Amount | null);
  'counter'?: (number | string | Long);
  'signature'?: (_spacemesh_v1_Signature | null);
  'datum'?: "coinTransfer"|"smartContract";
}

export interface Transaction__Output {
  'id': (_spacemesh_v1_TransactionId__Output | null);
  'coinTransfer'?: (_spacemesh_v1_CoinTransferTransaction__Output | null);
  'smartContract'?: (_spacemesh_v1_SmartContractTransaction__Output | null);
  'sender': (_spacemesh_v1_AccountId__Output | null);
  'gasOffered': (_spacemesh_v1_GasOffered__Output | null);
  'amount': (_spacemesh_v1_Amount__Output | null);
  'counter': (Long);
  'signature': (_spacemesh_v1_Signature__Output | null);
  'datum': "coinTransfer"|"smartContract";
}
