import { BrowserWindow } from 'electron';
import { SingleSigTemplate, TemplateRegistry } from '@spacemesh/sm-codec';
import Bech32 from '@spacemesh/address-wasm';
import {
  AccountWithBalance,
  asTx,
  Bech32Address,
  HexString,
  KeyPair,
  Reward,
  toTxState,
  Tx,
  TxSendRequest,
  TxState,
} from '../shared/types';
import { ipcConsts } from '../app/vars';
import { AccountDataFlag } from '../proto/spacemesh/v1/AccountDataFlag';
import { Transaction__Output } from '../proto/spacemesh/v1/Transaction';
import { TransactionState__Output } from '../proto/spacemesh/v1/TransactionState';
import { MeshTransaction__Output } from '../proto/spacemesh/v1/MeshTransaction';
import { Reward__Output } from '../proto/spacemesh/v1/Reward';
import { Account__Output } from '../proto/spacemesh/v1/Account';
import { hasRequiredRewardFields } from '../shared/types/guards';
import {
  delay,
  fromHexString,
  longToNumber,
  toHexString,
} from '../shared/utils';
import { getMethodName, getTemplateName } from '../shared/templateMeta';
import { SingleSigMethods } from '../shared/templateConsts';
import { MINUTE } from '../shared/constants';
import { toTx } from './transformers';
import TransactionService from './TransactionService';
import MeshService from './MeshService';
import GlobalStateService, {
  AccountDataStreamHandlerArg,
  AccountDataValidFlags,
} from './GlobalStateService';
import { AccountStateManager } from './AccountState';
import Logger from './logger';
import { GRPC_QUERY_BATCH_SIZE } from './main/constants';
import { sign } from './ed25519';
import AbstractManager from './AbstractManager';

type TxHandlerArg = MeshTransaction__Output | null | undefined;
type TxHandler = (tx: TxHandlerArg) => void;

type RewardHandlerArg = Reward__Output | null | undefined;

class TransactionManager extends AbstractManager {
  logger = Logger({ className: 'TransactionManager' });

  private readonly meshService: MeshService;

  private readonly glStateService: GlobalStateService;

  private readonly txService: TransactionService;

  subscribeIPCEvents(): () => void {
    return () => {};
  }

  keychain: KeyPair[] = [];

  accounts: AccountWithBalance[] = [];

  private txStateStream: Record<
    string,
    ReturnType<TransactionService['activateTxStream']>
  > = {};

  private accountStates: Record<string, AccountStateManager> = {};

  private unsubs: Record<Bech32Address, (() => void)[]> = {};

  private genesisID: string;

  constructor(
    meshService: MeshService,
    glStateService: GlobalStateService,
    txService: TransactionService,
    mainWindow: BrowserWindow,
    genesisID: string
  ) {
    super(mainWindow);
    this.meshService = meshService;
    this.glStateService = glStateService;
    this.txService = txService;
    this.genesisID = genesisID;
  }

  setGenesisID(id: HexString) {
    this.genesisID = id;
  }

  unsubscribeAllStreams = () => {
    Object.values(this.unsubs).forEach((list) =>
      list.forEach((unsub) => unsub())
    );
    this.unsubs = {};
  };

  //
  appStateUpdater = (channel: ipcConsts, payload: any) => {
    this.mainWindow.webContents.send(channel, { ...payload });
  };

  // Debounce update functions to avoid excessive IPC calls
  updateAppStateAccount = (address: string) => {
    const account = this.accountStates[address].getState();
    if (!account) {
      this.logger.error(
        'updateAppStateAccount',
        `Account not found: ${address}`
      );
      return;
    }
    this.appStateUpdater(ipcConsts.T_M_UPDATE_ACCOUNT, {
      account,
      accountId: address,
    });
  };

  updateAppStateTxs = (publicKey: string) => {
    const txs = this.accountStates[publicKey].getTxs() || {};
    this.appStateUpdater(ipcConsts.T_M_UPDATE_TXS, { txs, publicKey });
  };

