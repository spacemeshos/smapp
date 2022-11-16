import { app } from 'electron';
import { sha256 } from '@spacemesh/sm-codec/lib/utils/crypto';
import { Network, NodeConfig, PublicService } from '../../shared/types';
import { toHexString, toPublicService } from '../../shared/utils';
import { fetchJSON, isDevNet } from '../utils';

//
// Assertions
//

export const generateGenesisID = (genesisTime: string, extraData: string) => {
  return `0x${toHexString(sha256(genesisTime + extraData)).substring(0, 40)}`;
};

export const generateGenesisIDFromConfig = (nodeConfig: NodeConfig) => {
  if (
    nodeConfig?.genesis?.['genesis-time'] ||
    nodeConfig?.genesis?.['genesis-extra-data']
  ) {
    return generateGenesisID(
      nodeConfig?.genesis?.['genesis-time'] || '',
      nodeConfig?.genesis?.['genesis-extra-data'] || ''
    );
  }

  return '';
};

const getDevNet = async () =>
  ({
    netName: 'Dev Net',
    genesisID: generateGenesisIDFromConfig(
      await fetchJSON(process.env.DEV_NET_URL)
    ),
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
  console.log({ url: getDiscoveryUrl() });
  const networks: Network[] = await fetchJSON(getDiscoveryUrl());
  console.log({ networks });
  const result: Network[] = isDevNet()
    ? [(await getDevNet()) as Network, ...networks]
    : networks || [];
  console.log({ result });
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
