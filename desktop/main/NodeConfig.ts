import { promises as fs } from 'fs';
import { fetchJSON, isFileExists } from '../utils';
import { NODE_CONFIG_FILE } from './constants';
import { Network } from './context';

const load = () =>
  fs.readFile(NODE_CONFIG_FILE, { encoding: 'utf8' }).then(JSON.parse);

const loadSmeshingOpts = async () =>
  (await isFileExists(NODE_CONFIG_FILE)) ? (await load()).smeshing : {};

const download = async (network: Network) => {
  const nodeConfig = await fetchJSON(network.conf);

  // Copy smeshing opts from previous node config or replace it with empty one
  const smeshing = await loadSmeshingOpts();
  nodeConfig.smeshing = smeshing;

  await fs.writeFile(NODE_CONFIG_FILE, JSON.stringify(nodeConfig), {
    encoding: 'utf8',
  });
  return nodeConfig;
};

export default {
  load,
  download,
};
