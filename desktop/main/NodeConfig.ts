import { existsSync, promises as fs } from 'fs';
import * as TOML from '@iarna/toml';
import { NodeConfig } from '../../shared/types';
import StoreService from '../storeService';
import { fetchNodeConfig } from '../utils';
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

export const downloadNodeConfig = async (
  networkConfigUrl: string,
  updateNodeConfig = false
) => {
  const nodeConfig = await fetchNodeConfig(networkConfigUrl);
  // Copy smeshing opts from previous node config or replace it with empty one
  const smeshing = await loadSmeshingOpts(nodeConfig);
  nodeConfig.smeshing = smeshing;

  if (updateNodeConfig) {
    await fs.writeFile(NODE_CONFIG_FILE, JSON.stringify(nodeConfig), {
      encoding: 'utf8',
    });
  }

  return nodeConfig as NodeConfig;
};

export default {
  load: loadNodeConfig,
  download: downloadNodeConfig,
};
