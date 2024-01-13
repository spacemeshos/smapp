import path from 'path';
import { writeFile, readFile } from 'fs/promises';
import { ensureDir } from 'fs-extra';
import { app } from 'electron';
import { Network, NetworkExtended, NodeConfig } from '../../shared/types';
import { isNetConfig, isNetwork } from '../../shared/types/guards';
import Logger from '../logger';
import { generateGenesisIDFromConfig } from './Networks';

const NETWORKS_FILENAME = 'networks.json';

const logger = Logger({ className: 'fallbackConfigs' });

const getFallbackPath = (filename: string) =>
  path.join(app.getPath('userData'), 'ConfigCache', filename);

export const getConfigFilename = (net: Network) => {
  const urlParts = net.conf.split('/');
  return urlParts[urlParts.length - 1];
};

export const saveNetworks = async (net: Network[]) =>
  writeFile(
    getFallbackPath(NETWORKS_FILENAME),
    JSON.stringify(net, null, 2),
    'utf-8'
  );

export const saveFallbackNetworks = async (nets: NetworkExtended[]) => {
  const dir = getFallbackPath('');
  logger.log('saving...', { amount: nets.length, dir });
  await ensureDir(dir);
  const configFilenames = await Promise.all(
    nets.map(async (net) => {
      const configFilename = getConfigFilename(net);
      await writeFile(
        getFallbackPath(configFilename),
        JSON.stringify(net.config, null, 2),
        'utf-8'
      );
      return configFilename;
    })
  );
  logger.log('configs are saved', { configFilenames });
  await saveNetworks(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    nets.map(({ config, ...rest }): Network => ({ ...rest }))
  );
  logger.log('networks.json is saved', null);
};

export const loadFallbackConfig = async (net: Network): Promise<NodeConfig> => {
  const fileName = getConfigFilename(net);
  logger.log('loading config...', { netName: net.netName, fileName });
  const configRaw = await readFile(getFallbackPath(fileName), 'utf-8');
  const config: NodeConfig = JSON.parse(configRaw);
  if (!isNetConfig(config)) {
    throw new Error(
      `Backed up config for network ${net.netName} is not valid:\n${configRaw}`
    );
  }
  return config;
};

export const loadFallbackNetworks = async () => {
  logger.log('loading...', null);
  const networksRaw = await readFile(
    getFallbackPath(NETWORKS_FILENAME),
    'utf-8'
  );
  const networks: Network[] = JSON.parse(networksRaw);
  if (!networks.every(isNetwork)) {
    throw new Error(
      `Backed up networks.json does not contain a valid data:\n${networksRaw}`
    );
  }

  logger.log('networks.json is loaded', { networksAmount: networks.length });

  const extended = await Promise.all(
    networks.map(
      async (net): Promise<NetworkExtended> => {
        const config = await loadFallbackConfig(net);
        return {
          ...net,
          genesisID: generateGenesisIDFromConfig(config),
          config,
        };
      }
    )
  );

  logger.log('networks.json extended with genesisID and configs', {
    genesisIDs: extended.map((n) => n.genesisID),
  });

  return extended;
};
