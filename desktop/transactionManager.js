import TX_STATUSES from '../app/vars/enums';
import StoreService from './storeService';
import netService from './netService';
import cryptoService from './cryptoService';

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index += 1) {
    await callback(array[index], index, array); // eslint-disable-line no-await-in-loop
  }
};

const fromHexString = (hexString) => {
  const bytes = [];
  for (let i = 0; i < hexString.length; i += 2) {
    bytes.push(parseInt(hexString.slice(i, i + 2), 16));
  }
  return Uint8Array.from(bytes);
};

class TransactionManager {
  constructor() {
    this.networkId = StoreService.get({ key: 'networkId' });
    this.transactions = StoreService.get({ key: `${this.networkId}-transactions` }) || [{ layerId: 0, data: [] }];
    this.rewards = StoreService.get({ key: `${this.networkId}-rewards` }) || [];
    this.accounts = [];
  }

  setAccounts = ({ accounts }) => {
    this.accounts = accounts;
  };

  addAccount = ({ account }) => {
    this.accounts.push(account);
  };

  clearData = () => {
    StoreService.remove({ key: `${this.networkId}-transactions` });
  };

  sendTx = async ({ fullTx, accountIndex }) => {
    try {
      const { error, value } = await netService.getNonce({ address: this.accounts[accountIndex].publicKey });
      if (!error) {
        const { receiver, amount, fee } = fullTx;
        const { tx } = await cryptoService.signTransaction({
          accountNonce: value,
          receiver,
          price: fee,
          amount,
          secretKey: this.accounts[accountIndex].secretKey
        });
        const { id } = await netService.submitTransaction({ tx });
        this.transactions[accountIndex].data.unshift({ txId: id, ...fullTx });
        StoreService.set({ key: `${this.networkId}-transactions`, value: this.transactions });
        return { error: null, transactions: this.transactions, id };
      }
      return { error, transactions: [], id: '' };
    } catch (error) {
      return { error, transactions: [], id: '' };
    }
  };

  updateTransaction = ({ newData, accountIndex, txId }) => {
    const txToUpdateIndex = this.transactions[accountIndex].data.findIndex((tx) => tx.txId === txId);
    this.transactions[accountIndex].data = [
      ...this.transactions[accountIndex].data.slice(0, txToUpdateIndex),
      { ...this.transactions[accountIndex].data[txToUpdateIndex], ...newData },
      ...this.transactions[accountIndex].data.slice(txToUpdateIndex + 1)
    ];
    StoreService.set({ key: `${this.networkId}-transactions`, value: this.transactions });
    return { transactions: this.transactions };
  };

  getAccountTxs = async () => {
    const [hasConfirmedIncomingTxs, hasConfirmedOutgoingTxs] = await this._retrieveAndUpdateTransactions();
    return { transactions: this.transactions, hasConfirmedIncomingTxs, hasConfirmedOutgoingTxs };
  };

  _retrieveAndUpdateTransactions = async () => {
    try {
      let hasConfirmedIncomingTxs = false;
      let hasConfirmedOutgoingTxs = false;

      // for given account and it's tx ids list get full tx data
      const fullTxDataCollector = async (txIds, collector) => {
        await asyncForEach(txIds, async (txId) => {
          const tx = await this._getTransaction({ id: fromHexString(txId.substring(2)) });
          if (tx) {
            collector.push(tx);
          }
        });
      };

      // get all tx ids for every account, then for each account get full tx data for the list
      const txListCollector = async () => {
        await asyncForEach(this.accounts, async (account, index) => {
          const { txs, validatedLayer } = await netService.getAccountTxs({ startLayer: this.transactions[index].layerId, account: account.publicKey });
          if (txs && txs.length) {
            this.transactions[index].data.forEach((existingTx) => {
              if (!txs.includes(`0x${existingTx.txId}`) && existingTx.status === TX_STATUSES.PENDING) {
                txs.push(`0x${existingTx.txId}`);
              }
            });
            const fullDataTxsList = [];
            await fullTxDataCollector(txs, fullDataTxsList);
            const response = this._mergeTxStatuses({
              existingList: this.transactions[index].data,
              incomingList: fullDataTxsList,
              address: account.publicKey.substring(24)
            });
            const { unifiedTxList } = response;
            ({ hasConfirmedIncomingTxs, hasConfirmedOutgoingTxs } = response);
            this.transactions = [...this.transactions.slice(0, index), { layerId: parseInt(validatedLayer), data: unifiedTxList }, ...this.transactions.slice(index + 1)];
            StoreService.set({ key: `${this.networkId}-transactions`, value: this.transactions });
          }
        });
      };
      await txListCollector();
      return [hasConfirmedIncomingTxs, hasConfirmedOutgoingTxs];
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
      return [false, false];
    }
  };

