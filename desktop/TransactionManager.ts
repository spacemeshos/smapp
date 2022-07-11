import * as R from 'ramda';
import { BrowserWindow } from 'electron';
import {
  Account,
  AccountWithBalance,
  HexString,
  Reward,
  Tx,
  TxCoinTransfer,
  TxSendRequest,
  TxState,
} from '../shared/types';
import { ipcConsts } from '../app/vars';
import { AccountDataFlag } from '../proto/spacemesh/v1/AccountDataFlag';
import { Transaction__Output } from '../proto/spacemesh/v1/Transaction';
import { TransactionState__Output } from '../proto/spacemesh/v1/TransactionState';
import { AccountData__Output } from '../proto/spacemesh/v1/AccountData';
import { MeshTransaction__Output } from '../proto/spacemesh/v1/MeshTransaction';
import { Reward__Output } from '../proto/spacemesh/v1/Reward';
import { Account__Output } from '../proto/spacemesh/v1/Account';
import { addReceiptToTx, toTx } from '../shared/types/transformers';
import { hasRequiredRewardFields } from '../shared/types/guards';
import { debounce, delay } from '../shared/utils';
import cryptoService from './cryptoService';
import { fromHexString, toHexString } from './utils';
import TransactionService from './TransactionService';
import MeshService from './MeshService';
import GlobalStateService, {
  AccountDataStreamHandlerArg,
  AccountDataValidFlags,
} from './GlobalStateService';
import { AccountStateManager } from './AccountState';
import Logger from './logger';
import { GRPC_QUERY_BATCH_SIZE as BATCH_SIZE } from './main/constants';

const DATA_BATCH = 50;
const IPC_DEBOUNCE = 1000;

type TxHandlerArg = MeshTransaction__Output | null | undefined;
type TxHandler = (tx: TxHandlerArg) => void;

type RewardHandlerArg = Reward__Output | null | undefined;

class TransactionManager {
  logger = Logger({ className: 'TransactionManager' });

  private readonly meshService: MeshService;

  private readonly glStateService: GlobalStateService;

  private readonly txService: TransactionService;

  accounts: AccountWithBalance[] = [];

  private readonly mainWindow: BrowserWindow;

  private txStateStream: Record<
    string,
    ReturnType<TransactionService['activateTxStream']>
  > = {};

  private accountStates: Record<string, AccountStateManager> = {};

  private netId: number;

  constructor(
    meshService: MeshService,
    glStateService: GlobalStateService,
    txService: TransactionService,
    mainWindow: BrowserWindow,
    netId: number
  ) {
    this.meshService = meshService;
    this.glStateService = glStateService;
    this.txService = txService;
    this.mainWindow = mainWindow;
    this.netId = netId;
  }

  //
  appStateUpdater = (channel: ipcConsts, payload: any) => {
    this.mainWindow.webContents.send(channel, { ...payload });
  };

  // Debounce update functions to avoid excessive IPC calls
  updateAppStateAccount = debounce(IPC_DEBOUNCE, (publicKey: string) => {
    const account = this.accountStates[publicKey].getAccount();
    this.appStateUpdater(ipcConsts.T_M_UPDATE_ACCOUNT, {
      account,
      accountId: publicKey,
    });
  });

  updateAppStateTxs = debounce(IPC_DEBOUNCE, (publicKey: string) => {
    const txs = this.accountStates[publicKey].getTxs();
    this.appStateUpdater(ipcConsts.T_M_UPDATE_TXS, { txs, publicKey });
  });

  updateAppStateRewards = debounce(IPC_DEBOUNCE, (publicKey: string) => {
    const rewards = this.accountStates[publicKey].getRewards();
    this.appStateUpdater(ipcConsts.T_M_UPDATE_REWARDS, { rewards, publicKey });
  });

  private storeTx = (publicKey: string, tx: Tx): Promise<void> =>
    this.accountStates[publicKey]
      .storeTransaction(tx)
      .then(() => this.updateAppStateTxs(publicKey))
      .catch((err) => {
        console.log('TransactionManager.storeTx', err); // eslint-disable-line no-console
        this.logger.error('TransactionManager.storeTx', err);
      });

