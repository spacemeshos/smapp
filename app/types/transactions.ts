export interface Tx {
  txId: string;
  sender: string;
  receiver: string;
  amount: number;
  fee: number;
  status: number;
  layerId?: number;
  timestamp: number;
  nickname?: string;
  note?: string;
}

export type TxList = Array<Tx>;

export enum TxState {
  REJECTED = 1, // rejected from mempool due to, e.g., invalid syntax
  INSUFFICIENT_FUNDS, // rejected from mempool by funds check
  CONFLICTING, // rejected from mempool due to conflicting counter
  MEMPOOL, // in mempool but not on the mesh yet
  MESH, // submitted to the mesh
  PROCESSED
}

export type AccountTxs = { [publicKey: string]: { txId: { tx: Tx } } };
