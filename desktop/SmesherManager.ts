import fs from 'fs';
import { app, ipcMain, dialog, BrowserWindow } from 'electron';
import { ipcConsts } from '../app/vars';
import { IPCSmesherStartupData, PostSetupOpts, PostSetupState, PostSetupStatus } from '../shared/types';
import SmesherService from './SmesherService';
import Logger from './logger';
import { readFileAsync, writeFileAsync } from './utils';

const checkDiskSpace = require('check-disk-space');

const logger = Logger({ className: 'SmesherService' });

class SmesherManager {
  private smesherService: SmesherService;

  private readonly mainWindow: BrowserWindow;

  private readonly configFilePath: string;

  constructor(mainWindow: BrowserWindow, configFilePath: string) {
    this.subscribeToEvents(mainWindow);
    this.smesherService = new SmesherService();
    this.smesherService.createService();
    this.mainWindow = mainWindow;
    this.configFilePath = configFilePath;
  }

  private loadConfig = async () => {
    const fileContent = await readFileAsync(this.configFilePath, { encoding: 'utf-8' });
    return JSON.parse(fileContent);
  };

  private writeConfig = async (config) => {
    await writeFileAsync(this.configFilePath, JSON.stringify(config));
    return true;
  };

  serviceStartupFlow = async () => {
    const cfg = await this.sendSmesherConfig();
    if (cfg?.start) {
      // Subscribe on PoST cration progress stream ASAP
      this.smesherService.activateProgressStream(this.handlePostDataCreationStatusStream);
    }
    await this.sendSmesherSettingsAndStartupState();
    await this.sendPostSetupComputeProviders();
  };

  sendSmesherSettingsAndStartupState = async () => {
    const { config } = await this.smesherService.getPostConfig();
    const { smesherId } = await this.smesherService.getSmesherID();
    const { postSetupState, numLabelsWritten, errorMessage } = await this.smesherService.getPostSetupStatus();
    const nodeConfig = await this.loadConfig();
    const opts = nodeConfig?.smeshing['smeshing-opts'];
    const numUnits = (opts && opts['smeshing-opts-numunits']) || 0;
    const data: IPCSmesherStartupData = {
      config,
      smesherId,
      postSetupState,
      numLabelsWritten,
      numUnits,
      errorMessage
    };
    this.mainWindow.webContents.send(ipcConsts.SMESHER_SET_SETTINGS_AND_STARTUP_STATUS, data);
  };

  sendSmesherConfig = async () => {
    // TODO: Merge with `sendSmesherSettingsAndStartupState`
    const nodeConfig = await this.loadConfig();
    if (nodeConfig.smeshing && nodeConfig.smeshing['smeshing-opts']) {
      const opts = nodeConfig.smeshing['smeshing-opts'];
      const smeshingConfig = {
        coinbase: nodeConfig.smeshing['smeshing-coinbase'],
        dataDir: opts['smeshing-opts-datadir'],
        numFiles: opts['smeshing-opts-numfiles'],
        numUnits: opts['smeshing-opts-numunits'],
        provider: opts['smeshing-opts-provider'],
        throttle: opts['smeshing-opts-throttle']
      };
      this.mainWindow.webContents.send(ipcConsts.SMESHER_SEND_SMESHING_CONFIG, { smeshingConfig });
      return { ...smeshingConfig, start: nodeConfig.smeshing['smeshing-start'] };
    }
    return null;
  };

  sendPostSetupComputeProviders = async () => {
    const { error, providers } = await this.smesherService.getSetupComputeProviders();
    this.mainWindow.webContents.send(ipcConsts.SMESHER_SET_SETUP_COMPUTE_PROVIDERS, { error, providers });
  };

