import * as R from 'ramda';
import { BrowserWindow } from 'electron';
import { TemplateRegistry, SingleSigTemplate } from '@spacemesh/sm-codec';
import Bech32 from '@spacemesh/address-wasm';
import {
  KeyPair,
  AccountWithBalance,
  HexString,
  Reward,
  Tx,
  TxCoinTransfer,
  TxSendRequest,
  TxState,
  Bech32Address,
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
import { delay } from '../shared/utils';
import { getISODate } from '../shared/datetime';
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
import HRP from '../shared/hrp';

const DATA_BATCH = 50;

type TxHandlerArg = MeshTransaction__Output | null | undefined;
type TxHandler = (tx: TxHandlerArg) => void;

type RewardHandlerArg = Reward__Output | null | undefined;

class TransactionManager {
  logger = Logger({ className: 'TransactionManager' });

  private readonly meshService: MeshService;

  private readonly glStateService: GlobalStateService;

  private readonly txService: TransactionService;

  keychain: KeyPair[] = [];

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
  updateAppStateAccount = (address: string) => {
    const account = this.accountStates[address]?.getAccount();
    if (!account) {
      return;
    }
    this.appStateUpdater(ipcConsts.T_M_UPDATE_ACCOUNT, {
      account,
      accountId: address,
    });
  };

  updateAppStateTxs = (publicKey: string) => {
    const txs = this.accountStates[publicKey]?.getTxs() || {};
    this.appStateUpdater(ipcConsts.T_M_UPDATE_TXS, { txs, publicKey });
  };

  updateAppStateRewards = (publicKey: string) => {
    const rewards = this.accountStates[publicKey]?.getRewards() || {};
    this.appStateUpdater(ipcConsts.T_M_UPDATE_REWARDS, { rewards, publicKey });
  };

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

  private subscribeTransactions = (publicKey: string) => {
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
  };

  private subscribeAccount = (address: Bech32Address): void => {
    // Cancel account Txs subscription
    this.txStateStream[address]?.();
    const addTransaction = this.upsertTransactionFromMesh(address);
    this.retrieveHistoricTxData({
      accountId: address,
      offset: 0,
      handler: addTransaction,
      retries: 0,
    });
    this.meshService.listenMeshTransactions(address, addTransaction);

    const updateAccountData = this.updateAccountData(address);
    this.retrieveAccountData({
      filter: {
        accountId: { address },
        accountDataFlags: AccountDataFlag.ACCOUNT_DATA_FLAG_ACCOUNT,
      },
      handler: updateAccountData,
      retries: 0,
    });
    this.glStateService.activateAccountDataStream(
      address,
      AccountDataFlag.ACCOUNT_DATA_FLAG_ACCOUNT,
      updateAccountData
    );

    const txs = Object.keys(this.accountStates[address]?.getTxs() || {});
    if (txs.length > 0) {
      this.subscribeTransactions(address);
    }

    // TODO: https://github.com/spacemeshos/go-spacemesh/issues/2072
    // const addReceiptToTx = this.addReceiptToTx({ accountId: publicKey });
    // this.retrieveHistoricTxReceipt({ filter: { accountId: { address: binaryAccountId }, accountDataFlags: 1 }, offset: 0, handler: addReceiptToTx, retries: 0 });
    // this.glStateService.activateAccountDataStream(binaryAccountId, AccountDataFlag.ACCOUNT_DATA_FLAG_TRANSACTION_RECEIPT, addReceiptToTx);

    const addReward = this.addReward(address);
    this.retrieveRewards(address)
      .then((value) => value.forEach(addReward))
      .catch((err) => {
        this.logger.error('Can not retrieve and store rewards', err);
      });

    this.glStateService.listenRewardsByCoinbase(address, addReward);

    this.updateAppStateTxs(address);
    this.updateAppStateRewards(address);
  };

  addAccount = (keypair: KeyPair) => {
    const { publicKey } = keypair;
    const pkBytes = fromHexString(publicKey.substring(24));
    const tpl = TemplateRegistry.get(SingleSigTemplate.key, 0);
    const principal = tpl.principal({ PublicKey: pkBytes });
    const address = Bech32.generateAddress(principal);

    // TODO: Step depending on index in two separate arrays!
    const idx = this.accounts.findIndex((acc) => acc.address === address);
    this.accounts = [
      ...(idx > -1
        ? this.accounts
            .slice(0, Math.max(0, idx - 1))
            .concat(this.accounts.slice(idx + 1))
        : this.accounts),
      {
        displayName: keypair.displayName,
        created: getISODate(),
        address,
        spawnArgs: { PublicKey: pkBytes },
      },
    ];
    this.keychain = [
      ...(idx > -1
        ? this.keychain
            .slice(0, Math.max(0, idx - 1))
            .concat(this.keychain.slice(idx + 1))
        : this.keychain),
      keypair,
    ];
    const accManager = new AccountStateManager(address, this.netId);
    this.accountStates[address] = accManager;
    // Resubscribe
    this.subscribeAccount(address);
  };

  setAccounts = (accounts: KeyPair[]) => {
    accounts.forEach(this.addAccount);
  };

  private upsertTransaction = (accountId: HexString) => async <T>(
    tx: Tx<T>
  ) => {
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
    if (!tx || !tx?.transaction?.id || !tx.layerId) return;
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
    accountId: string;
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

  updateAccountData = (address: string) => (data: Account__Output) => {
    const currentState = {
      counter: data.stateCurrent?.counter?.toNumber?.() || 0,
      balance: data.stateCurrent?.balance?.value?.toNumber() || 0,
    };
    const projectedState = {
      counter: data.stateProjected?.counter?.toNumber?.() || 0,
      balance: data.stateProjected?.balance?.value?.toNumber() || 0,
    };
    this.accountStates[address]?.storeAccountBalance({
      currentState,
      projectedState,
    });

    this.updateAppStateAccount(address);
  };

  retrieveAccountData = async <F extends AccountDataValidFlags>({
    filter,
    handler,
    retries,
  }: {
    filter: {
      accountId: { address: string };
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

    const parsedReward: Reward = {
      layer: reward.layer.number,
      amount: reward.total.value.toNumber(),
      layerReward: reward.layerReward.value.toNumber(),
      // layerComputed: reward.layerComputed.number, // TODO
      coinbase: reward.coinbase.address,
    };
    this.storeReward(accountId, parsedReward);
  };

  retrieveRewards = async (coinbase: string): Promise<Reward__Output[]> => {
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

  signTx = (secretKey: Uint8Array, rawData: Uint8Array) =>
    new Promise<Uint8Array>((resolve) => {
      // @ts-ignore
      global.__signTransaction(secretKey, rawData, resolve);
    });

  sendTx = async ({
    fullTx,
    accountIndex,
  }: {
    fullTx: TxSendRequest;
    accountIndex: number;
  }) => {
    try {
      const { publicKey, secretKey } = this.keychain[accountIndex];
      // TODO: Detach indexes
      const { projectedState } = this.accounts[accountIndex];
      // const account = this.accountStates[publicKey].getAccount();
      const { receiver, amount, fee } = fullTx;
      // TODO: SPAWN:
      const tpl = TemplateRegistry.get(SingleSigTemplate.key, 0);
      const spawnArgs = { PublicKey: fromHexString(publicKey) };
      const principal = tpl.principal(spawnArgs);
      const txEncoded = tpl.encode(principal, {
        TemplateAddress: SingleSigTemplate.publicKey,
        Nonce: {
          Counter: BigInt(projectedState?.counter || 1),
          Bitfield: BigInt(1),
        },
        GasPrice: BigInt(fee),
        Arguments: spawnArgs,
      });
      // TODO: SPEND:
      // const tpl = TemplateRegistry.get(SingleSigTemplate.key, 1);
      // const principal = tpl.principal({ PublicKey: fromHexString(publicKey) });
      // const txEncoded = tpl.encode(principal, {
      //   Arguments: {
      //     Destination: fromHexString(receiver),
      //     Amount: BigInt(amount),
      //   },
      //   Nonce: {
      //     Counter: BigInt(projectedState?.counter || 1),
      //     Bitfield: BigInt(1),
      //   },
      //   GasPrice: BigInt(fee),
      // });
      console.log('txEncoded', txEncoded);
      const sig = await this.signTx(fromHexString(secretKey), txEncoded);
      console.log('tx sig', sig);
      const signed = tpl.sign(txEncoded, sig);
      console.log('tx signed', signed);
      const response = await this.txService.submitTransaction({
        transaction: signed,
      });
      console.log('tx response', response);
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
              principal: Bech32.generateAddress(principal),
              receiver: Bech32.generateAddress(fromHexString(fullTx.receiver)),
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
    } catch (err) {
      console.log('tx send caught error: ', err);
      return {
        error: err,
        tx: null,
        state: null,
      };
    }
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
    const { address } = this.accounts[accountIndex];
    const tx = this.accountStates[address].getTxById(txId);
    this.storeTx(address, { ...tx, note });
  };
}

export default TransactionManager;