  updateAppStateRewards = (publicKey: string) => {
    const rewards = this.accountStates[publicKey].getRewards() || [];
    this.appStateUpdater(ipcConsts.T_M_UPDATE_REWARDS, { rewards, publicKey });
  };

  sendTxToRenderer = (address: Bech32Address, tx: Tx<any>) => {
    this.appStateUpdater(ipcConsts.T_M_ADD_TX, { address, tx });
  };

  sendRewardToRenderer = (address: Bech32Address, reward: Reward) => {
    this.appStateUpdater(ipcConsts.T_M_ADD_REWARD, { address, reward });
  };

  private storeTx = (publicKey: string, tx: Tx): Promise<boolean> =>
    this.accountStates[publicKey]
      .storeTransaction(tx)
      .then((isNew) => {
        isNew && this.sendTxToRenderer(publicKey, tx);
        return true;
      })
      .catch((err) => {
        this.logger.error('TransactionManager.storeTx', err);
        return false;
      });

  private storeReward = (publicKey: string, reward: Reward) =>
    this.accountStates[publicKey]
      .storeReward(reward)
      .then((isNew) => isNew && this.sendRewardToRenderer(publicKey, reward))
      .catch((err) => {
        this.logger.error('TransactionManager.storeReward', err);
      });

  private overwriteRewards = (address: Bech32Address, rewards: Reward[]) =>
    this.accountStates[address]
      .overwriteRewards(rewards)
      .then(() => this.updateAppStateRewards(address))
      .catch((err) => {
        this.logger.error('TransactionManager.overwriteRewards', err);
      });

  private handleNewTx = (publicKey: string) => async (tx: {
    transaction: Transaction__Output | null;
    transactionState: TransactionState__Output | null;
  }) => {
    if (!tx.transaction || !tx.transactionState || !tx.transactionState.state) {
      this.logger.error('handleNewTx', 'Not a valid tx', tx);
      return;
    }
    const newTx = toTx(tx.transaction, toTxState(tx.transactionState.state));
    if (!newTx) {
      this.logger.error(
        'handleNewTx',
        'Cannot convert tx&txState into Tx type',
        tx
      );
      return;
    }
    await this.upsertTransaction(publicKey)(newTx);
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
  };

  private subscribeAccount = (address: Bech32Address): void => {
    this.logger.log('subscribeAccount', address);
    // Cancel account Txs subscription
    this.txStateStream[address]?.();

    const addTransaction = this.upsertTransactionFromMesh(address);
    this.retrieveHistoricTxData({
      accountId: address,
      offset: 0,
      handler: addTransaction,
      retries: 0,
    });
    this.unsubs[address].push(
      this.meshService.listenMeshTransactions(address, addTransaction)
    );

    const updateAccountData = this.updateAccountData(address);
    this.retrieveAccountData({
      filter: {
        accountId: { address },
        accountDataFlags: AccountDataFlag.ACCOUNT_DATA_FLAG_ACCOUNT,
      },
      handler: updateAccountData,
    });

    this.unsubs[address].push(
      this.glStateService.activateAccountDataStream(
        address,
        AccountDataFlag.ACCOUNT_DATA_FLAG_ACCOUNT,
        updateAccountData
      )
    );

    this.unsubs[address].push(
      this.txService.watchTransactionsByAddress(address, (txRes) => {
        if (!txRes.tx) return;
        const state = toTxState(TxState.PROCESSED, txRes.status || 0);
        const tx = toTx(txRes.tx, state);
        if (!tx) return;
        this.upsertTransaction(address)({
          ...tx,
          layer: txRes.layer,
        });
      })
    );

    const txs = Object.keys(this.accountStates[address].getTxs() || {});
    if (txs.length > 0) {
      this.subscribeTransactions(address);
    }

    const addReward = this.addReward(address);
    this.retrieveRewards(address, 0)
      .then((rewards) => this.replaceRewards(address, rewards))
      .catch((err) => {
        this.logger.error('Can not retrieve and store rewards', err);
      });

    this.unsubs[address].push(
      this.glStateService.listenRewardsByCoinbase(address, addReward)
    );
  };

