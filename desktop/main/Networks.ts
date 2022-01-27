import { ipcMain } from 'electron';
import { ipcConsts } from '../../app/vars';
import { PublicService } from '../../shared/types';
import { delay, toPublicService } from '../../shared/utils';
import { fetchJSON, isDevNet } from '../utils';
import SmesherManager from '../SmesherManager';
import NodeManager from '../NodeManager';
import WalletManager from '../WalletManager';
import NodeConfig from './NodeConfig';
import { AppContext, hasManagers, Network } from './context';
import { MINUTE, NODE_CONFIG_FILE } from './constants';

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

const update = async (context: AppContext, retry = 3) => {
  try {
    const DISCOVERY_URL = 'https://discover.spacemesh.io/networks.json';
    const networks = await fetchJSON(DISCOVERY_URL);
    const result: Network[] = isDevNet() ? [await getDevNet(), ...networks] : networks;
    context.networks = result;
    return result;
  } catch (err) {
    if (retry === 0) {
      context.networks = [];
      return [];
    }
    await delay(0.1 * MINUTE);
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

const list = (context: AppContext) => context.networks.map((net) => ({ ...net, netId: net.netID }));
const getNetwork = (context: AppContext, netId: number) => context.networks.find((net) => net.netID === netId);
const hasNetwork = (context: AppContext, netId: number) => !!getNetwork(context, netId);

const spawnManagers = async (context: AppContext) => {
  const { mainWindow } = context;
  if (!mainWindow) throw new Error('Cannot spawn managers: MainWindow not found');
  if (!context.currentNetwork) throw new Error('Cannot spawn managers: Network does not selected');
  if (!hasManagers(context)) {
    context.managers.smesher = new SmesherManager(mainWindow, NODE_CONFIG_FILE);
    context.managers.node = new NodeManager(mainWindow, context.currentNetwork.netID, context.managers.smesher);
    context.managers.wallet = new WalletManager(mainWindow, context.managers.node);
  }
};

const switchNetwork = async (context: AppContext, netId: number) => {
  const newNetwork = getNetwork(context, netId);
  if (!newNetwork) {
    throw new Error(`Cannot switch to network ${netId}: not found. Have: ${context.networks.map((n) => n.netID).join(', ')}`);
  }
  context.currentNetwork = newNetwork;
  await NodeConfig.download(newNetwork);
  await spawnManagers(context);
  return newNetwork;
};

const subscribe = (context: AppContext) => {
  // List Public GRPC APIs to the Renderer
  ipcMain.handle(ipcConsts.LIST_PUBLIC_SERVICES, () => listPublicApis(context));
  // List networks
  ipcMain.handle(ipcConsts.LIST_NETWORKS, async () => {
    await update(context);
    return list(context);
  });
  ipcMain.handle(ipcConsts.W_M_GET_NETWORK_DEFINITIONS, async () => {
    // const { netID: netId, netName } = this.context.currentNetwork;
    const netId = context.currentNetwork?.netID || -1;
    const netName = context.currentNetwork?.netName || 'Not connected';
    // TODO: Take it from node config
    const nodeConfig = await NodeConfig.load();
    const genesisTime = nodeConfig.main['genesis-time'];
    const layerDurationSec = nodeConfig.main['layer-duration-sec'];
    const explorerUrl = context.currentNetwork?.explorer || '';
    return { netId, netName, genesisTime, layerDurationSec, explorerUrl };
  });
};

export default {
  list,
  update,
  switchNetwork,
  subscribe,
  // Pure utils
  getNetwork,
  hasNetwork,
};