  _getTransaction = async ({ id }) => {
    try {
      const tx = await netService.getTransaction({ id });
      const { txId, sender, receiver, amount, fee, status, layerId, timestamp } = tx;
      return {
        txId: txId.id.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), ''),
        sender: sender.address,
        receiver: receiver.address,
        amount: parseInt(amount),
        fee: parseInt(fee),
        status,
        layerId: parseInt(layerId),
        timestamp: parseInt(timestamp) * 1000
      };
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
      return null;
    }
  };

  _mergeTxStatuses = ({ existingList, incomingList, address }) => {
    const unifiedTxList = [...existingList];
    let hasConfirmedIncomingTxs = false;
    let hasConfirmedOutgoingTxs = false;
    const existingListMap = {};
    existingList.forEach((tx, index) => {
      existingListMap[tx.txId] = { index, tx };
    });
    incomingList.forEach((tx) => {
      if (existingListMap[tx.txId]) {
        hasConfirmedIncomingTxs =
          !hasConfirmedIncomingTxs && existingListMap[tx.txId].tx.status !== TX_STATUSES.CONFIRMED && tx.status === TX_STATUSES.CONFIRMED && tx.receiver === address;
        hasConfirmedOutgoingTxs =
          !hasConfirmedOutgoingTxs && existingListMap[tx.txId].tx.status !== TX_STATUSES.CONFIRMED && tx.status === TX_STATUSES.CONFIRMED && tx.sender === address;
        unifiedTxList[existingListMap[tx.txId].index] = {
          ...existingListMap[tx.txId].tx,
          status: tx.status,
          layerId: tx.layerId || existingListMap[tx.txId].tx.layerId,
          timestamp: tx.timestamp || existingListMap[tx.txId].tx.timestamp
        };
      } else {
        hasConfirmedIncomingTxs = !hasConfirmedIncomingTxs && tx.status === TX_STATUSES.CONFIRMED && tx.receiver === address;
        unifiedTxList.unshift(tx);
      }
    });
    return { unifiedTxList, hasConfirmedIncomingTxs, hasConfirmedOutgoingTxs };
  };

  getAccountRewards = async ({ address, accountIndex }) => {
    try {
      const { rewards } = await netService.getAccountRewards({ address });
      if (!rewards || !rewards.length) {
        return { error: null, rewards: this.rewards, hasNewRewards: false };
      } else {
        const parsedReward = rewards.map((reward) => ({
          layer: parseInt(reward.layer),
          totalReward: parseInt(reward.totalReward),
          layerRewardEstimate: parseInt(reward.layerRewardEstimate)
        }));
        parsedReward.sort((rewardA, rewardB) => rewardA.layer - rewardB.layer);
        let newRewardsWithTimeStamp = [];
        let hasNewRewards = false;
        if (this.rewards.length < parsedReward.length) {
          hasNewRewards = true;
          const newRewards = [...parsedReward.slice(this.rewards.length)];
          const genesisTime = StoreService.get({ key: `${this.networkId}-genesisTime` });
          const layerDuration = StoreService.get({ key: `${this.networkId}-layerDurationSec` });
          newRewardsWithTimeStamp = newRewards.map((reward) => {
            const timestamp = new Date(genesisTime).getTime() + layerDuration * 1000 * reward.layer;
            const tx = {
              txId: 'reward',
              sender: null,
              receiver: address.substring(24),
              amount: reward.totalReward,
              fee: reward.totalReward - reward.layerRewardEstimate,
              status: TX_STATUSES.CONFIRMED,
              layerId: reward.layer,
              timestamp
            };
            this.transactions[accountIndex].data.unshift(tx);
            return tx;
          });
          this.rewards = [...this.rewards, ...newRewardsWithTimeStamp];
          StoreService.set({ key: `${this.networkId}-rewards`, value: this.rewards });
          StoreService.set({ key: `${this.networkId}-transactions`, value: this.transactions });
          return { error: null, rewards: this.rewards, hasNewRewards };
        }
        return { error: null, rewards: this.rewards, hasNewRewards: false };
      }
    } catch (error) {
      return { error, rewards: [] };
    }
  };
}

export default TransactionManager;
