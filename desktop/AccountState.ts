import path from 'path';
import fs from 'fs';
import { app } from 'electron';
import { AccountBalance, Tx, Reward, HexString } from '../shared/types';
import { debounce } from '../shared/utils';
import Logger from './logger';

const logger = Logger({ className: 'AccountState' });

type GenesisID = HexString;
interface StateType {
  state: Required<AccountBalance>;
  txs: { [txId: Tx['id']]: Tx };
  rewards: { [layer: number]: Reward };
}

// Types
export type AccountState = Record<GenesisID, StateType | HexString>;

// Utils
const getDefaultAccountState = (
  address: string,
  genesisID: string
): AccountState => ({
  address,
  [genesisID]: {
    state: {
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
  const filePath = getFilePath(state.address as string, baseDir);
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
  getAddress = () => this.state.address as HexString;

  getState = () => (this.state[this.genesisID] as StateType).state;

  getTxs = () => (this.state[this.genesisID] as StateType).txs;

  getTxById = (id: keyof StateType['txs']) =>
    (this.state[this.genesisID] as StateType).txs[id] || null;

  getRewards = () =>
    Object.values((this.state[this.genesisID] as StateType).rewards);

  // Setters. Might be impure if autosave is turned on.
  storeState = (state: Required<AccountBalance>) => {
    (this.state[this.genesisID] as StateType).state = state;
    return this.autosave();
  };

  storeTransaction = <T>(tx: Tx<T>) => {
    const prevTxData =
      (this.state[this.genesisID] as StateType).txs[tx.id] || {};
    (this.state[this.genesisID] as StateType).txs[tx.id] = {
      ...prevTxData,
      ...tx,
    };
    return this.autosave();
  };

  storeReward = (reward: Reward) => {
    (this.state[this.genesisID] as StateType).rewards[reward.layer] = reward;
    return this.autosave();
  };

  lastSyncedTxLayer = () =>
    Math.max.apply(null, [
      ...Object.values((this.state[this.genesisID] as StateType).txs)
        .slice(-10)
        .map((tx) => tx.layer || 0),
      0,
    ]);

  lastSyncedRewardsLayer = () =>
    Math.max.apply(null, [
      ...Object.keys((this.state[this.genesisID] as StateType).rewards).map(
        (k) => parseInt(k, 10) || 0
      ),
      0,
    ]);
}
