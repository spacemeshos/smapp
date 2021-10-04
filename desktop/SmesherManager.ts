import fs from 'fs';
import { app, ipcMain, dialog, BrowserWindow } from 'electron';
import { ipcConsts } from '../app/vars';
import { IPCSmesherStartupData, PostSetupOpts, PostSetupStatus } from '../shared/types';
import SmesherService from './SmesherService';
import StoreService from './storeService';
import Logger from './logger';
import { readFileAsync, writeFileAsync } from './utils';

const checkDiskSpace = require('check-disk-space');

const logger = Logger({ className: 'SmesherService' });

class SmesherManager {
  private smesherService: SmesherService;

  private readonly mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.subscribeToEvents(mainWindow);
    this.smesherService = new SmesherService();
    this.smesherService.createService();
    this.mainWindow = mainWindow;
  }

  serviceStartupFlow = async () => {
    await this.sendSmesherSettingsAndStartupState();
    await this.sendPostSetupComputeProviders();
    await this.sendSmesherConfig();
  };

  sendSmesherSettingsAndStartupState = async () => {
    const { config } = await this.smesherService.getPostConfig();
    const { smesherId } = await this.smesherService.getSmesherID();
    const { postSetupState, numLabelsWritten, errorMessage } = await this.smesherService.getPostSetupStatus();
    const data: IPCSmesherStartupData = {
      config,
      smesherId,
      postSetupState,
      numLabelsWritten,
      errorMessage
    };
    this.mainWindow.webContents.send(ipcConsts.SMESHER_SET_SETTINGS_AND_STARTUP_STATUS, data);
  };

  sendSmesherConfig = async () => {
    const nodeConfigFilePath = StoreService.get('nodeConfigFilePath');
    const fileContent = await readFileAsync(nodeConfigFilePath);
    // @ts-ignore
    const nodeConfig = JSON.parse(fileContent);
    if (nodeConfig.smeshing) {
      const { coinbase, dataDir, numUnits, computeProviderId, throttle } = nodeConfig.smeshing;
      const smeshingConfig = { coinbase, dataDir, numUnits, computeProviderId, throttle };
      this.mainWindow.webContents.send(ipcConsts.SMESHER_SEND_SMESHING_CONFIG, { smeshingConfig });
    }
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
        const nodeConfigFilePath = StoreService.get('nodeConfigFilePath');
        const fileContent = await readFileAsync(nodeConfigFilePath);
        // @ts-ignore
        const config = JSON.parse(fileContent);
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
        await writeFileAsync(nodeConfigFilePath, JSON.stringify(config));
        StoreService.set('isSmeshing', true);
        return true;
      })
    );
    ipcMain.handle(ipcConsts.SMESHER_STOP_SMESHING, async (_event, request) => {
      const { error } = await this.smesherService.stopSmeshing({ ...request });
      return error;
    });
    ipcMain.handle(ipcConsts.SMESHER_GET_COINBASE, async () => {
      const res = await this.smesherService.getCoinbase();
      return res;
    });
    ipcMain.handle(ipcConsts.SMESHER_SET_COINBASE, async (_event, request) => {
      const res = await this.smesherService.setCoinbase({ ...request });
      return res;
    });
    ipcMain.handle(ipcConsts.SMESHER_GET_MIN_GAS, async () => {
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
}

export default SmesherManager;
