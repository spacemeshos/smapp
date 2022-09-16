import path from 'path';
import { app } from 'electron';

export const MINUTE = 60 * 1000;
export const HOUR = 60 * MINUTE;

// Linux: ~/.config/<App Name>
// Mac OS: ~/Library/Application Support/<App Name>
// Windows: C:\Users\<user>\AppData\Local\<App Name>
export const USERDATA_DIR = app.getPath('userData');

export const DOCUMENTS_DIR = app.getPath('documents');

export const NODE_CONFIG_FILE = path.resolve(USERDATA_DIR, 'config.toml');

export const DEFAULT_WALLETS_DIRECTORY = USERDATA_DIR;

export const GRPC_QUERY_BATCH_SIZE = 50;