  watchForAddress = (address: Bech32Address) => {
    // Postponing it for the next tick to avoid race condition
    // and subscribing twice for the same address (in some cases)
    setImmediate(() => {
      if (this.accountStates[address]) {
        this.logger.log(
          'watchForAccount',
          'already watching, skipping function call',
          address
        );
        return;
      }
      this.logger.log('watchForAccount', 'started', address);

      this.accountStates[address] = new AccountStateManager(
        address,
        this.genesisID
      );
      this.logger.log('addAccount', address, this.genesisID);

      // Send stored Tx & Rewards
      this.updateAppStateTxs(address);
      this.updateAppStateRewards(address);

      this.unsubs[address] = [];
      // Resubscribe
      this.subscribeAccount(address);
    });
  };

  watchForKeyPair = (keypair: KeyPair) => {
    const { publicKey } = keypair;
    const pkBytes = fromHexString(publicKey);
    const tpl = TemplateRegistry.get(SingleSigTemplate.key, 0);
    const principal = tpl.principal({ PublicKey: pkBytes });
    const address = Bech32.generateAddress(principal);

    const idx = this.keychain.findIndex((kp) => kp.publicKey === publicKey);
    this.keychain = [
      ...(idx > -1
        ? this.keychain
            .slice(0, Math.max(0, idx - 1))
            .concat(this.keychain.slice(idx + 1))
        : this.keychain),
      keypair,
    ];

    this.watchForAddress(address);
  };

  setAccounts = (accounts: KeyPair[]) => {
    this.unsubscribeAllStreams();
    this.keychain = [];
    this.accountStates = {};
    accounts.forEach(this.watchForKeyPair);
  };

  private upsertTransaction = (accountAddress: Bech32Address) => async <T>(
    tx: Tx<T>
  ) => {
    if (!this.accountStates[accountAddress]) {
      this.logger.error(
        'upsertTransaction',
        `AccountState for ${accountAddress} not found`
      );
      return;
    }
    const originalTx = this.accountStates[accountAddress].getTxById(tx.id);
    const receipt = tx.receipt
      ? { ...originalTx?.receipt, ...tx.receipt }
      : originalTx?.receipt;
    // Do not downgrade status from SUCCESS/FAILURE/INVALID
    let { status } = tx;
    if (
      originalTx?.status > TxState.PROCESSED &&
      originalTx?.status > tx.status
    ) {
      status = originalTx.status;
    }
    const updatedTx: Tx = { ...originalTx, ...tx, status, receipt };
    await this.storeTx(accountAddress, updatedTx);
    this.subscribeTransactions(accountAddress);
  };

