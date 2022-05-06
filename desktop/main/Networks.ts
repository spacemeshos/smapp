import { app, BrowserWindow, ipcMain } from 'electron';
import { ipcConsts } from '../../app/vars';
import { PublicService } from '../../shared/types';
import { delay, toPublicService } from '../../shared/utils';
import { fetchJSON, isDevNet } from '../utils';
import SmesherManager from '../SmesherManager';
import NodeManager from '../NodeManager';
import WalletManager from '../WalletManager';
import { NetworkDefinitions } from '../../app/types/events';
import NodeConfig from './NodeConfig';
import { AppContext, Network } from './context';
import { NODE_CONFIG_FILE } from './constants';

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

const update = async (context: AppContext, retry = 2) => {
  try {
    const networks = await fetchNetworksFromDiscovery();
    // context.store.set({ networks: context.networks });
    context.networks = networks;
    // @todo
    // context.store.networks.next(networks);
    return networks;
  } catch (err) {
    if (retry === 0) {
      context.networks = [];
      return [];
    }
    await delay(1000);
    return update(context, retry - 1);
  }
};

const listPublicApis = (context: AppContext) => {
  if (!context.currentNetwork) return [];

  const network = context.currentNetwork;
  const publicApis: PublicService[] = [
    toPublicService(network.netName, network.grpcAPI),
    ...(isDevNet(process) && process.env.DEV_NET_REMOTE_API
      ? process.env.DEV_NET_REMOTE_API?.split(',')
          .slice(1)
          .map((url) => toPublicService(network.netName, url))
      : []),
  ];
  return publicApis;
};

const list = (context: AppContext) =>
  context.networks.map((net) => ({ ...net, netId: net.netID }));
const getNetwork = (context: AppContext, netId: number) =>
  context.networks.find((net) => net.netID === netId);
const hasNetwork = (context: AppContext, netId: number) =>
  !!getNetwork(context, netId);

export type Managers = {
  smesher: SmesherManager;
  node: NodeManager;
  wallet: WalletManager;
};
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
  ipcMain.handle(ipcConsts.LIST_PUBLIC_SERVICES, () => listPublicApis(context));
  // List networks
  ipcMain.handle(ipcConsts.LIST_NETWORKS, async () => {
    await update(context);
    return list(context);
  });
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
  list,
  update,
  subscribe,
  // Pure utils
  getNetwork,
  hasNetwork,
};
