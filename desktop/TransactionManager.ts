import { BrowserWindow } from 'electron';
import { ipcConsts } from '../app/vars';
import StoreService from './storeService';
import cryptoService from './cryptoService';
import { fromHexString, toHexString } from './utils';

const DATA_BATCH = 50;

class TransactionManager {
  private readonly meshService: any;

  private readonly glStateService: any;

  private readonly txService: any;

  accounts: any;

  private streams: any[] = [];

  private readonly mainWindow: BrowserWindow;

  constructor(meshService, glStateService, txService, mainWindow) {
    this.meshService = meshService;
    this.glStateService = glStateService;
    this.txService = txService;
    this.mainWindow = mainWindow;
  }

  appStateUpdater = ({ channel, data }: { channel: string; data: any }) => {
    this.mainWindow.webContents.send(channel, { data });
  };

  updateAppStateAccount = ({ accountId }) => {
    const account = StoreService.get(`accounts.${accountId}.account`);
    this.appStateUpdater({ channel: ipcConsts.T_M_UPDATE_ACCOUNT, data: { account, accountId } });
  };

  updateAppStateTxs = ({ accountId }: { accountId: string }) => {
    const txs = StoreService.get(`accounts.${accountId}.txs`) || [];
    this.appStateUpdater({ channel: ipcConsts.T_M_UPDATE_TXS, data: { txs: Object.values(txs), publicKey: accountId } });
  };

  updateAppStateRewards = ({ accountId }: { accountId: string }) => {
    const rewards = StoreService.get(`accounts.${accountId}.rewards`) || [];
    this.appStateUpdater({ channel: ipcConsts.T_M_UPDATE_REWARDS, data: { rewards, publicKey: accountId } });
  };

  private subscribeAccount = (account) => {
    this.updateAppStateTxs({ accountId: account.publicKey });
    this.updateAppStateRewards({ accountId: account.publicKey });

    const binaryAccountId = fromHexString(account.publicKey);
    const addTransaction = this.addTransaction({ accountId: account.publicKey });
    this.streams.push(this.meshService.activateAccountMeshDataStream({ accountId: binaryAccountId, handler: addTransaction }));

    const updateAccountData = this.updateAccountData({ accountId: account.publicKey });
    this.streams.push(this.glStateService.activateAccountDataStream({ filter: { accountId: { address: binaryAccountId }, accountDataFlags: 4 }, handler: updateAccountData }));

    // TODO uncomment when api is ready
    // const addReceiptToTx = this.addReceiptToTx({ accountId: account.publicKey });
    // this.retrieveHistoricTxReceipt({ filter: { accountId: { address: binaryAccountId }, accountDataFlags: 1 }, offset: 0, handler: addReceiptToTx, retries: 0 });
    // this.glStateService.activateAccountDataStream({ filter: { accountId: { address: binaryAccountId }, accountDataFlags: 1 }, handler: addReceiptToTx });

    this.streams.push(this.glStateService.activateAccountDataStream({ filter: { accountId: { address: binaryAccountId }, accountDataFlags: 2 }, handler: this.addReward }));
  };

  subscribeAccounts = () => {
    this.streams.forEach((unsubcribe) => unsubcribe());
    this.streams = [];
    this.accounts.forEach(this.subscribeAccount);
  };

  setAccounts = ({ accounts }: { accounts: Array<any> }) => {
    this.accounts = accounts;
    this.subscribeAccounts();
  };

  addAccount = ({ account }: { account: any }) => {
    this.accounts.push(account);
    this.subscribeAccount(account);
  };

  addTransaction = ({ accountId }: { accountId: string }) => ({ tx }: { tx: any }) => {
    const txId = toHexString(tx.transaction.id.id);
    const existingTx = StoreService.get(`accounts.${accountId}.txs.${txId}`) || {};
    const newData = {
      txId,
      receiver: toHexString(tx.transaction.coinTransfer.receiver.address),
      sender: toHexString(tx.transaction.sender.address),
      gasProvided: parseInt(tx.transaction.gasOffered.gasProvided),
      // gasPrice: parseInt(tx.transaction.gasOffered.gasPrice), // TODO missing from api response
      amount: parseInt(tx.transaction.amount.value),
      counter: parseInt(tx.transaction.counter),
      signature: {
        scheme: tx.transaction.signature.scheme,
        signature: toHexString(tx.transaction.signature.signature),
        publicKey: toHexString(tx.transaction.signature.publicKey)
      },
      timestamp: new Date().getTime() // TODO missing from api response
    };
    const updatedTx = { ...existingTx, ...newData };
    StoreService.set(`accounts.${accountId}.txs.${txId}`, updatedTx);
    this.updateAppStateTxs({ accountId });
  };

