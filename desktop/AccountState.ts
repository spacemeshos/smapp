import path from 'path';
import fs from 'fs';
import { app } from 'electron';
import { AccountBalance, HexString } from '../shared/types';
import { Tx, Reward } from '../shared/types/tx';
import { debounce } from '../shared/utils';
import Logger from './logger';

const logger = Logger({ className: 'AccountState' });

// Types
export interface AccountState {
  publicKey: string;
  [k: number]: {
    account: Required<AccountBalance>;
    txs: { [txId: Tx['id']]: Tx };
    rewards: { [layer: number]: Reward };
  };
}

// Utils

const getDefaultAccountState = (
  publicKey: string,
  netId: number
): AccountState => ({
  publicKey,
  [netId]: {
    account: {
      currentState: { balance: 0, counter: 0 },
      projectedState: { balance: 0, counter: 0 },
    },
    txs: {},
    rewards: {},
  },
});

const getFilePath = (publicKey: string, baseDir: string) =>
  path.resolve(baseDir, `${publicKey}.json`);

// Side-effects
const DEFAULT_BASE_DIR = path.resolve(app.getPath('userData'), 'accounts');

const load = (
  publicKey: string,
  netId: number,
  baseDir = DEFAULT_BASE_DIR,
  retry = 0
): AccountState => {
  const filePath = getFilePath(publicKey, baseDir);
  try {
    const raw = fs.readFileSync(filePath, {
      encoding: 'utf8',
    });
    const parsed = JSON.parse(raw);
    return {
      ...getDefaultAccountState(publicKey, netId),
      ...parsed,
    };
  } catch (err) {
    if ((err as { code: string }).code !== 'ENOENT' && retry !== 1) {
      logger.log('AccountState.load', err, publicKey);
      fs.unlinkSync(filePath);
      return load(publicKey, netId, baseDir, 1);
    }
    return getDefaultAccountState(publicKey, netId);
  }
};

const save = async (state: AccountState, baseDir = DEFAULT_BASE_DIR) => {
  !fs.existsSync(baseDir) && fs.mkdirSync(baseDir, { recursive: true });
  const filePath = getFilePath(state.publicKey, baseDir);
  const data = JSON.stringify(state);
  return fs.promises.writeFile(filePath, data, { encoding: 'utf8' });
};

// Class

interface Opts {
  accountStateDir: string;
  autosave: boolean;
  debounce: number;
}

const DEFAULT_OPTS: Opts = {
  accountStateDir: path.resolve(app.getPath('userData'), 'accounts'),
  autosave: true,
  debounce: 300,
};

export class AccountStateManager {
  private state: AccountState;

  private baseDir: string;

  private netId: number;

  constructor(publicKey: HexString, netId: number, opts = DEFAULT_OPTS) {
    this.state = load(publicKey, netId, opts.accountStateDir);
    this.baseDir = opts.accountStateDir;
    this.netId = netId;
    if (opts.autosave) {
      this.autosave = debounce(opts.debounce, this.save);
    }
  }

  // Side-effects

  save = () => save(this.state, this.baseDir);

  private autosave = () => Promise.resolve();

  // Getters (pure)
  getPublicKey = () => this.state.publicKey;

  getAccount = () => this.state[this.netId].account;

  getTxs = () => this.state[this.netId].txs;

  getTxById = (id: keyof AccountState[number]['txs']) =>
    this.state[this.netId].txs[id] || null;

  getRewards = () => Object.values(this.state[this.netId].rewards);

  // Setters. Might be impure if autosave is turned on.
  storeAccountBalance = (balance: Required<AccountBalance>) => {
    this.state[this.netId].account = balance;
    return this.autosave();
  };

  storeTransaction = (tx: Tx) => {
    const prevTxData = this.state[this.netId].txs[tx.id] || {};
    this.state[this.netId].txs[tx.id] = { ...prevTxData, ...tx };
    return this.autosave();
  };

  storeReward = (reward: Reward) => {
    this.state[this.netId].rewards[reward.layer] = reward;
    return this.autosave();
  };
}
