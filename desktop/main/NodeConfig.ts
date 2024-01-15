import { existsSync } from 'fs';
import fs from 'fs/promises';
import path from 'path';
import 'json-bigint-patch';
import * as R from 'ramda';
import { hash } from '@spacemesh/sm-codec';

import { NodeConfig } from '../../shared/types';
import Warning, {
  WarningType,
  WriteFilePermissionWarningKind,
} from '../../shared/warning';
import StoreService from '../storeService';
import { getShortGenesisId, toHexString } from '../../shared/utils';
import Logger from '../logger';
import { NODE_CONFIG_FILE, USERDATA_DIR } from './constants';
import { safeSmeshingOpts } from './smeshingOpts';

const logger = Logger({ className: 'NodeConfig' });

export const loadNodeConfig = async (): Promise<NodeConfig> =>
  existsSync(NODE_CONFIG_FILE)
    ? fs
        .readFile(NODE_CONFIG_FILE, { encoding: 'utf8' })
        .then((res) => JSON.parse(res))
    : {};

export const writeNodeConfig = async (config: NodeConfig): Promise<void> => {
  try {
    await fs.writeFile(NODE_CONFIG_FILE, JSON.stringify(config), {
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
};

const getCustomNodeConfigName = (genesisID: string) =>
  `node-config.${getShortGenesisId(genesisID)}.json`;

export const getCustomNodeConfigPath = (genesisID: string) =>
  path.join(USERDATA_DIR, getCustomNodeConfigName(genesisID));

export const writeCustomNodeConfig = async (
  genesisID: string,
  config: Partial<NodeConfig>
): Promise<void> => {
  const filePath = path.join(USERDATA_DIR, getCustomNodeConfigName(genesisID));
  try {
    await fs.writeFile(filePath, JSON.stringify(config, null, 2), {
      encoding: 'utf8',
    });
  } catch (error: any) {
    throw Warning.fromError(
      WarningType.WriteFilePermission,
      {
        kind: WriteFilePermissionWarningKind.CustomConfigFile,
        filePath,
      },
      error
    );
  }
};

export const loadCustomNodeConfig = async (
  genesisID: string
): Promise<Partial<NodeConfig>> => {
  const customConfigPath = getCustomNodeConfigPath(genesisID);
  return existsSync(customConfigPath)
    ? fs
        .readFile(customConfigPath, {
          encoding: 'utf8',
        })
        .then((res) => JSON.parse(res) as Partial<NodeConfig>)
    : {};
};

export const saveSmeshingOptsInCustomConfig = async (
  genesisID: string,
  opts: Partial<NodeConfig['smeshing']>
): Promise<Partial<NodeConfig>> => {
  const customConfig = await loadCustomNodeConfig(genesisID);

  customConfig.smeshing = safeSmeshingOpts(opts, genesisID);

  await writeCustomNodeConfig(genesisID, customConfig);

  return customConfig;
};

const createCustomNodeConfig = async (
  genesisID: string
): Promise<Partial<NodeConfig>> => {
  const opts: Partial<NodeConfig['smeshing']> | undefined = StoreService.get(
    `smeshing.${genesisID}`
  );

  // migrate options from StoreService or place only default opts
  const config = await saveSmeshingOptsInCustomConfig(genesisID, opts);

  StoreService.remove(`smeshing.${genesisID}`);

  return config;
};
export const loadOrCreateCustomConfig = async (
  genesisID: string
): Promise<Partial<NodeConfig>> =>
  existsSync(path.join(USERDATA_DIR, getCustomNodeConfigName(genesisID)))
    ? loadCustomNodeConfig(genesisID)
    : createCustomNodeConfig(genesisID);

export const updateSmeshingOpts = async (
  genesisId: string,
  updateSmeshingOpts: Partial<NodeConfig['smeshing']>
): Promise<NodeConfig> => {
  const customNodeConfig = await loadCustomNodeConfig(genesisId);
  const clientConfig = await loadNodeConfig();
  const smeshingOpts = {
    ...(R.isEmpty(updateSmeshingOpts) ? {} : customNodeConfig.smeshing),
    ...updateSmeshingOpts, // apply update for other cases
  };

  const customConfig = await saveSmeshingOptsInCustomConfig(
    genesisId,
    smeshingOpts
  );
  const mergedConfig: NodeConfig = R.mergeLeft(customConfig, clientConfig);

  await writeNodeConfig(mergedConfig);

  return mergedConfig;
};

export const mergeConfigs = async (genesisID: string, config: NodeConfig) => {
  const customConfig = await loadOrCreateCustomConfig(genesisID);
  const mergedConfig = R.mergeLeft(customConfig, config);

  await writeNodeConfig(mergedConfig);

  logger.log('mergeConfigs', { genesisID });

  return {
    mergedConfig,
    originalConfig: config,
  };
};

export default {
  load: loadNodeConfig,
  mergeConfigs,
};
