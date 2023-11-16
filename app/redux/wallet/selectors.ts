import { curry } from 'ramda';
import { HexString, Tx, Reward } from '../../../shared/types';
import { RootState } from '../../types';
import { getNetworkInfo } from '../network/selectors';

export const getRemoteApi = (state: RootState) => state.wallet.meta.remoteApi;

// ======================
// Types
// ======================
type WithTimestamp = {
  timestamp: number | null;
};

export type TxView = Tx & WithTimestamp;
export type RewardView = Reward & WithTimestamp;

// ======================
// WalletFiles
// ======================
export const listWalletFiles = (state: RootState) => state.wallet.walletFiles;

export const getCurrentWalletFile = (state: RootState) =>
  state.wallet.currentWalletPath;

// ======================
// Contacts
// ======================

export const getContacts = (state: RootState): Record<HexString, string> =>
  state.wallet.contacts.reduce(
    (acc, contact) => ({
      ...acc,
      [contact.address.toLowerCase()]: contact.nickname,
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
export const sortTransactions = <T extends Tx | Reward | TxView | RewardView>(
  txs: T[]
): T[] =>
  txs.sort((_a, _b) => {
    const a = Number(_a.layer || null);
    const b = Number(_b.layer || null);
    return (
      Number(_b.layer === undefined) - Number(_a.layer === undefined) ||
      -Number(a > b) ||
      +Number(a < b)
    );
  });

// Get timestamp from layer number
const getLayerTimestamp = (
  genesisMs: number,
  layerDurationSec: number,
  layer: number
) => genesisMs + layer * layerDurationSec * 1000;

const patchWithTimestamp = <T extends Tx | Reward>(
  txs: T[],
  state: RootState
): (T & WithTimestamp)[] => {
  const { genesisTime, layerDurationSec } = getNetworkInfo(state);
  const genesisMs = new Date(genesisTime).getTime();
  return txs.map((tx) => {
    const timestamp =
      (tx.layer && getLayerTimestamp(genesisMs, layerDurationSec, tx.layer)) ||
      null;
    return { ...tx, timestamp };
  });
};

// Getters

const getTransactionsRaw = (publicKey: HexString, state: RootState) =>
  (state.wallet.transactions[publicKey] &&
    Object.values(state.wallet.transactions[publicKey])) ||
  [];

export const getTransactions = curry(
  (publicKey: HexString, state: RootState): TxView[] => {
    const txs = getTransactionsRaw(publicKey, state);
    return patchWithTimestamp(txs, state);
  }
);

export const getSentTransactions = curry(
  (publicKey: HexString, state: RootState): TxView[] => {
    const txs = getTransactionsRaw(publicKey, state);
    const filteredAndReversedTxs = txs
      .filter((obj) => obj.principal === publicKey)
      .reverse();
    return patchWithTimestamp(filteredAndReversedTxs, state);
  }
);

export const getReceivedTransactions = curry(
  (publicKey: HexString, state: RootState): TxView[] => {
    const txs = getTransactionsRaw(publicKey, state);
    const filteredAndReversedTxs = txs
      .filter((obj) => obj.principal !== publicKey)
      .reverse();
    return patchWithTimestamp(filteredAndReversedTxs, state);
  }
);

const getRewardsRaw = (publicKey: HexString, state: RootState) =>
  (state.wallet.rewards[publicKey] &&
    Object.values(state.wallet.rewards[publicKey])) ||
  [];

export const getRewards = curry(
  (publicKey: HexString, state: RootState): RewardView[] => {
    const rewards = getRewardsRaw(publicKey, state);
    return patchWithTimestamp(rewards, state);
  }
);

export const getTxAndRewards = curry((publicKey: HexString, state: RootState): (
  | TxView
  | RewardView
)[] => {
  const txs = getTransactions(publicKey)(state);
  const rewards = getRewards(publicKey)(state);
  return sortTransactions([...txs, ...rewards]);
});

export const getLatestTransactions = (publicKey: HexString) => (
  state: RootState
) => getTxAndRewards(publicKey)(state).slice(0, 4);