  subscribeToEvents = (mainWindow: BrowserWindow) => {
    ipcMain.handle(ipcConsts.SMESHER_SELECT_POST_FOLDER, async () => {
      const res = await this.selectPostFolder({ mainWindow });
      return res;
    });
    ipcMain.handle(ipcConsts.SMESHER_CHECK_FREE_SPACE, async (_event, request) => {
      const res = await this.selectPostFolder({ ...request });
      return res;
    });
    ipcMain.handle(ipcConsts.SMESHER_START_SMESHING, async (_event, request: { postSetupOpts: PostSetupOpts }) =>
      this.smesherService.startSmeshing({ ...request.postSetupOpts, handler: this.handlePostDataCreationStatusStream }).then(async () => {
        const { coinbase, dataDir, numUnits, computeProviderId, throttle } = request.postSetupOpts;
        const config = await this.loadConfig();
        config.smeshing = {
          'smeshing-coinbase': coinbase,
          'smeshing-opts': {
            'smeshing-opts-datadir': dataDir,
            'smeshing-opts-numfiles': 1,
            'smeshing-opts-numunits': numUnits,
            'smeshing-opts-provider': computeProviderId,
            'smeshing-opts-throttle': throttle
          },
          'smeshing-start': true
        };
        return this.writeConfig(config);
      })
    );
    ipcMain.handle(ipcConsts.SMESHER_STOP_SMESHING, async (_event, { deleteFiles }: { deleteFiles?: boolean }) => {
      const res = await this.smesherService.stopSmeshing({ deleteFiles: deleteFiles || false });
      const config = await this.loadConfig();
      if (deleteFiles) {
        delete config.smeshing;
      } else {
        config.smeshing['smeshing-start'] = false;
      }
      await this.writeConfig(config);
      const error = res?.error;
      return error;
    });
    ipcMain.handle(ipcConsts.SMESHER_GET_COINBASE, async () => {
      // TODO: Unused handler
      const res = await this.smesherService.getCoinbase();
      return res;
    });
    ipcMain.handle(ipcConsts.SMESHER_SET_COINBASE, async (_event, { coinbase }) => {
      // TODO: Unused handler
      const res = await this.smesherService.setCoinbase({ coinbase });
      const config = await this.loadConfig();
      config.smeshing['smeshing-coinbase'] = coinbase;
      await this.writeConfig(config);
      return res;
    });
    ipcMain.handle(ipcConsts.SMESHER_GET_MIN_GAS, async () => {
      // TODO: Unused handler
      const res = await this.smesherService.getMinGas();
      return res;
    });
    ipcMain.handle(ipcConsts.SMESHER_GET_ESTIMATED_REWARDS, async () => {
      const res = await this.smesherService.getEstimatedRewards();
      return res;
    });
  };

  selectPostFolder = async ({ mainWindow }: { mainWindow: BrowserWindow }) => {
    const { filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: 'Select folder for smeshing',
      defaultPath: app.getPath('documents'),
      properties: ['openDirectory']
    });
    const res = await this.checkDiskSpace({ dataDir: filePaths[0] });
    if (res.error) {
      return { error: res.error };
    }
    return { dataDir: filePaths[0], calculatedFreeSpace: res.calculatedFreeSpace };
  };

  checkDiskSpace = async ({ dataDir }: { dataDir: string }) => {
    try {
      fs.accessSync(dataDir, fs.constants.W_OK);
      const diskSpace = await checkDiskSpace(dataDir);
      logger.log(`checkDiskSpace`, diskSpace.free, { dataDir });
      return { calculatedFreeSpace: diskSpace.free };
    } catch (error) {
      logger.error('checkDiskSpace', error, { dataDir });
      return { error };
    }
  };

  handlePostDataCreationStatusStream = (error: any, status: Partial<PostSetupStatus>) => {
    this.mainWindow.webContents.send(ipcConsts.SMESHER_POST_DATA_CREATION_PROGRESS, { error, status });
  };

  isSmeshing = async () => {
    const smeshing = (await this.smesherService.isSmeshing()).isSmeshing;
    const status = (await this.smesherService.getPostSetupStatus()).postSetupState;
    return smeshing || status === PostSetupState.STATE_IN_PROGRESS || status === PostSetupState.STATE_COMPLETE;
  };
}

export default SmesherManager;
