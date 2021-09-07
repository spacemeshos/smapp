import path from 'path';
import fs from 'fs';
import { app } from 'electron';
import { AccountBalance } from '../shared/types';
import { Tx, Reward } from '../shared/types/tx';
import { debounce } from '../shared/utils';

// Types

export interface AccountState {
  publicKey: string;
  account: Required<AccountBalance>;
  txs: { [txId: Tx['id']]: Tx };
  rewards: { [layer: number]: Reward };
}

// Utils

const getDefaultAccountState = (publicKey: string): AccountState => ({
  publicKey,
  account: {
    currentState: { balance: 0, counter: 0 },
    projectedState: { balance: 0, counter: 0 },
  },
  txs: {},
  rewards: {},
});

const getFilePath = (publicKey: string, baseDir: string) => path.resolve(baseDir, `${publicKey}.json`);

// Side-effects
const DEFAULT_BASE_DIR = path.resolve(app.getPath('userData'), 'accounts');

const load = (publicKey: string, baseDir = DEFAULT_BASE_DIR): AccountState => {
  try {
    const raw = fs.readFileSync(getFilePath(publicKey, baseDir), { encoding: 'utf8' });
    const parsed = JSON.parse(raw);
    return {
      ...getDefaultAccountState(publicKey),
      ...parsed,
    };
  } catch (err) {
    console.log('AccountState.load', publicKey, 'error:', err); // eslint-disable-line no-console
    return getDefaultAccountState(publicKey);
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

  constructor(publicKey, opts = DEFAULT_OPTS) {
    this.state = load(publicKey, opts.accountStateDir);
    this.baseDir = opts.accountStateDir;
    if (opts.autosave) {
      this.autosave = debounce(opts.debounce, this.save);
    }
  }

  // Side-effects

  save = () => save(this.state, this.baseDir);

  private autosave = () => Promise.resolve();

  // Getters (pure)
  getPublicKey = () => this.state.publicKey;

  getAccount = () => this.state.account;

  getTxs = () => this.state.txs;

  getTxById = (id: keyof AccountState['txs']) => this.state.txs[id] || null;

  getRewards = () => Object.values(this.state.rewards);

  // Setters. Might be impure if autosave is turned on.
  storeAccountBalance = (balance: Required<AccountBalance>) => {
    this.state.account = balance;
    return this.autosave();
  };

  storeTransaction = (tx: Tx) => {
    const prevTxData = this.state.txs[tx.id] || {};
    this.state.txs[tx.id] = { ...prevTxData, ...tx };
    return this.autosave();
  };

  storeReward = (reward: Reward) => {
    this.state.rewards[reward.layer] = reward;
    return this.autosave();
  };
}
