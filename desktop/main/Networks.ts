import { hash } from '@spacemesh/sm-codec';
import { app } from 'electron';
import { Network, NodeConfig, PublicService } from '../../shared/types';
import { toHexString } from '../../shared/utils';
import { fetchJSON, isDevNet } from '../utils';
import { toPublicService } from './utils';

//
// Assertions
//

export const generateGenesisID = (genesisTime: string, extraData: string) => {
  return `${toHexString(hash(genesisTime + extraData)).substring(0, 40)}`;
};

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
  'https://discover.spacemesh.io/networks.json';

export const fetchNetworksFromDiscovery = async () => {
  const networks: Network[] = await fetchJSON(getDiscoveryUrl());
  const result: Network[] = isDevNet()
    ? [(await getDevNet()) as Network, ...networks]
    : networks || [];
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
