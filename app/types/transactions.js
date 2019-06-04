// @flow

export type Tx = {
  isSent?: boolean,
  isPending?: boolean,
  isRejected?: boolean,
  amount: number,
  address: string,
  nickname?: string,
  date: string,
  isSavedContact: boolean
};

export type TxList = Tx[];