  retrieveHistoricTxData = async ({ accountId, offset, handler, retries }: { accountId: Uint8Array; offset: number; handler: ({ tx }: { tx: any }) => void; retries: number }) => {
    const { data, totalResults, error } = await this.meshService.sendAccountMeshDataQuery({ accountId, offset });
    if (error && retries < 5) {
      await this.retrieveHistoricTxData({ accountId, offset, handler, retries: retries + 1 });
    } else {
      data &&
        data.length &&
        data.forEach((tx) => {
          handler({ tx });
        });
      if (offset + DATA_BATCH < totalResults) {
        await this.retrieveHistoricTxData({ accountId, offset: offset + DATA_BATCH, handler, retries: 0 });
      }
    }
  };

  updateAccountData = ({ accountId }: { accountId: string }) => ({ data }: { data: any }) => {
    const currentState = {
      counter: data.stateCurrent.counter ? parseInt(data.stateCurrent.counter) : 0,
      balance: data.stateCurrent.balance.value ? parseInt(data.stateCurrent.balance.value) : 0
    };
    const projectedState = {
      counter: data.stateProjected.counter ? parseInt(data.stateProjected.counter) : 0,
      balance: data.stateProjected.balance.value ? parseInt(data.stateProjected.balance.value) : 0
    };
    StoreService.set(`accounts.${accountId}.account`, { currentState, projectedState });
    this.updateAppStateAccount({ accountId });
  };

  retrieveAccountData = async ({
    filter,
    handler,
    retries
  }: {
    filter: { accountId: { address: Uint8Array }; accountDataFlags: number };
    handler: ({ data }: { data: any }) => void;
    retries: number;
  }) => {
    const { data, error } = await this.glStateService.sendAccountDataQuery({ filter, offset: 0 });
    if (error && retries < 5) {
      await this.retrieveAccountData({ filter, handler, retries: retries + 1 });
    } else {
      data && data.length > 0 && handler({ data: data[0].accountWrapper });
    }
  };

  addReceiptToTx = ({ accountId }: { accountId: string }) => ({ data }: { data: any }) => {
    const txId = toHexString(data.id.id);
    const existingTx = StoreService.get(`accounts.${accountId}.txs.${txId}`) || {};
    const newData = {
      txId,
      result: data.result,
      gasUsed: parseInt(data.gasUsed),
      fee: parseInt(data.fee.value),
      layer: data.layer,
      index: data.index
    };
    const updatedTx = { ...existingTx, ...newData };
    StoreService.set(`accounts.${accountId}.txs.${txId}`, updatedTx);
    this.updateAppStateTxs({ accountId });
  };

  retrieveHistoricTxReceipt = async ({
    filter,
    offset,
    handler,
    retries
  }: {
    filter: { accountId: { address: Uint8Array }; accountDataFlags: number };
    offset: number;
    handler: ({ data }: { data: any }) => void;
    retries: number;
  }) => {
    const { totalResults, data, error } = await this.glStateService.sendAccountDataQuery({ filter, offset });
    if (error && retries < 5) {
      await this.retrieveHistoricTxReceipt({ filter, offset, handler, retries: retries + 1 });
    } else {
      data && data.length && data.length > 0 && data.forEach((item) => handler({ data: item.receipt }));
      if (offset + DATA_BATCH < totalResults) {
        await this.retrieveHistoricTxReceipt({ filter, offset: offset + DATA_BATCH, handler, retries: 0 });
      }
    }
  };