  private storeReward = (publicKey: string, reward: Reward) =>
    this.accountStates[publicKey]
      .storeReward(reward)
      .then(() => this.updateAppStateRewards(publicKey))
      .catch((err) => {
        console.log('TransactionManager.storeReward', err); // eslint-disable-line no-console
        this.logger.error('TransactionManager.storeReward', err);
      });

  private handleNewTx = (publicKey: string) => async (tx: {
    transaction: Transaction__Output | null;
    transactionState: TransactionState__Output | null;
  }) => {
    if (!tx.transaction || !tx.transactionState || !tx.transactionState.state)
      return;
    const newTx = toTx(tx.transaction, tx.transactionState);
    if (!newTx) return;
    await this.storeTx(publicKey, newTx);
  };

  private subscribeTransactions = debounce(1000, (publicKey: string) => {
    const txs = this.accountStates[publicKey].getTxs();
    const txIds = Object.keys(txs).map(fromHexString);

    const unsubTxStateStream = this.txStateStream[publicKey];
    // Unsubscribe
    unsubTxStateStream && unsubTxStateStream();

    this.txStateStream[publicKey] = this.txService.activateTxStream(
      this.handleNewTx(publicKey),
      txIds
    );

    this.txService
      .getTxsState(txIds)
      .then((resp) =>
        // two lists -> list of tuples
        resp.transactions.map((tx, idx) => ({
          transaction: tx,
          transactionState: resp.transactionsState[idx],
        }))
      )
      .then((txs) => txs.map(this.handleNewTx(publicKey)))
      .catch((err) => {
        this.logger.error('grpc TransactionState', err);
      });
  });

  private subscribeAccount = (account: AccountWithBalance): void => {
    const { publicKey } = account;
    // Cancel account Txs subscription
    this.txStateStream[publicKey]?.();
    const binaryAccountId = fromHexString(publicKey.substring(24));
    const addTransaction = this.upsertTransactionFromMesh(publicKey);
    this.retrieveHistoricTxData({
      accountId: binaryAccountId,
      offset: 0,
      handler: addTransaction,
      retries: 0,
    });
    this.meshService.listenMeshTransactions(binaryAccountId, addTransaction);

    const updateAccountData = this.updateAccountData({ accountId: publicKey });
    this.retrieveAccountData({
      filter: {
        accountId: { address: binaryAccountId },
        accountDataFlags: AccountDataFlag.ACCOUNT_DATA_FLAG_ACCOUNT,
      },
      handler: updateAccountData,
      retries: 0,
    });
    this.glStateService.activateAccountDataStream(
      binaryAccountId,
      AccountDataFlag.ACCOUNT_DATA_FLAG_ACCOUNT,
      updateAccountData
    );

    const txs = Object.keys(this.accountStates[publicKey].getTxs());
    if (txs.length > 0) {
      this.subscribeTransactions(publicKey);
    }

    // TODO: https://github.com/spacemeshos/go-spacemesh/issues/2072
    // const addReceiptToTx = this.addReceiptToTx({ accountId: publicKey });
    // this.retrieveHistoricTxReceipt({ filter: { accountId: { address: binaryAccountId }, accountDataFlags: 1 }, offset: 0, handler: addReceiptToTx, retries: 0 });
    // this.glStateService.activateAccountDataStream(binaryAccountId, AccountDataFlag.ACCOUNT_DATA_FLAG_TRANSACTION_RECEIPT, addReceiptToTx);

    const addReward = this.addReward(publicKey);
    this.retrieveRewards(binaryAccountId)
      .then((value) => value.forEach(addReward))
      .catch((err) => {
        this.logger.error('Can not retrieve and store rewards', err);
      });

    this.glStateService.listenRewardsByCoinbase(binaryAccountId, addReward);

    this.updateAppStateTxs(publicKey);
    this.updateAppStateRewards(publicKey);
  };

