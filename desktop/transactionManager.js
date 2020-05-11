import { ipcConsts } from '../app/vars';
import TX_STATUSES from '../app/vars/enums';
import StoreService from './storeService';
import netService from './netService';

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

// notificationsService.notify({
//             title: 'Spacemesh',
//             notification: 'Received a reward for smeshing!',
//             callback: () => this.handleNavigation({ index: 0 })
//           });

class TransactionManager {
  constructor() {
    this.networkId = StoreService.get({ key: 'networkId' });
    const rawTransactions = StoreService.get({ key: `${this.networkId}-transactions` });
    this.transactions = rawTransactions ? JSON.parse(rawTransactions) : [{ layerId: 0, data: [] }];
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

  sendTx = async ({ event, tx, accountIndex, txToAdd }) => {
    try {
      const { id } = await netService.submitTransaction({ tx });
      const fullTxToAdd = { ...txToAdd, txId: id };
      const { accounts, transactions, currentAccountIndex } = getState().wallet;
      const index: number = accountPK ? accounts.findIndex((account) => account.publicKey === accountPK) : currentAccountIndex;
      const updatedTransactions = [
        ...transactions.slice(0, index),
        { layerId: transactions[index].layerId, data: [{ ...tx }, ...transactions[index].data] },
        ...transactions.slice(index + 1)
      ];
      this.transactions[index].data.push(fullTxToAdd);
      event.sender.send(ipcConsts.SEND_TX_RESPONSE, { error: null, transactions: this.transactions[accountIndex], id });
    } catch (error) {
      event.sender.send(ipcConsts.SEND_TX_RESPONSE, error.message);
    }
  };

  updateTransaction = ({ event, newData, accountIndex, txId }) => {
    const txToUpdateIndex = this.transactions[accountIndex].data.findIndex((tx) => tx.txId === txId);
    this.transactions[accountIndex].data = [
      ...this.transactions[accountIndex].data.slice(0, txToUpdateIndex),
      { ...this.transactions[accountIndex].data[txToUpdateIndex], ...newData },
      ...this.transactions[accountIndex].data.slice(txToUpdateIndex + 1)
    ];
    event.sender.send(ipcConsts.UPDATE_TX_RESPONSE, { transactions: this.transactions[accountIndex] });
  };

  getAccountTxs = async ({ event, accountIndex }) => {
    const [hasConfirmedIncomingTxs, hasConfirmedOutgoingTxs] = await this._retrieveAndUpdateTransactions();
    event.sender.send(ipcConsts.GET_ACCOUNT_TXS_RESPONSE, { transactions: this.transactions[accountIndex], hasConfirmedIncomingTxs, hasConfirmedOutgoingTxs });
  };

  _retrieveAndUpdateTransactions = async () => {
    try {
      let hasConfirmedIncomingTxs = false;
      let hasConfirmedOutgoingTxs = false;

      // for given account and it's tx ids list get full tx data
      const fullTxDataCollector = async (txIds: Array<string>, collector: Array<Tx>) => {
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
          this.transactions = [...this.transactions.slice(0, index), { layerId: validatedLayer, data: unifiedTxList }, ...this.transactions.slice(index + 1)];
        });
      };
      await txListCollector();
      return [hasConfirmedIncomingTxs, hasConfirmedOutgoingTxs];
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
      return null;
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

  _mergeTxStatuses = ({ existingList, incomingList, address }: { existingList: TxList, incomingList: TxList, address: string }) => {
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
        unifiedTxList[existingListMap[tx.txId].index] = { ...existingListMap[tx.txId].tx, status: tx.status, layerId: tx.layerId || existingListMap[tx.txId].tx.layerId };
      } else {
        hasConfirmedIncomingTxs = !hasConfirmedIncomingTxs && tx.status === TX_STATUSES.CONFIRMED && tx.receiver === address;
        unifiedTxList.unshift(tx.timestamp ? tx : { ...tx, timestamp: tx.timestamp || new Date().getTime() });
      }
    });
    return { unifiedTxList, hasConfirmedIncomingTxs, hasConfirmedOutgoingTxs };
  };

  _getAccountRewards = async ({ event, address }) => {
    try {
      const { rewards } = await netService._getAccountRewards({ address });
      if (!rewards || !rewards.length) {
        event.sender.send(ipcConsts.GET_ACCOUNT_REWARDS_RESPONSE, { error: null, rewards: [] });
      } else {
        const parsedReward = rewards.map((reward) => ({
          layer: parseInt(reward.layer),
          totalReward: parseInt(reward.totalReward),
          layerRewardEstimate: parseInt(reward.layerRewardEstimate)
        }));
        parsedReward.sort((rewardA, rewardB) => rewardA.layer - rewardB.layer);
        event.sender.send(ipcConsts.GET_ACCOUNT_REWARDS_RESPONSE, { error: null, rewards: parsedReward });
      }
    } catch (error) {
      event.sender.send(ipcConsts.GET_ACCOUNT_REWARDS_RESPONSE, { error, rewards: [] });
    }
  };

  getAccountRewards = ({ notify }: { notify: () => void }): Action => async (dispatch: Dispatch, getState: GetState): Dispatch => {
    const { status, rewards, genesisTime, layerDuration } = getState().node;
    if (status && !status.noConnection) {
      try {
        const { accounts, currentAccountIndex } = getState().wallet;
        const updatedRewards = await netService.getAccountRewards({ address: accounts[currentAccountIndex].publicKey });
        let newRewardsWithTimeStamp = [];
        if (rewards.length < updatedRewards.length) {
          notify();
          const newRewards = [...updatedRewards.slice(rewards.length)];
          newRewardsWithTimeStamp = newRewards.map((reward) => {
            const timestamp = new Date(genesisTime).getTime() + layerDuration * 1000 * reward.layer;
            const tx = {
              txId: 'reward',
              sender: null,
              receiver: getAddress(accounts[currentAccountIndex].publicKey),
              amount: reward.totalReward,
              fee: reward.totalReward - reward.layerRewardEstimate,
              status: TX_STATUSES.CONFIRMED,
              layerId: reward.layer,
              timestamp
            };
            dispatch(addTransaction({ tx, accountPK: accounts[currentAccountIndex].publicKey }));
            return {
              totalReward: reward.totalReward,
              layerRewardEstimate: reward.layerRewardEstimate,
              timestamp
            };
          });
          const rewardsWithTimeStamps = [...rewards, ...newRewardsWithTimeStamp];
          localStorageService.set('rewards', rewardsWithTimeStamps);
          dispatch({ type: SET_ACCOUNT_REWARDS, payload: { rewards: rewardsWithTimeStamps } });
        }
      } catch (err) {
        throw createError('Error getting account rewards', () => getAccountRewards({ notify }));
      }
    }
  };
}

export default TransactionManager;
