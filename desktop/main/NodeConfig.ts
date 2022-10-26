import { existsSync, promises as fs } from 'fs';
import * as TOML from '@iarna/toml';
import { NodeConfig } from '../../shared/types';
import { configCodecByPath } from '../../shared/utils';
import { fetchNodeConfig } from '../utils';
import { NODE_CONFIG_FILE } from './constants';

export const loadNodeConfig = async () =>
  existsSync(NODE_CONFIG_FILE)
    ? fs
        .readFile(NODE_CONFIG_FILE, { encoding: 'utf8' })
        .then((res) =>
          res.startsWith('{') ? JSON.parse(res) : TOML.parse(res)
        )
    : {};

const loadSmeshingOpts = async () => (await loadNodeConfig()).smeshing;

export const downloadNodeConfig = async (networkConfigUrl: string) => {
  const nodeConfig = await fetchNodeConfig(networkConfigUrl);

  // Copy smeshing opts from previous node config or replace it with empty one
  const smeshing = await loadSmeshingOpts();
  nodeConfig.smeshing = smeshing;
  await fs.writeFile(
    NODE_CONFIG_FILE,
    configCodecByPath(NODE_CONFIG_FILE).stringify(nodeConfig),
    {
      encoding: 'utf8',
    }
  );
  return nodeConfig as NodeConfig;
};

export default {
  load: loadNodeConfig,
  download: downloadNodeConfig,
};