  addAccount = (account: Account) => {
    const idx = this.accounts.findIndex(
      (acc) => acc.publicKey === account.publicKey
    );
    const filtered =
      idx > -1
        ? this.accounts
            .slice(0, Math.max(0, idx - 1))
            .concat(this.accounts.slice(idx + 1))
        : this.accounts;
    this.accounts = [...filtered, account];
    const accManager = new AccountStateManager(account.publicKey, this.netId);
    this.accountStates[account.publicKey] = accManager;
    // Resubscribe
    this.subscribeAccount(account);
  };

  setAccounts = (accounts: Account[]) => {
    accounts.forEach(this.addAccount);
  };

  private upsertTransaction = (accountId: HexString) => async (tx: Tx) => {
    const originalTx = this.accountStates[accountId].getTxById(tx.id);
    const receipt = tx.receipt
      ? { ...originalTx?.receipt, ...tx.receipt }
      : originalTx?.receipt;
    const updatedTx: Tx = { ...originalTx, ...tx, receipt };
    await this.storeTx(accountId, updatedTx);
    this.subscribeTransactions(accountId);
  };

  private upsertTransactionFromMesh = (accountId: HexString) => async (
    tx: TxHandlerArg
  ) => {
    if (!tx || !tx?.transaction?.id?.id || !tx.layerId) return;
    const newTxData = toTx(tx.transaction, null);
    if (!newTxData) return;
    this.upsertTransaction(accountId)({
      ...newTxData,
      ...(tx.layerId?.number ? { layer: tx.layerId.number } : {}),
    });
  };

  retrieveHistoricTxData = async ({
    accountId,
    offset,
    handler,
    retries,
  }: {
    accountId: Uint8Array;
    offset: number;
    handler: TxHandler;
    retries: number;
  }) => {
    const {
      data,
      totalResults,
      error,
    } = await this.meshService.requestMeshTransactions(accountId, offset);
    if (error && retries < 5) {
      await this.retrieveHistoricTxData({
        accountId,
        offset,
        handler,
        retries: retries + 1,
      });
    } else {
      data && data.length && data.forEach((tx) => handler(tx.meshTransaction));
      if (offset + DATA_BATCH < totalResults) {
        await this.retrieveHistoricTxData({
          accountId,
          offset: offset + DATA_BATCH,
          handler,
          retries: 0,
        });
      }
    }
  };

  updateAccountData = ({ accountId }: { accountId: string }) => (
    data: Account__Output
  ) => {
    const currentState = {
      counter: data.stateCurrent?.counter?.toNumber?.() || 0,
      balance: data.stateCurrent?.balance?.value?.toNumber() || 0,
    };
    const projectedState = {
      counter: data.stateProjected?.counter?.toNumber?.() || 0,
      balance: data.stateProjected?.balance?.value?.toNumber() || 0,
    };
    this.accountStates[accountId].storeAccountBalance({
      currentState,
      projectedState,
    });

    this.updateAppStateAccount(accountId);
  };

  retrieveAccountData = async <F extends AccountDataValidFlags>({
    filter,
    handler,
    retries,
  }: {
    filter: {
      accountId: { address: Uint8Array };
      accountDataFlags: F;
    };
    handler: (data: AccountDataStreamHandlerArg[F]) => void;
    retries: number;
  }) => {
    const { data, error } = await this.glStateService.sendAccountDataQuery({
      filter,
      offset: 0,
    });
    if (error && retries < 5) {
      await this.retrieveAccountData({
        filter,
        handler,
        retries: retries + 1,
      });
    } else {
      data?.length > 0 && handler(data[0]);
    }
  };

  addReceiptToTx = ({ accountId }: { accountId: string }) => ({
    datum,
  }: {
    datum: AccountData__Output;
  }) => {
    const { receipt } = datum;
    if (!receipt || !receipt.id?.id) return;

    const txId = toHexString(receipt.id.id);
    const existingTx = this.accountStates[accountId].getTxById(txId) || {};
    // TODO: Handle properly case when we got an receipt, but no tx data?
    const updatedTx = addReceiptToTx(existingTx, receipt);
    this.storeTx(accountId, updatedTx);
  };

