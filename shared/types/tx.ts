import { _spacemesh_v1_TransactionState_TransactionState as TxState } from '../../proto/spacemesh/v1/TransactionState';
import { _spacemesh_v1_TransactionReceipt_TransactionResult as TxResult } from '../../proto/spacemesh/v1/TransactionReceipt';
import { _spacemesh_v1_SmartContractTransaction_TransactionType as TxSmartContractType } from '../../proto/spacemesh/v1/SmartContractTransaction';
import { Bech32Address, HexString } from './misc';

export { _spacemesh_v1_TransactionState_TransactionState as TxState } from '../../proto/spacemesh/v1/TransactionState';
export { _spacemesh_v1_TransactionReceipt_TransactionResult as TxResult } from '../../proto/spacemesh/v1/TransactionReceipt';
export { _spacemesh_v1_SmartContractTransaction_TransactionType as TxSmartContractType } from '../../proto/spacemesh/v1/SmartContractTransaction';

// Transactions

interface TxReceipt {
  fee: number;
  result?: TxResult;
  gasUsed?: number;
  svmData?: HexString;
}

export interface Tx<T = any> {
  id: HexString;
  principal: Bech32Address;
  template: Bech32Address;
  method: number;
  status: TxState;
  // maxGas: bigint;
  // gasPrice: bigint;
  // maxSpend: bigint;
  payload: T;
  receipt?: TxReceipt;
  layer?: number;
  note?: string;
  // Old one, TODO: Remove
  amount?: number;
}

export interface TxSendRequest {
  sender: HexString;
  receiver: HexString;
  fee: number;
  amount: number;
  note?: string;
}

// Rewards

export interface Reward {
  coinbase: HexString;
  amount: number;
  layer: number;
  layerReward: number;
  layerComputed?: number; // TODO ?
}

export interface SmesherReward {
  coinbase: string;
  total: number;
  layer: number;
  layerReward: number;
}

export interface Activation {
  id: Uint8Array;
  smesherId: Uint8Array;
  coinbase: Uint8Array;
  prevAtx?: Uint8Array | null;
  layer: number;
  numUnits: number;
}
