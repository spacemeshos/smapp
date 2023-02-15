import { existsSync, promises as fs } from 'fs';
import * as TOML from '@iarna/toml';
import { NodeConfig } from '../../shared/types';
import StoreService from '../storeService';
import { fetchNodeConfig } from '../utils';
import { FilePermissionConfigError } from '../errors';
import { NODE_CONFIG_FILE } from './constants';
import { safeSmeshingOpts } from './smeshingOpts';
import { generateGenesisIDFromConfig } from './Networks';

export const loadNodeConfig = async (): Promise<NodeConfig> =>
  existsSync(NODE_CONFIG_FILE)
    ? fs
        .readFile(NODE_CONFIG_FILE, { encoding: 'utf8' })
        .then((res) =>
          res.startsWith('{') ? JSON.parse(res) : TOML.parse(res)
        )
    : {};

const loadSmeshingOpts = async (nodeConfig) => {
  const id = generateGenesisIDFromConfig(nodeConfig);
  const opts = StoreService.get(`smeshing.${id}`);
  // const opts = (await loadNodeConfig()).smeshing;
  return safeSmeshingOpts(opts);
};

export const downloadNodeConfig = async (networkConfigUrl: string) => {
  const nodeConfig = await fetchNodeConfig(networkConfigUrl);
  // Copy smeshing opts from previous node config or replace it with empty one
  nodeConfig.smeshing = await loadSmeshingOpts(nodeConfig);

  try {
    await fs.writeFile(NODE_CONFIG_FILE, JSON.stringify(nodeConfig), {
      encoding: 'utf8',
    });
  } catch (error: any) {
    throw new FilePermissionConfigError(error?.message, error.stack);
  }

  return nodeConfig as NodeConfig;
};

export default {
  load: loadNodeConfig,
  download: downloadNodeConfig,
};
