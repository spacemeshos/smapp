// @flow

export type Tx = {
  id: string,
  isSent?: boolean,
  isPending?: boolean,
  isRejected?: boolean,
  amount: number,
  address: string,
  nickname?: string,
  date: string,
  isSavedContact: boolean,
  note?: string
};

export type TxList = Tx[];
