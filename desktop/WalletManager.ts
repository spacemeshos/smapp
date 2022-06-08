import * as R from 'ramda';
import { ipcMain, BrowserWindow } from 'electron';
import { ipcConsts } from '../app/vars';
import { Account, Activation, Wallet } from '../shared/types';
import {
  isLocalNodeType,
  isRemoteNodeApi,
  toSocketAddress,
} from '../shared/utils';
import { Reward__Output } from '../proto/spacemesh/v1/Reward';
import { isActivation, isNodeError } from '../shared/types/guards';
import { CurrentLayer, GlobalStateHash } from '../app/types/events';
import MeshService from './MeshService';
import GlobalStateService from './GlobalStateService';
import TransactionManager from './TransactionManager';
import cryptoService from './cryptoService';
import NodeManager from './NodeManager';
import TransactionService from './TransactionService';
import Logger from './logger';
import { toHexString } from './utils';

const logger = Logger({ className: 'WalletManager' });

const pluckActivations = (list: any[]): Activation[] =>
  !list
    ? []
    : list.reduce((acc, { activation }) => {
        if (isActivation(activation)) {
          return [...acc, activation];
        }
        return acc;
      }, <Activation[]>[]);

class WalletManager {
  private readonly meshService: MeshService;

  private readonly glStateService: GlobalStateService;

  private readonly txService: TransactionService;

  private nodeManager: NodeManager;

  private txManager: TransactionManager;

  private unsub = () => {};

  constructor(mainWindow: BrowserWindow, nodeManager: NodeManager) {
    this.unsub = this.subscribeToEvents();
    this.nodeManager = nodeManager;
    this.meshService = new MeshService();
    this.glStateService = new GlobalStateService();
    this.txService = new TransactionService();
    this.txManager = new TransactionManager(
      this.meshService,
      this.glStateService,
      this.txService,
      mainWindow
    );
  }

  __getNewAccountFromTemplate = ({
    index,
    timestamp,
    publicKey,
    secretKey,
  }: {
    index: number;
    timestamp: string;
    publicKey: string;
    secretKey: string;
  }) => ({
    displayName: index > 0 ? `Account ${index}` : 'Main Account',
    created: timestamp,
    path: `0/0/${index}`,
    publicKey,
    secretKey,
  });

  getCurrentLayer = (): Promise<CurrentLayer> =>
    this.meshService.getCurrentLayer();

  getRootHash = (): Promise<GlobalStateHash> =>
    this.glStateService.getGlobalStateHash();

  subscribeToEvents = () => {
    ipcMain.handle(ipcConsts.W_M_GET_CURRENT_LAYER, () =>
      this.getCurrentLayer()
    );
    ipcMain.handle(ipcConsts.W_M_GET_GLOBAL_STATE_HASH, () =>
      this.getRootHash()
    );

    ipcMain.handle(ipcConsts.W_M_SEND_TX, async (_event, request) => {
      const res = await this.txManager.sendTx({ ...request });
      return res;
    });
    ipcMain.handle(ipcConsts.W_M_UPDATE_TX_NOTE, async (_event, request) => {
      await this.txManager.updateTxNote(request);
      return true;
    });
    ipcMain.handle(ipcConsts.W_M_SIGN_MESSAGE, async (_event, request) => {
      const { message, accountIndex } = request;
      const res = await cryptoService.signMessage({
        message,
        secretKey: this.txManager.accounts[accountIndex].secretKey,
      });
      return res;
    });

    return () => {
      ipcMain.removeHandler(ipcConsts.W_M_GET_CURRENT_LAYER);
      ipcMain.removeHandler(ipcConsts.W_M_GET_GLOBAL_STATE_HASH);
      ipcMain.removeHandler(ipcConsts.W_M_SEND_TX);
      ipcMain.removeHandler(ipcConsts.W_M_UPDATE_TX_NOTE);
      ipcMain.removeHandler(ipcConsts.W_M_SIGN_MESSAGE);
    };
  };

  unsubscribe = () => this.unsub();

  activate = async (wallet: Wallet) => {
    const apiUrl = toSocketAddress(wallet.meta.remoteApi);
    try {
      if (isLocalNodeType(wallet.meta.type)) await this.nodeManager.startNode();
      else {
        await this.nodeManager.stopNode();
        if (!!apiUrl && isRemoteNodeApi(apiUrl)) {
          await this.nodeManager.connectToRemoteNode(apiUrl);
        }
      }
    } catch (err) {
      if (isNodeError(err)) {
        this.nodeManager.sendNodeError(err);
      }
    }
    this.meshService.createService(apiUrl);
    this.glStateService.createService(apiUrl);
    this.txService.createService(apiUrl);
  };

  activateAccounts = (accounts: Account[]) => {
    this.txManager.setAccounts(accounts);
  };

  requestActivationsByCoinbase = async (
    coinbase: Uint8Array
  ): Promise<Activation[]> => {
    const BATCH_SIZE = 50; // the same inside `requestMeshActivations`
    const res = await this.meshService.requestMeshActivations(coinbase, 0);
    if (!res) {
      const coinbaseHex = toHexString(coinbase);
      logger.debug(
        `meshService.requestMeshActivations(${coinbaseHex}, 0) returned`,
        res
      );
      logger.debug('SmesherId:', coinbase);
      return [];
    }
    const { totalResults, data } = res;

    const firstActivations = pluckActivations(data);
    if (totalResults <= BATCH_SIZE) {
      return firstActivations;
    } else {
      const nextData = await Promise.all(
        R.compose(
          R.map((idx) =>
            this.meshService
              .requestMeshActivations(coinbase, idx * BATCH_SIZE)
              .then((resp) => pluckActivations(resp.data))
          ),
          R.range(1)
        )(Math.ceil(totalResults / BATCH_SIZE))
      ).then(R.unnest);
      return [...firstActivations, ...nextData];
    }
  };

  requestAllSmesherRewards = async (
    smesherId: Uint8Array
  ): Promise<Reward__Output[]> => {
    const BATCH_SIZE = 50;
    const x = await this.glStateService.requestSmesherRewards(
      smesherId,
      BATCH_SIZE,
      0
    );
    const { totalResults, rewards } = x;
    if (totalResults <= BATCH_SIZE) {
      return rewards;
    } else {
      const nextRewards = await Promise.all(
        R.compose(
          R.map((idx) =>
            this.glStateService
              .requestSmesherRewards(smesherId, BATCH_SIZE, idx * BATCH_SIZE)
              .then((resp) => resp.rewards)
          ),
          R.range(1)
        )(Math.ceil(totalResults / BATCH_SIZE))
      ).then(R.unnest);
      return [...rewards, ...nextRewards];
    }
  };

  listenRewardsBySmesherId = (
    smesherId: Uint8Array,
    handler: (reward: Reward__Output) => void
  ) => this.glStateService.activateSmesherRewardStream(smesherId, handler);

  listenActivationsByCoinbase = (
    coinbase: Uint8Array,
    handler: (atx: Activation) => void
  ) => this.meshService.listenMeshActivations(coinbase, handler);
}

export default WalletManager;
