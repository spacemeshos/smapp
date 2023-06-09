import { tmpdir } from 'os';
import { join } from 'path';
import { app } from 'electron';
import { remove } from 'fs-extra';

import pkg from '../package.json';
import { Network } from '../shared/types';
import { MINUTE } from './main/constants';

export const STANDALONE_GENESIS_EXTRA = 'standalone';

export const TEST_MODE_GENESIS_TIME = new Date(
  Date.now() + 2 * MINUTE
).toISOString();

export const isTestMode = () =>
  process.env.TEST_MODE || app.commandLine.hasSwitch('test-mode');

export const getStandaloneNetwork = () =>
  ({
    netName: 'Standalone Testnet',
    conf: 'standalone',
    explorer: '',
    dash: '',
    genesisID: TEST_MODE_GENESIS_TIME,
    grpcAPI: 'http://0.0.0.0:9092',
    minSmappRelease: `v${pkg.version}`,
    latestSmappRelease: `v${pkg.version}`,
  } as Partial<Network>);

export const getTestModeNodeConfig = () => ({
  api: {
    'grpc-public-listener': '0.0.0.0:9092',
    'grpc-private-listener': '0.0.0.0:9093',
    'grpc-json-listener': '0.0.0.0:9094',
  },
  preset: 'standalone',
  main: {
    'layer-duration': '6s',
    'layers-per-epoch': 10,
    'eligibility-confidence-param': 18,
    'tick-size': 67000,
  },
  genesis: {
    'genesis-time': TEST_MODE_GENESIS_TIME,
    'genesis-extra-data': 'standalone',
  },
  poet: {
    'phase-shift': '30s',
    'cycle-gap': '30s',
    'grace-period': '10s',
  },
  post: {
    'post-labels-per-unit': 128,
    'post-max-numunits': 4,
    'post-k1': 12,
    'post-k2': 4,
    'post-k3': 4,
  },
});

export const cleanupTmpDir = () => {
  if (isTestMode()) {
    const netTmpDir = join(tmpdir(), 'spacemesh');
    remove(netTmpDir, (err) =>
      // eslint-disable-next-line no-console
      console.error('Can not remove temporary directory on start up', err)
    );
  }
};
