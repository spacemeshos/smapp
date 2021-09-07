import { HexString, Tx, Reward } from '../../../shared/types';
import { RootState } from '../../types';
import { getNetworkInfo } from '../network/selectors';

export const getRemoteApi = (state: RootState) => state.wallet.meta.remoteApi;
export const isWalletOnly = (state: RootState) => !!getRemoteApi(state);

// ======================
// Types
// ======================
type WithTimestamp = { timestamp: number | null };
type WithNicknames = { senderNickname: string | null; receiverNickname: string | null };

export type TxView = Tx & WithTimestamp & WithNicknames;
export type RewardView = Reward & WithTimestamp;

// ======================
// Contacts
// ======================

export const getContacts = (state: RootState): Record<HexString, string> =>
  state.wallet.contacts.reduce(
    (acc, contact) => ({
      ...acc,
      [contact.address.slice(2).toLowerCase()]: contact.nickname,
    }),
    {}
  );

// export const getNicknameByAddress = (address: HexString) => (state: RootState): string | null => {
//   const contacts = getContacts(state);
//   return contacts.find((c) => c.address.slice(2).toLowerCase() === address.toLowerCase())?.nickname || null;
// };

// ======================
// Transactions & Rewards
// ======================

// Utilities

// Sort transactions without layers to the top as mostly fresh ones
export const sortTransactions = <T extends Tx | Reward | TxView | RewardView>(txs: T[]): T[] =>
  txs.sort((_a, _b) => {
    const a = Number(_a.layer || null);
    const b = Number(_b.layer || null);
    return Number(_b.layer === undefined) - Number(_a.layer === undefined) || -Number(a > b) || +Number(a < b);
  });

// Get timestamp from layer number
const getTxTimestamp = (genesisTime: string, layerDurationSec: number, tx: Tx | Reward) =>
  (tx.layer && new Date(genesisTime).getTime() + tx.layer * layerDurationSec * 1000) || null;

const patchWithTimestamp = <T extends Tx | Reward>(txs: T[], state: RootState): (T & WithTimestamp)[] => {
  const { genesisTime, layerDurationSec } = getNetworkInfo(state);
  return txs.map((tx) => ({
    ...tx,
    timestamp: getTxTimestamp(genesisTime, layerDurationSec, tx),
  }));
};

const patchWithContacts = <T extends Tx | (Tx & WithTimestamp)>(txs: T[], state: RootState): (T & WithNicknames)[] => {
  const contacts = getContacts(state);
  return txs.map((tx) => ({
    ...tx,
    senderNickname: contacts[tx.sender.toLowerCase()] || null,
    receiverNickname: contacts[tx.receiver.toLowerCase()] || null,
  }));
};

// Getters

const getTransactionsRaw = (publicKey: HexString, state: RootState) => (state.wallet.transactions[publicKey] && Object.values(state.wallet.transactions[publicKey])) || [];

export const getTransactions = (publicKey: HexString) => (state: RootState): TxView[] => {
  const txs = getTransactionsRaw(publicKey, state);
  const txsWithTime = patchWithTimestamp(txs, state);
  return patchWithContacts(txsWithTime, state);
};

const getRewardsRaw = (publicKey: HexString, state: RootState) => (state.wallet.rewards[publicKey] && Object.values(state.wallet.rewards[publicKey])) || [];

export const getRewards = (publicKey: HexString) => (state: RootState): RewardView[] => {
  const rewards = getRewardsRaw(publicKey, state);
  return patchWithTimestamp(rewards, state);
};

export const getTxAndRewards = (publicKey: HexString) => (state: RootState): (TxView | RewardView)[] => {
  const txs = getTransactions(publicKey)(state);
  const rewards = getRewards(publicKey)(state);
  return sortTransactions([...txs, ...rewards]);
};

export const getLatestTransactions = (publicKey: HexString) => (state: RootState) => getTxAndRewards(publicKey)(state).slice(0, 4);
