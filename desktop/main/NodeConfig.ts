import { promises as fs } from 'fs';
import { NodeConfig } from '../../shared/types';
import { fetchJSON, isFileExists } from '../utils';
import { NODE_CONFIG_FILE } from './constants';

export const loadNodeConfig = () =>
  fs.readFile(NODE_CONFIG_FILE, { encoding: 'utf8' }).then(JSON.parse);

const loadSmeshingOpts = async () =>
  (await isFileExists(NODE_CONFIG_FILE))
    ? (await loadNodeConfig()).smeshing
    : {};

export const downloadNodeConfig = async (networkConfigUrl: string) => {
  const nodeConfig = await fetchJSON(networkConfigUrl);

  // Copy smeshing opts from previous node config or replace it with empty one
  const smeshing = await loadSmeshingOpts();
  nodeConfig.smeshing = smeshing;

  await fs.writeFile(NODE_CONFIG_FILE, JSON.stringify(nodeConfig), {
    encoding: 'utf8',
  });
  return nodeConfig as NodeConfig;
};

export default {
  load: loadNodeConfig,
  download: downloadNodeConfig,
};
