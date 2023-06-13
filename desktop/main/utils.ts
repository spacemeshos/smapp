import path from 'path';
import readFromBottom from 'fs-reverse';
import { app, BrowserWindow, Notification } from 'electron';
import { isFileExists } from '../utils';
import { PublicService, SocketAddress } from '../../shared/types';
import { USERDATA_DIR } from './constants';

export const showMainWindow = (mainWindow: BrowserWindow) => {
  mainWindow.show();
  mainWindow.focus();
};

export const showNotification = (
  mainWindow: BrowserWindow,
  { title, body }: { title: string; body: string }
) => {
  if (Notification.isSupported() && !mainWindow?.isMaximized()) {
    const options = { title, body, icon: '../app/assets/images/icon.png' };
    const notification = new Notification(options);
    notification.show();
    notification.once('click', () => showMainWindow(mainWindow));
  }
};

export const getNodeLogsPath = (genesisID?: string) =>
  path.resolve(
    USERDATA_DIR,
    `spacemesh-log-${(genesisID || 'unknown').substring(0, 8)}.txt`
  );

//

export const readLinesFromBottom = async (filepath: string, amount: number) => {
  if (!(await isFileExists(filepath))) return [];

  return new Promise<string[]>((resolve) => {
    const str = readFromBottom(filepath);
    const result: string[] = [];
    let count = 0;
    str.on('data', (line) => {
      if (count >= amount) {
        str.pause();
        str.destroy();
        resolve(result);
        return;
      }
      result.push(line);
      count += 1;
    });

    str.on('end', () => {
      resolve(result);
    });
  });
};

export const DEFAULT_GRPC_PUBLIC_PORT = '9092';
export const DEFAULT_GRPC_PRIVATE_PORT = '9093';

export const getGrpcPublicPort = () =>
  process.env.GRPC_PUBLIC_PORT ||
  app.commandLine.getSwitchValue('grpc-public-listener') ||
  DEFAULT_GRPC_PUBLIC_PORT;

export const getGrpcPrivatePort = () =>
  process.env.GRPC_PRIVATE_PORT ||
  app.commandLine.getSwitchValue('grpc-private-listener') ||
  DEFAULT_GRPC_PRIVATE_PORT;

export const getProofOfServerClientValue = () =>
  process.env.PPROF_SERVER || app.commandLine.hasSwitch('pprof-server');

export const getLocalNodeConnectionConfig = (): SocketAddress => ({
  host: 'localhost',
  port: getGrpcPublicPort(),
  protocol: 'http:',
});

export const getPrivateNodeConnectionConfig = (): SocketAddress => ({
  host: 'localhost',
  port: getGrpcPrivatePort(),
  protocol: 'http:',
});

// GRPC APIs
export const toSocketAddress = (url?: string): SocketAddress => {
  if (!url || url.startsWith('http://localhost'))
    return getLocalNodeConnectionConfig();

  const p = url.match(/:(\d+)$/)?.[1];
  const port = p ? `:${p}` : '';
  const s = p === '443' ? 's' : '';
  const vUrl = url.startsWith('http')
    ? url
    : `http${s}://${url.slice(0, url.length - port.length)}${port}`;
  const u = new URL(vUrl);
  if (u.protocol !== 'http:' && u.protocol !== 'https:') {
    throw new Error(`Unsupported protocol in GRPC remote API URL: ${url}`);
  }
  return {
    host: u.hostname,
    port:
      u.port || u.protocol === 'https:'
        ? '443'
        : getLocalNodeConnectionConfig().port,
    protocol: u.protocol,
  };
};

export const toPublicService = (
  netName: string,
  url: string
): PublicService => ({
  name: netName,
  ...toSocketAddress(url),
});

// to lower case and replace spaces with underscores
export const getWalletFileName = (walletName: string) =>
  walletName.toLowerCase().replaceAll(/\s/g, '_');