  addReward = ({ accountId }: { accountId: string }) => ({ data }: { data: any }) => {
    const { reward } = data;
    const genesisTime = StoreService.get('netSettings.genesisTime');
    const layerDurationSec = parseInt(StoreService.get('netSettings.layerDurationSec'));
    const coinbase = toHexString(reward.coinbase.address);
    const parsedReward = {
      txId: 'reward',
      layerId: reward.layer.number,
      total: parseInt(reward.total.value),
      layerReward: parseInt(reward.layerReward.value),
      // layerComputed: data.layerComputed.number, TODO: missing from api response
      coinbase: `0x${coinbase}`,
      smesher: toHexString(reward.smesher.id),
      status: 6, // TODO change to TRANSACTION_STATE_PROCESSED
      timestamp: new Date(genesisTime).getTime() + reward.layer.number * layerDurationSec * 1000
    };
    const rewards = StoreService.get(`accounts.${accountId}.rewards`) || [];
    if (rewards.findIndex((existingReward) => existingReward.timestamp === parsedReward.timestamp && existingReward.total === parsedReward.total) === -1) {
      const updatedRewards = [...rewards, parsedReward].sort((reward1, reward2) => reward2.timestamp - reward1.timestamp);
      StoreService.set(`accounts.${accountId}.rewards`, updatedRewards);
      this.updateAppStateRewards({ accountId });
    }
  };

  retrieveRewards = async ({
    filter,
    offset,
    handler,
    retries
  }: {
    filter: { accountId: { address: Uint8Array }; accountDataFlags: number };
    offset: number;
    handler: ({ data }: { data: any }) => void;
    retries: number;
  }) => {
    const { totalResults, data, error } = await this.glStateService.sendAccountDataQuery({ filter, offset });
    if (error && retries < 5) {
      await this.retrieveRewards({ filter, offset, handler, retries: retries + 1 });
    } else {
      data &&
        data.length > 0 &&
        data.forEach((reward) => {
          handler({ data: reward });
        });
      if (offset + DATA_BATCH < totalResults) {
        await this.retrieveRewards({ filter, offset: offset + DATA_BATCH, handler, retries: 0 });
      }
    }
  };

  sendTx = async ({ fullTx, accountIndex }: { fullTx: any; accountIndex: number }) => {
    const account = StoreService.get(`accounts.${this.accounts[accountIndex].publicKey}.account`);
    const { receiver, amount, fee } = fullTx;
    const res = await cryptoService.signTransaction({
      accountNonce: account.projectedState.counter,
      receiver,
      price: parseInt(fee),
      amount: parseInt(amount),
      secretKey: this.accounts[accountIndex].secretKey
    });
    // @ts-ignore
    const res1 = await this.txService.submitTransaction({ transaction: res });
    const { error, response } = res1;
    if (error) {
      return { error, tx: null, state: '' };
    } else {
      const { txstate } = response;
      const txId = toHexString(txstate.id.id);
      const txWithId = { ...fullTx, txId };
      if (![1, 2, 3].includes(txstate.state)) {
        StoreService.set(`accounts.${this.accounts[accountIndex].publicKey}.txs.${txId}`, txWithId);
        this.updateAppStateTxs({ accountId: this.accounts[accountIndex].publicKey });
        return { error: null, tx: txWithId, state: txstate.state };
      }
      return { error: null, tx: null, state: txstate.state };
    }
  };

  updateTransaction = ({ newData, accountIndex, txId }: { newData: any; accountIndex: number; txId: string }) => {
    return txId ? this.updateTxNote({ newData, accountIndex, txId }) : this.updateTxContact({ newData, accountIndex });
  };

  updateTxNote = ({ newData, accountIndex, txId }: { newData: any; accountIndex: number; txId: string }) => {
    const tx = StoreService.get(`accounts.${this.accounts[accountIndex].publicKey}.txs.${txId}`);
    StoreService.set(`accounts.${this.accounts[accountIndex].publicKey}.txs.${txId}`, { ...tx, note: newData.note });
    this.updateAppStateTxs({ accountId: this.accounts[accountIndex].publicKey });
  };

  updateTxContact = ({ newData, accountIndex }: { newData: any; accountIndex: number }) => {
    const { address, nickname } = newData;
    const addrString = address.substring(2).toLowerCase();
    const txs = StoreService.get(`accounts.${this.accounts[accountIndex].publicKey}.txs.`);
    const updatedTxs = {};
    Object.keys(txs).forEach((key) => {
      updatedTxs[txs[key].txId] = txs[key];
      if (txs[key].sender === addrString || txs[key].receiver === addrString) {
        txs[key].nickname = nickname;
      }
    });
    StoreService.set(`accounts.${this.accounts[accountIndex].publicKey}.txs`, updatedTxs);
    this.updateAppStateTxs({ accountId: this.accounts[accountIndex].publicKey });
  };
}

export default TransactionManager;
