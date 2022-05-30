import { app, BrowserWindow, ipcMain } from 'electron';
import { ipcConsts } from '../../app/vars';
import { Network, PublicService } from '../../shared/types';
import { toPublicService } from '../../shared/utils';
import { fetchJSON, isDevNet } from '../utils';
import SmesherManager from '../SmesherManager';
import NodeManager from '../NodeManager';
import WalletManager from '../WalletManager';
import { NetworkDefinitions } from '../../app/types/events';
import NodeConfig from './NodeConfig';
import { AppContext } from './context';
import { NODE_CONFIG_FILE } from './constants';
import { Managers } from './app.types';

//
// Assertions
//
const getDevNet = async () => ({
  netName: 'Dev Net',
  netID: (await fetchJSON(process.env.DEV_NET_URL))?.p2p['network-id'] || 0,
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

const getNetwork = async (context: AppContext, netId: number) =>
  (await context.state.get()).networks.find((net) => net.netID === netId);
const hasNetwork = (context: AppContext, netId: number) =>
  !!getNetwork(context, netId);

export const spawnManagers = async (
  mainWindow: BrowserWindow,
  netId: number
): Promise<Managers> => {
  if (!mainWindow)
    throw new Error('Cannot spawn managers: MainWindow not found');

  const smesher = new SmesherManager(mainWindow, NODE_CONFIG_FILE);
  const node = new NodeManager(mainWindow, netId, smesher);
  const wallet = new WalletManager(mainWindow, node);

  return { smesher, node, wallet };
};

const subscribe = (context: AppContext) => {
  // List Public GRPC APIs to the Renderer
  // ipcMain.handle(ipcConsts.LIST_PUBLIC_SERVICES, () => listPublicApis(context.currentNetwork));
  // List networks
  ipcMain.handle(
    ipcConsts.W_M_GET_NETWORK_DEFINITIONS,
    async (): Promise<NetworkDefinitions> => {
      const netId = context.currentNetwork?.netID || -1;
      const netName = context.currentNetwork?.netName || 'Not connected';
      try {
        const nodeConfig = await NodeConfig.load();
        const genesisTime = nodeConfig.main['genesis-time'];
        const layerDurationSec = nodeConfig.main['layer-duration-sec'];
        const explorerUrl = context.currentNetwork?.explorer || '';
        return { netId, netName, genesisTime, layerDurationSec, explorerUrl };
      } catch (err) {
        return { netId, netName };
      }
    }
  );
};

export default {
  subscribe,
  // Pure utils
  getNetwork,
  hasNetwork,
};
