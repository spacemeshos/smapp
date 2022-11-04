import path from 'path';
import fs from 'fs';
import { app } from 'electron';
import { AccountBalance, Tx, Reward } from '../shared/types';
import { debounce } from '../shared/utils';
import Logger from './logger';

const logger = Logger({ className: 'AccountState' });

interface GenesisIDState<T> {
  [genesisID: string]: T;
}

interface GenesisIDStateType {
  state: Required<AccountBalance>;
  txs: { [txId: Tx['id']]: Tx };
  rewards: { [layer: number]: Reward };
}

// Types
export type AccountState = GenesisIDState<GenesisIDStateType> & {
  address: string;
};

// Utils
const getDefaultAccountState = (
  address: string,
  genesisID: string
): AccountState =>
  ({
    address,
    [genesisID]: {
      state: {
        currentState: { balance: 0, counter: 0 },
        projectedState: { balance: 0, counter: 0 },
      },
      txs: {},
      rewards: {},
    },
  } as AccountState);

const getFilePath = (publicKey: string, baseDir: string) =>
  path.resolve(baseDir, `${publicKey}.json`);

// Side-effects
const DEFAULT_BASE_DIR = path.resolve(app.getPath('userData'), 'accounts');

const load = (
  publicKey: string,
  genesisID: string,
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
      ...getDefaultAccountState(publicKey, genesisID),
      ...parsed,
    };
  } catch (err) {
    if ((err as { code: string }).code !== 'ENOENT' && retry !== 1) {
      logger.log('AccountState.load', err, publicKey);
      fs.unlinkSync(filePath);
      return load(publicKey, genesisID, baseDir, 1);
    }
    return getDefaultAccountState(publicKey, genesisID);
  }
};

const save = async (state: AccountState, baseDir = DEFAULT_BASE_DIR) => {
  !fs.existsSync(baseDir) && fs.mkdirSync(baseDir, { recursive: true });
  const filePath = getFilePath(state.address, baseDir);
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

  private genesisID: string;

  constructor(address: string, genesisID: string, opts = DEFAULT_OPTS) {
    this.state = load(address, genesisID, opts.accountStateDir);
    this.baseDir = opts.accountStateDir;
    this.genesisID = genesisID;
    if (opts.autosave) {
      this.autosave = debounce(opts.debounce, this.save);
    }
  }

  // Side-effects

  save = () => save(this.state, this.baseDir);

  private autosave = () => Promise.resolve();

  // Getters (pure)
  getAddress = () => this.state.address;

  getState = () => this.state[this.genesisID].state;

  getTxs = () => this.state[this.genesisID].txs;

  getTxById = (id: keyof AccountState[number]['txs']) =>
    this.state[this.genesisID].txs[id] || null;

  getRewards = () => Object.values(this.state[this.genesisID].rewards);

  // Setters. Might be impure if autosave is turned on.
  storeState = (state: Required<AccountBalance>) => {
    this.state[this.genesisID].state = state;
    return this.autosave();
  };

  storeTransaction = <T>(tx: Tx<T>) => {
    const prevTxData = this.state[this.genesisID].txs[tx.id] || {};
    this.state[this.genesisID].txs[tx.id] = { ...prevTxData, ...tx };
    return this.autosave();
  };

  storeReward = (reward: Reward) => {
    this.state[this.genesisID].rewards[reward.layer] = reward;
    return this.autosave();
  };
}
