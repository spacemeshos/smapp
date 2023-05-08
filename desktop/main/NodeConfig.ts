import { existsSync, promises as fs } from 'fs';
import * as TOML from '@iarna/toml';
import * as R from 'ramda';
import { NodeConfig } from '../../shared/types';
import Warning, {
  WarningType,
  WriteFilePermissionWarningKind,
} from '../../shared/warning';
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
  return safeSmeshingOpts(opts, id);
};

export const downloadNodeConfig = async (networkConfigUrl: string) => {
  const nodeConfig = await fetchNodeConfig(networkConfigUrl);
  // Copy smeshing opts from previous node config or replace it with empty one
  nodeConfig.smeshing = await loadSmeshingOpts(nodeConfig);
  const clientConfig = await loadNodeConfig();
  const result = R.mergeDeepLeft(clientConfig, nodeConfig);

  /* console.log('pre', {
    nodeConfig: JSON.stringify(nodeConfig, null, 2),
    clientConfig: JSON.stringify(clientConfig, null, 2),
    mergedConfig: JSON.stringify(result, null, 2),
  }); */

  if (R.equals(result, clientConfig)) {
    return result;
  }
  /*
  console.log('downloadNodeConfig', {
    mergedConfig: JSON.stringify(result, null, 2),
  }); */

  try {
    await fs.writeFile(NODE_CONFIG_FILE, JSON.stringify(result), {
      encoding: 'utf8',
    });
  } catch (error: any) {
    throw Warning.fromError(
      WarningType.WriteFilePermission,
      {
        kind: WriteFilePermissionWarningKind.ConfigFile,
        filePath: NODE_CONFIG_FILE,
      },
      error
    );
  }

  return result;
};

export default {
  load: loadNodeConfig,
  download: downloadNodeConfig,
};
