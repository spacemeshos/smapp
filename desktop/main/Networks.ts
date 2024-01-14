import { app } from 'electron';
import { Network, NodeConfig, PublicService } from '../../shared/types';
import { generateGenesisID } from '../../shared/utils';
import { getStandaloneNetwork, isTestMode } from '../testMode';
import { fetchJSON, patchQueryString } from '../utils';
import { getEnvInfo } from '../envinfo';
import { isDevNet } from '../envModes';
import { toPublicService } from './utils';

export const generateGenesisIDFromConfig = (nodeConfig: NodeConfig) => {
  if (
    nodeConfig?.genesis?.['genesis-time'] ||
    nodeConfig?.genesis?.['genesis-extra-data']
  ) {
    return generateGenesisID(
      nodeConfig.genesis['genesis-time'] || '',
      nodeConfig.genesis['genesis-extra-data'] || ''
    );
  }

  return '';
};

const getDevNet = async () =>
  ({
    netName: 'Dev Net',
    genesisID: '',
    conf: process.env.DEV_NET_URL as string,
    explorer: '',
    dash: '',
    grpcAPI: process.env.DEV_NET_REMOTE_API?.split(',')[0] || '',
  } as Partial<Network>);

const getDiscoveryUrl = () =>
  app.commandLine.getSwitchValue('discovery') ||
  process.env.DISCOVERY_URL ||
  'https://configs.spacemesh.network/networks.json';

export const fetchNetworksFromDiscovery = async () => {
  const networks: Network[] = await fetchJSON(
    patchQueryString(getDiscoveryUrl(), await getEnvInfo())
  );
  const result: Network[] = [
    ...(isTestMode() ? ([await getStandaloneNetwork()] as Network[]) : []),
    ...(isDevNet() ? ([await getDevNet()] as Network[]) : []),
    ...(networks || []),
  ];
  return result;
};

export const listPublicApis = (currentNetwork: Network | null) => {
  if (!currentNetwork) return [];

  const publicApis: PublicService[] = [
    toPublicService(currentNetwork.netName, currentNetwork.grpcAPI),
    ...(isDevNet(process) && process.env.DEV_NET_REMOTE_API
      ? process.env.DEV_NET_REMOTE_API?.split(',')
          .slice(1)
          .map((url) => toPublicService(currentNetwork.netName, url))
      : []),
  ];
  return publicApis;
};

// Pure utils
export const getNetworkById = (
  genesisID: string,
  networks: Network[]
): Network | undefined => networks.find((net) => net.genesisID === genesisID);

export const hasNetwork = (genesisID: string, networks: Network[]): boolean =>
  !!getNetworkById(genesisID, networks);