  private upsertTransactionFromMesh = (accountAddress: Bech32Address) => async (
    tx: TxHandlerArg
  ) => {
    if (!tx || !tx?.transaction?.id || !tx.layerId) {
      this.logger.error(
        'upsertTransactionFromMesh',
        'Transaction is not valid',
        tx
      );
      return;
    }
    const newTxData = toTx(tx.transaction, null);
    if (!newTxData) {
      this.logger.error(
        'upsertTransactionFromMesh',
        'Cannot convert transaction message into Tx type',
        tx
      );
      return;
    }
    this.upsertTransaction(accountAddress)({
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
      await delay(1000);
      await this.retrieveHistoricTxData({
        accountId,
        offset,
        handler,
        retries: retries + 1,
      });
    } else {
      data && data.length && data.forEach((tx) => handler(tx.meshTransaction));
      if (offset + GRPC_QUERY_BATCH_SIZE < totalResults) {
        delay(100);
        await this.retrieveHistoricTxData({
          accountId,
          offset: offset + GRPC_QUERY_BATCH_SIZE,
          handler,
          retries: 0,
        });
      }
    }
  };

  updateAccountData = (address: string) => (data: Account__Output) => {
    if (!this.accountStates[address]) {
      this.logger.error('updateAccountData', `No AccountState for ${address}`);
      return;
    }

    const currentState = {
      counter: longToNumber(data.stateCurrent?.counter || 0),
      balance: longToNumber(data.stateCurrent?.balance?.value || 0),
    };
    const projectedState = {
      counter: longToNumber(data.stateProjected?.counter || 0),
      balance: longToNumber(data.stateProjected?.balance?.value || 0),
    };

    this.logger.log('updateAccountData', {
      address,
      currentState,
      projectedState,
    });

    this.accountStates[address] &&
      this.accountStates[address].storeState({
        currentState,
        projectedState,
      });

    this.updateAppStateAccount(address);
  };

  retrieveAccountData = async <F extends AccountDataValidFlags>({
    filter,
    handler,
  }: {
    filter: {
      accountId: { address: string };
      accountDataFlags: F;
    };
    handler: (data: AccountDataStreamHandlerArg[F]) => void;
  }) => {
    const { data, error } = await this.glStateService.sendAccountDataQuery(
      {
        filter,
        offset: 0,
      },
      30
    );
    if (data?.length > 0) {
      handler(data[0]);
      this.logger.log('retrieveAccountData', data);
    }
    if (error) {
      this.logger.error('retrieveAccountData', error, filter);
      await delay(MINUTE);
      await this.retrieveAccountData({ filter, handler });
    }
  };

  private parseReward = (reward: RewardHandlerArg): Reward => {
    if (!reward || !hasRequiredRewardFields(reward)) {
      this.logger.error(
        'parseReward',
        'Object is not a valid Reward type',
        reward
      );
      throw new Error(
        `Object is not a valid Reward type: ${JSON.stringify(reward)}`
      );
    }
    return {
      layer: reward.layer.number,
      amount: longToNumber(reward.total.value),
      layerReward: longToNumber(reward.layerReward.value),
      coinbase: reward.coinbase.address,
    };
  };

  replaceRewards = (address: Bech32Address, rewards: Reward__Output[]) => {
    try {
      const parsedRewards = rewards.map(this.parseReward);
      this.overwriteRewards(address, parsedRewards);
    } catch (err) {
      this.logger.error('replaceRewards', err, {
        address,
        rewardsAmount: rewards.length,
      });
    }
  };

  addReward = (address: HexString) => (reward: RewardHandlerArg) => {
    try {
      const parsedReward = this.parseReward(reward);
      this.storeReward(address, parsedReward);
    } catch (err) {
      this.logger.error('addReward', err, { address, reward });
    }
  };

  retrieveRewards = async (
    coinbase: string,
    offset = 0
  ): Promise<Reward__Output[]> => {
    const composeArg = (batchNumber: number) => ({
      filter: {
        accountId: { address: coinbase },
        accountDataFlags: AccountDataFlag.ACCOUNT_DATA_FLAG_REWARD as AccountDataValidFlags,
      },
      offset: offset + batchNumber * GRPC_QUERY_BATCH_SIZE,
    });
    const getAccountDataQuery = async (batch: number, retries = 5) => {
      const res = await this.glStateService.sendAccountDataQuery(
        composeArg(batch)
      );
      if (res.error && retries > 0) {
        this.logger.debug(
          `retrieveRewards (retry ${retries})`,
          res,
          composeArg(batch)
        );
        await delay(1000);
        return getAccountDataQuery(batch, retries - 1);
      }
      return res;
    };
    const { totalResults, data } = await getAccountDataQuery(0);
    if (totalResults <= GRPC_QUERY_BATCH_SIZE) {
      return data.filter(
        (item): item is Reward__Output =>
          !!item && hasRequiredRewardFields(item)
      ) as Reward__Output[];
    } else {
      await delay(100);
      const nextRewards = await this.retrieveRewards(
        coinbase,
        offset + GRPC_QUERY_BATCH_SIZE
      );
      return data ? [...data, ...nextRewards] : nextRewards;
    }
  };

  getMaxGasFromEncodedTx = async (transaction: Uint8Array) => {
    const parsed = await this.txService.parseTransaction({
      transaction,
    });
    if (parsed.error || !parsed.tx) return 0;
    return longToNumber(parsed.tx.maxGas);
  };

  getMaxGas = async (
    tplAddress: Parameters<typeof TemplateRegistry.get>[0],
    tplMethod: Parameters<typeof TemplateRegistry.get>[1],
    tplPayload: any,
    accountIndex: number
  ) => {
    const { publicKey, secretKey } = this.keychain[accountIndex];
    const tpl = TemplateRegistry.get(tplAddress, tplMethod);

    const spawnArgs = { PublicKey: fromHexString(publicKey) };
    const principal = tpl.principal(spawnArgs);
    const address = Bech32.generateAddress(principal);

    const { projectedState } = this.accountStates[address].getState();

    // TODO: Do not stick to SingleSig template
    const getSingleSigPayload = () => {
      switch (tplMethod) {
        case SingleSigMethods.Spawn: {
          const { fee } = tplPayload;
          // SelfSpawn
          return {
            Nonce: BigInt(projectedState?.counter || 0),
            GasPrice: BigInt(fee),
            Arguments: spawnArgs,
          };
        }
        case SingleSigMethods.Spend: {
          const { receiver, amount, fee } = tplPayload;
          // Spend
          return {
            Arguments: {
              Destination: Bech32.parse(receiver),
              Amount: BigInt(amount),
            },
            Nonce: BigInt(projectedState?.counter || 1),
            GasPrice: BigInt(fee),
          };
        }
        default:
          throw new Error('Cannot encode Transaction for unknown method');
      }
    };

    const txEncoded = tpl.encode(principal, getSingleSigPayload());
    const genesisID = await this.meshService.getGenesisID();
    const sig = sign(new Uint8Array([...genesisID, ...txEncoded]), secretKey);
    const signed = tpl.sign(txEncoded, sig);

    return this.getMaxGasFromEncodedTx(signed);
  };

  // TODO: Replace with generic `publishTx`
  publishSelfSpawn = async (fee: number, accountIndex: number) => {
    try {
      const { publicKey, secretKey } = this.keychain[accountIndex];
      const tpl = TemplateRegistry.get(SingleSigTemplate.key, 0);
      const spawnArgs = { PublicKey: fromHexString(publicKey) };
      const principal = tpl.principal(spawnArgs);
      const address = Bech32.generateAddress(principal);
      const { projectedState } = this.accountStates[address].getState();
      const payload = {
        Nonce: BigInt(projectedState?.counter || 0),
        GasPrice: BigInt(fee),
        Arguments: spawnArgs,
      };
      const txEncoded = tpl.encode(principal, payload);
      const genesisID = await this.meshService.getGenesisID();
      const sig = sign(new Uint8Array([...genesisID, ...txEncoded]), secretKey);
      const signed = tpl.sign(txEncoded, sig);
      const maxGas = await this.getMaxGasFromEncodedTx(signed);
      const response = await this.txService.submitTransaction({
        transaction: signed,
      });
      const getTxResponseError = () =>
        new Error('Can not retrieve a transaction data');

      // TODO: Refactor to avoid mixing data with errors and then get rid of insane ternaries for each data piece
      const error =
        response.error || response.txstate === null || !response.txstate.id?.id
          ? response.error || getTxResponseError()
          : null;
      const { currentLayer } = await this.meshService.getCurrentLayer();
      // Compose "initial" transaction record
      const method = 0;
      const tx =
        response.error === null && response.txstate?.id?.id
          ? asTx({
              id: toHexString(response.txstate.id.id),
              template: Bech32.generateAddress(SingleSigTemplate.publicKey),
              method,
              principal: address,
              gas: {
                gasPrice: fee,
                maxGas,
                fee: fee * maxGas,
              },
              status: toTxState(response.txstate.state),
              payload,
              meta: {
                templateName: getTemplateName(SingleSigTemplate.publicKey),
                methodName: getMethodName(SingleSigTemplate.publicKey, method),
              },
              layer: currentLayer,
            })
          : null;
      tx &&
        this.upsertTransaction(address)({
          ...tx,
          payload: {
            ...tx.payload,
            Arguments: {
              ...tx.payload.Arguments,
              PublicKey: publicKey,
            },
          },
        });

      // TODO: Get rid of this call when we migrate to go-spacemesh
      //       with this fix of the issue https://github.com/spacemeshos/go-spacemesh/issues/3687
      this.retrieveAccountData({
        filter: {
          accountId: { address },
          accountDataFlags: AccountDataFlag.ACCOUNT_DATA_FLAG_ACCOUNT,
        },
        handler: this.updateAccountData(address),
      });

      return { error, tx };
    } catch (err) {
      this.logger.error('publishSelfSpawn', err);
      return {
        error: err,
        tx: null,
      };
    }
  };

  publishSpendTx = async ({
    fullTx,
    accountIndex,
  }: {
    fullTx: TxSendRequest;
    accountIndex: number;
  }) => {
    try {
      const { publicKey, secretKey } = this.keychain[accountIndex];
      const method = 16;
      const tpl = TemplateRegistry.get(SingleSigTemplate.key, method);
      const principal = tpl.principal({
        PublicKey: fromHexString(publicKey),
      });
      const address = Bech32.generateAddress(principal);
      const { projectedState } = this.accountStates[address].getState();
      const { receiver, amount, fee } = fullTx;
      const payload = {
        Arguments: {
          Destination: Bech32.parse(receiver),
          Amount: BigInt(amount),
        },
        Nonce: BigInt(projectedState?.counter || 1),
        GasPrice: BigInt(fee),
      };
      const txEncoded = tpl.encode(principal, payload);
      const genesisID = await this.meshService.getGenesisID();
      const sig = sign(new Uint8Array([...genesisID, ...txEncoded]), secretKey);
      const signed = tpl.sign(txEncoded, sig);
      const maxGas = await this.getMaxGasFromEncodedTx(signed);
      const response = await this.txService.submitTransaction({
        transaction: signed,
      });
      const getTxResponseError = () =>
        new Error('Can not retrieve a transaction data');

      // TODO: Refactor to avoid mixing data with errors and then get rid of insane ternaries for each data piece
      const error =
        response.error || response.txstate === null || !response.txstate.id?.id
          ? response.error || getTxResponseError()
          : null;
      // Compose "initial" transaction record
      const { currentLayer } = await this.meshService.getCurrentLayer();
      const tx =
        response.error === null && response.txstate?.id?.id
          ? asTx({
              id: toHexString(response.txstate.id.id),
              template: Bech32.generateAddress(SingleSigTemplate.publicKey),
              method,
              principal: address,
              gas: {
                gasPrice: fee,
                maxGas,
                fee: fee * maxGas,
              },
              status: toTxState(response.txstate.state),
              payload: {
                ...payload,
                Arguments: {
                  ...payload.Arguments,
                  Destination: Bech32.generateAddress(
                    payload.Arguments.Destination
                  ),
                },
              },
              meta: {
                templateName: getTemplateName(SingleSigTemplate.publicKey),
                methodName: getMethodName(SingleSigTemplate.publicKey, method),
              },
              layer: currentLayer,
              ...((fullTx.note && { note: fullTx.note }) || {}),
            })
          : null;

      tx && this.upsertTransaction(address)(tx);

      // TODO: Get rid of this call when we migrate to go-spacemesh
      //       with this fix of the issue https://github.com/spacemeshos/go-spacemesh/issues/3687
      this.retrieveAccountData({
        filter: {
          accountId: { address },
          accountDataFlags: AccountDataFlag.ACCOUNT_DATA_FLAG_ACCOUNT,
        },
        handler: this.updateAccountData(address),
      });

      return { error, tx };
    } catch (err) {
      this.logger.error('publishSpendTx', err);
      return {
        error: err,
        tx: null,
      };
    }
  };

  updateTxNote = ({
    address,
    txId,
    note,
  }: {
    address: Bech32Address;
    txId: HexString;
    note: string;
  }) => {
    const tx = this.accountStates[address].getTxById(txId);
    return this.upsertTransaction(address)({ ...tx, note });
  };
}

export default TransactionManager;
