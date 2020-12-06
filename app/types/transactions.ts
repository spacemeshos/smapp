export interface Tx {
  txId: string;
  sender: string;
  receiver: string;
  amount: string;
  fee: string;
  status: number;
  layerId?: number;
  timestamp: number;
  nickname?: string;
  note?: string;
}

export type TxList = Array<Tx>;

export type AccountTxs = Array<{ layerId: number; data: TxList }>;
