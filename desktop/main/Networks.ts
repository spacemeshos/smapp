import { app, BrowserWindow } from 'electron';
import { sha256 } from '@spacemesh/sm-codec/lib/utils/crypto';
import { Network, PublicService } from '../../shared/types';
import { toHexString, toPublicService } from '../../shared/utils';
import { fetchJSON, isDevNet } from '../utils';
import SmesherManager from '../SmesherManager';
import NodeManager from '../NodeManager';
import WalletManager from '../WalletManager';
import { NODE_CONFIG_FILE } from './constants';
import { Managers } from './app.types';

//
// Assertions
//
const getDevNet = async () => ({
  netName: 'Dev Net',
  genesisID: (await fetchJSON(process.env.DEV_NET_URL))?.p2p.genesisID || 0,
  conf: process.env.DEV_NET_URL,
  explorer: '',
  dash: '',
  grpcAPI: process.env.DEV_NET_REMOTE_API?.split(',')[0] || '',
});

const getDiscoveryUrl = () =>
  app.commandLine.getSwitchValue('discovery') ||
  process.env.DISCOVERY_URL ||
  'https://discover.spacemesh.io/networks.json';

export const fetchNetworksFromDiscovery = async () => {
  const networks = await fetchJSON(getDiscoveryUrl());

  const result: Network[] = isDevNet()
    ? [await getDevNet(), ...networks]
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

//

export const spawnManagers = async (
  mainWindow: BrowserWindow,
  genesisID: string
): Promise<Managers> => {
  if (!mainWindow)
    throw new Error('Cannot spawn managers: MainWindow not found');

  const smesher = new SmesherManager(mainWindow, NODE_CONFIG_FILE);
  const node = new NodeManager(mainWindow, genesisID, smesher);
  const wallet = new WalletManager(mainWindow, node);

  return { smesher, node, wallet };
};

export const generateGenesisID = (genesisTime: string, extraData: string) => {
  return `0x${toHexString(sha256(genesisTime + extraData)).substring(0, 40)}`;
};