  addReward = (accountId: HexString) => (reward: RewardHandlerArg) => {
    if (!reward || !hasRequiredRewardFields(reward)) return;

    const coinbase = toHexString(reward.coinbase.address);
    const parsedReward: Reward = {
      layer: reward.layer.number,
      amount: reward.total.value.toNumber(),
      layerReward: reward.layerReward.value.toNumber(),
      // layerComputed: reward.layerComputed.number, // TODO
      coinbase: `0x${coinbase}`,
    };
    this.storeReward(accountId, parsedReward);
  };

  retrieveRewards = async (coinbase: Uint8Array): Promise<Reward__Output[]> => {
    const composeArg = (batchNumber: number) => ({
      filter: {
        accountId: { address: coinbase },
        accountDataFlags: AccountDataFlag.ACCOUNT_DATA_FLAG_REWARD as AccountDataValidFlags,
      },
      offset: batchNumber * BATCH_SIZE,
    });
    const getAccountDataQuery = async (batch: number, retries = 5) => {
      const res = await this.glStateService.sendAccountDataQuery(
        composeArg(batch)
      );
      if (res.error && retries > 0) {
        await delay(1000);
        return getAccountDataQuery(batch, retries - 1);
      }
      return res;
    };
    const { totalResults, data } = await getAccountDataQuery(0);
    if (totalResults <= BATCH_SIZE) {
      const r: Reward__Output[] = data.filter(
        (item): item is Reward__Output =>
          !!item && hasRequiredRewardFields(item)
      );
      return r;
    } else {
      const nextRewards = await Promise.all(
        R.compose(
          R.map((idx) =>
            this.glStateService
              .sendAccountDataQuery(composeArg(idx))
              .then((resp) => resp.data)
          ),
          R.range(1)
        )(Math.ceil(totalResults / BATCH_SIZE))
      ).then(R.unnest);
      return data ? [...data, ...nextRewards] : nextRewards;
    }
  };

  sendTx = async ({
    fullTx,
    accountIndex,
  }: {
    fullTx: TxSendRequest;
    accountIndex: number;
  }) => {
    const { publicKey } = this.accounts[accountIndex];
    const account = this.accountStates[publicKey].getAccount();
    const { receiver, amount, fee } = fullTx;
    const res = await cryptoService.signTransaction({
      accountNonce: account.projectedState.counter,
      receiver,
      price: fee,
      amount,
      secretKey: this.accounts[accountIndex].secretKey,
    });
    const response = await this.txService.submitTransaction({
      transaction: res,
    });
    const getTxResponseError = () =>
      new Error('Can not retrieve a transaction data');

    // TODO: Refactor to avoid mixing data with errors and then get rid of insane ternaries for each data piece
    const error =
      response.error || response.txstate === null || !response.txstate.id?.id
        ? response.error || getTxResponseError()
        : null;
    // Compose "initial" transaction record
    const tx: TxCoinTransfer | null =
      response.error === null && response.txstate?.id?.id
        ? {
            id: toHexString(response.txstate.id.id),
            sender: fullTx.sender,
            receiver: fullTx.receiver,
            amount: fullTx.amount,
            status: response.txstate.state,
            receipt: {
              fee: fullTx.fee,
            },
          }
        : null;
    const state =
      response.error === null && response.txstate?.state
        ? response.txstate.state
        : null;

    if (
      tx &&
      state &&
      ![
        TxState.TRANSACTION_STATE_INSUFFICIENT_FUNDS,
        TxState.TRANSACTION_STATE_REJECTED,
        TxState.TRANSACTION_STATE_CONFLICTING,
      ].includes(state)
    ) {
      this.upsertTransaction(publicKey)(tx);
    }
    return { error, tx, state };
  };

  updateTxNote = ({
    accountIndex,
    txId,
    note,
  }: {
    accountIndex: number;
    txId: HexString;
    note: string;
  }) => {
    const { publicKey } = this.accounts[accountIndex];
    const tx = this.accountStates[publicKey].getTxById(txId);
    this.storeTx(publicKey, { ...tx, note });
  };
}

export default TransactionManager;
