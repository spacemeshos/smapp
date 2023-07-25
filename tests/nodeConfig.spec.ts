/* eslint-disable global-require */

import { generateGenesisIDFromConfig } from '../desktop/main/Networks';
import { NodeConfig } from '../shared/types';
import {
  customConfigWithNoSpecifiedLogging,
  defaultDiscoveryConfig,
  defaultDiscoveryConfigDevnet,
  defaultNodeConfigWithInitSmeshing,
  smeshingOptsFromStoreService,
} from './fixtures/config';

jest.mock('electron-fetch', () =>
  jest.fn().mockResolvedValue({
    text: () => JSON.stringify(defaultDiscoveryConfig),
  })
);
describe('NodeConfig.ts', () => {
  beforeEach(() => {
    jest.mock('fs/promises');
    jest.mock('fs');
    jest.mock('electron-store');
  });

  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  describe('download node config', () => {
    it('download fresh node config and create custom config', async () => {
      jest.mock('electron-fetch', () =>
        jest.fn().mockResolvedValue({
          text: () => JSON.stringify(defaultDiscoveryConfig),
        })
      );

      // mock StoreService , nothing to migrate
      jest.mock(
        '../desktop/storeService',
        jest.fn().mockImplementation(() => ({
          get: jest.fn().mockImplementation(() => undefined),
          remove: jest.fn().mockImplementation(() => {}),
        }))
      );

      const fsPromise = require('fs/promises');
      const { downloadNodeConfig } = require('../desktop/main/NodeConfig');

      const resultConfig = await downloadNodeConfig(
        'https://testnet-5.spacemesh.io'
      );

      const smeshingOptsResult = {
        smeshing: {
          'smeshing-opts': {
            'smeshing-opts-datadir':
              resultConfig.smeshing['smeshing-opts']['smeshing-opts-datadir'],
          },
        },
      };

      // check config after download
      expect(resultConfig).toEqual({
        ...defaultDiscoveryConfig,
        ...smeshingOptsResult,
      });

      // write opts for custom config
      expect(fsPromise.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('Electron/node-config.7f8f332c.json'),
        JSON.stringify(smeshingOptsResult, null, 2),
        { encoding: 'utf8' }
      );

      // write merged config, custom config + discovery config
      expect(fsPromise.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('Electron/node-config.json'),
        JSON.stringify({
          ...defaultDiscoveryConfig,
          ...smeshingOptsResult,
        }),
        { encoding: 'utf8' }
      );
    });

    it('download fresh node config and migrate Store service', async () => {
      jest.mock('electron-fetch', () =>
        jest.fn().mockResolvedValue({
          text: () => JSON.stringify(defaultDiscoveryConfig),
        })
      );
      // mock StoreService , to check migration
      jest.mock(
        '../desktop/storeService',
        jest.fn().mockImplementation(() => ({
          get: jest
            .fn()
            .mockImplementation(() => smeshingOptsFromStoreService.smeshing),
          remove: jest.fn().mockImplementation(() => {}),
        }))
      );

      const fsPromise = require('fs/promises');
      const { downloadNodeConfig } = require('../desktop/main/NodeConfig');

      const resultConfig = await downloadNodeConfig(
        'https://testnet-5.spacemesh.io'
      );

      // check config after download
      expect(resultConfig).toEqual({
        ...defaultDiscoveryConfig,
        ...smeshingOptsFromStoreService,
      });

      // write opts for custom config
      expect(fsPromise.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('Electron/node-config.7f8f332c.json'),
        JSON.stringify(smeshingOptsFromStoreService, null, 2),
        { encoding: 'utf8' }
      );

      // write merged config, custom config + discovery config
      expect(fsPromise.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('Electron/node-config.json'),
        JSON.stringify({
          ...defaultDiscoveryConfig,
          ...smeshingOptsFromStoreService,
        }),
        { encoding: 'utf8' }
      );
    });

    it('download config for testnet-5 and download config for testnet-6 should rewrite config file', async () => {
      // mock discovery config
      jest.mock('electron-fetch', () =>
        jest
          .fn()
          .mockResolvedValueOnce({
            text: () => JSON.stringify(defaultDiscoveryConfig),
          })
          .mockResolvedValueOnce({
            text: () => JSON.stringify(defaultDiscoveryConfigDevnet),
          })
      );

      // mock StoreService
      jest.mock(
        '../desktop/storeService',
        jest.fn().mockImplementation(() => ({
          get: jest.fn().mockImplementation(() => undefined),
          remove: jest.fn().mockImplementation(() => {}),
        }))
      );

      const fsPromise = require('fs/promises');
      const { downloadNodeConfig } = require('../desktop/main/NodeConfig');

      const resultConfigTestNet = await downloadNodeConfig(
        'https://testnet-5.spacemesh.io'
      );

      const smeshingOptsResultTestNet = {
        smeshing: {
          'smeshing-opts': {
            'smeshing-opts-datadir':
              resultConfigTestNet.smeshing['smeshing-opts'][
                'smeshing-opts-datadir'
              ],
          },
        },
      };

      // check config after download
      expect(resultConfigTestNet).toEqual({
        ...defaultDiscoveryConfig,
        ...smeshingOptsResultTestNet,
      });

      const resultConfigDevnet = await downloadNodeConfig(
        'https://devent-000.spacemesh.io'
      );

      const smeshingOptsResultDevnet = {
        smeshing: {
          'smeshing-opts': {
            'smeshing-opts-datadir':
              resultConfigDevnet.smeshing['smeshing-opts'][
                'smeshing-opts-datadir'
              ],
          },
        },
      };

      // check config after download
      expect(resultConfigDevnet).toEqual({
        ...defaultDiscoveryConfigDevnet,
        ...smeshingOptsResultDevnet,
      });

      // check datadir not equal for 2 configs and check gensisID is different
      expect(
        resultConfigTestNet.smeshing['smeshing-opts']['smeshing-opts-datadir']
      ).not.toEqual(
        resultConfigDevnet.smeshing['smeshing-opts']['smeshing-opts-datadir']
      );

      // write opts for custom config
      expect(fsPromise.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('Electron/node-config.7f8f332c.json'),
        JSON.stringify(smeshingOptsResultTestNet, null, 2),
        { encoding: 'utf8' }
      );

      // write merged config, custom config + discovery config for testnet-5
      expect(fsPromise.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('Electron/node-config.json'),
        JSON.stringify({
          ...defaultDiscoveryConfig,
          ...smeshingOptsResultTestNet,
        }),
        { encoding: 'utf8' }
      );

      expect(fsPromise.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('Electron/node-config.1ee20fed.json'),
        JSON.stringify(smeshingOptsResultDevnet, null, 2),
        { encoding: 'utf8' }
      );

      // write merged config, custom config + discovery config for standalone_network
      expect(fsPromise.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('Electron/node-config.json'),
        JSON.stringify({
          ...defaultDiscoveryConfigDevnet,
          ...smeshingOptsResultDevnet,
        }),
        { encoding: 'utf8' }
      );
    });
  });

  describe('update smeshing opts for node config', () => {
    it('expect to delete smeshing opts, update custom config', async () => {
      const fsPromises = require('fs/promises');
      const nodeConfigHelpers = require('../desktop/main/NodeConfig');

      // eslint-disable-next-line @typescript-eslint/no-unused-vars,import/no-named-as-default-member
      nodeConfigHelpers.loadCustomNodeConfig = jest
        .fn()
        .mockImplementation(() => smeshingOptsFromStoreService);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars,import/no-named-as-default-member
      nodeConfigHelpers.loadNodeConfig = jest
        .fn()
        .mockImplementation(() => defaultNodeConfigWithInitSmeshing);

      // eslint-disable-next-line import/no-named-as-default-member
      const resultConfigTestNet = await nodeConfigHelpers.updateSmeshingOpts(
        generateGenesisIDFromConfig(
          (defaultNodeConfigWithInitSmeshing as unknown) as NodeConfig
        ),
        {}
      );

      const smeshingAfterReset = {
        smeshing: {
          'smeshing-opts': {
            'smeshing-opts-datadir':
              resultConfigTestNet.smeshing['smeshing-opts'][
                'smeshing-opts-datadir'
              ],
          },
        },
      };

      expect(resultConfigTestNet).toEqual({
        ...defaultNodeConfigWithInitSmeshing,
        ...smeshingAfterReset,
      });

      // write opts for custom config
      expect(fsPromises.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('Electron/node-config.7f8f332c.json'),
        JSON.stringify(smeshingAfterReset, null, 2),
        { encoding: 'utf8' }
      );

      // write merged config, custom config + discovery config
      expect(fsPromises.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('Electron/node-config.json'),
        JSON.stringify({
          ...defaultNodeConfigWithInitSmeshing,
          ...smeshingAfterReset,
        }),
        { encoding: 'utf8' }
      );
    });

    it('expect to stop smeshing, on propriate input for updateSmeshingOpts', async () => {
      const fsPromises = require('fs/promises');
      const nodeConfigHelpers = require('../desktop/main/NodeConfig');

      // eslint-disable-next-line @typescript-eslint/no-unused-vars,import/no-named-as-default-member
      nodeConfigHelpers.loadCustomNodeConfig = jest
        .fn()
        .mockImplementation(() => smeshingOptsFromStoreService);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars,import/no-named-as-default-member
      nodeConfigHelpers.loadNodeConfig = jest
        .fn()
        .mockImplementation(() => defaultNodeConfigWithInitSmeshing);

      // eslint-disable-next-line import/no-named-as-default-member
      const resultConfigTestNet = await nodeConfigHelpers.updateSmeshingOpts(
        generateGenesisIDFromConfig(
          (defaultNodeConfigWithInitSmeshing as unknown) as NodeConfig
        ),
        { 'smeshing-start': false }
      );

      const smeshingOptsAfterReset = {
        smeshing: {
          ...smeshingOptsFromStoreService.smeshing,
          ...{ 'smeshing-start': false },
        },
      };

      expect(resultConfigTestNet).toEqual({
        ...defaultNodeConfigWithInitSmeshing,
        ...smeshingOptsAfterReset,
      });

      // write opts for custom config
      expect(fsPromises.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('Electron/node-config.7f8f332c.json'),
        JSON.stringify(smeshingOptsAfterReset, null, 2),
        { encoding: 'utf8' }
      );

      // write merged config, custom config + discovery config
      expect(fsPromises.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('Electron/node-config.json'),
        JSON.stringify({
          ...defaultNodeConfigWithInitSmeshing,
          ...smeshingOptsAfterReset,
        }),
        { encoding: 'utf8' }
      );
    });
  });

  describe('merge node config and custom config', () => {
    it('expect to rewrite whole section if 1 property defined in custom config for smeshing update', async () => {
      const fsPromises = require('fs/promises');
      const nodeConfigHelpers = require('../desktop/main/NodeConfig');
      const customConfigWithInitedSmeshingOptsAndRewriteLogging = {
        ...smeshingOptsFromStoreService,
        ...customConfigWithNoSpecifiedLogging,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars,import/no-named-as-default-member
      nodeConfigHelpers.loadCustomNodeConfig = jest
        .fn()
        .mockImplementation(
          () => customConfigWithInitedSmeshingOptsAndRewriteLogging
        );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars,import/no-named-as-default-member
      nodeConfigHelpers.loadNodeConfig = jest
        .fn()
        .mockImplementation(() => defaultNodeConfigWithInitSmeshing);

      // eslint-disable-next-line import/no-named-as-default-member
      const resultConfigTestNet = await nodeConfigHelpers.updateSmeshingOpts(
        generateGenesisIDFromConfig(
          (defaultNodeConfigWithInitSmeshing as unknown) as NodeConfig
        ),
        { 'smeshing-start': false }
      );

      const smeshingOptsAfterReset = {
        smeshing: {
          ...customConfigWithInitedSmeshingOptsAndRewriteLogging.smeshing,
          ...{ 'smeshing-start': false },
        },
        logging: customConfigWithInitedSmeshingOptsAndRewriteLogging.logging,
      };

      expect(resultConfigTestNet).toEqual({
        ...defaultNodeConfigWithInitSmeshing,
        ...smeshingOptsAfterReset,
      });

      // write opts for custom config
      expect(fsPromises.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('Electron/node-config.7f8f332c.json'),
        JSON.stringify(smeshingOptsAfterReset, null, 2),
        { encoding: 'utf8' }
      );

      // write merged config, custom config + discovery config
      expect(fsPromises.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('Electron/node-config.json'),
        JSON.stringify({
          ...defaultNodeConfigWithInitSmeshing,
          ...smeshingOptsAfterReset,
        }),
        { encoding: 'utf8' }
      );
    });

    it('expect to rewrite whole section for node-config if only 1 property defined in custom config', async () => {
      // mock discovery config
      jest.mock('electron-fetch', () =>
        jest.fn().mockResolvedValue({
          text: () => JSON.stringify(defaultDiscoveryConfig),
        })
      );

      const fs = require('fs');
      const fsPromise = require('fs/promises');
      const nodeConfigHelpers = require('../desktop/main/NodeConfig');

      fs.existsSync = jest.fn().mockImplementation(() => true);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars,import/no-named-as-default-member
      nodeConfigHelpers.loadCustomNodeConfig = jest
        .fn()
        .mockImplementation(() => customConfigWithNoSpecifiedLogging);

      // eslint-disable-next-line import/no-named-as-default-member
      const resultConfig = await nodeConfigHelpers.downloadNodeConfig(
        'https://testnet-5.spacemesh.io'
      );

      // check config after download
      expect(resultConfig).toEqual({
        ...defaultDiscoveryConfig,
        ...customConfigWithNoSpecifiedLogging,
      });
      // write merged config
      expect(fsPromise.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('Electron/node-config.json'),
        JSON.stringify({
          ...defaultDiscoveryConfig,
          ...customConfigWithNoSpecifiedLogging,
        }),
        { encoding: 'utf8' }
      );
    });
  });
});
