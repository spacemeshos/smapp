import { constants as fsConstants, promises as fs } from 'fs';
import path from 'path';
import * as R from 'ramda';
import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { ipcConsts } from '../app/vars';
import {
  IPCSmesherStartupData,
  NodeConfig,
  PostSetupOpts,
  PostSetupState,
  PostSetupStatus,
} from '../shared/types';
import { configCodecByPath, delay } from '../shared/utils';
import SmesherService from './SmesherService';
import Logger from './logger';
import { readFileAsync, writeFileAsync } from './utils';
import AbstractManager from './AbstractManager';

const checkDiskSpace = require('check-disk-space');

const logger = Logger({ className: 'SmesherService' });

class SmesherManager extends AbstractManager {
  private smesherService: SmesherService;

  private readonly configFilePath: string;

  constructor(mainWindow: BrowserWindow, configFilePath: string) {
    super(mainWindow);
    this.smesherService = new SmesherService();
    this.smesherService.createService();
    this.configFilePath = configFilePath;
  }

  private loadConfig = async () => {
    const fileContent = await readFileAsync(this.configFilePath, {
      encoding: 'utf-8',
    });
    return configCodecByPath(this.configFilePath).parse(
      fileContent
    ) as NodeConfig;
  };

  private writeConfig = async (config) => {
    const data = configCodecByPath(this.configFilePath).stringify(config);
    await writeFileAsync(this.configFilePath, data);
    return true;
  };

  unsubscribe = () => {
    this.smesherService.deactivateProgressStream();
    this.smesherService.cancelStreams();
    this.unsubscribeIPC();
  };

  getSmeshingConfig = async () => {
    const config = await this.loadConfig();
    return config.smeshing || {};
  };

  getSmesherId = async () => {
    const res = await this.smesherService.getSmesherID();
    if (res.error) {
      throw res.error;
    }
    return res.smesherId;
  };

  getCurrentDataDir = async () => {
    const smeshingConfig = await this.getSmeshingConfig();
    const DEFAULT_KEYBIN_PATH = path.resolve(
      app.getPath('home'),
      './post/data'
    );
    return R.pathOr(
      DEFAULT_KEYBIN_PATH,
      ['smeshing-opts', 'smeshing-opts-datadir'],
      smeshingConfig
    );
  };

  updateSmesherState = async () => {
    await this.sendSmesherSettingsAndStartupState();
    await this.sendPostSetupComputeProviders();
  };

  serviceStartupFlow = async () => {
    const cfg = await this.sendSmesherConfig();
    if (cfg?.start) {
      // Ensure that we started service
      this.smesherService.createService();
      const { postSetupState } = await this.smesherService.getPostSetupStatus();
      // Unsubscribe first
      this.smesherService.deactivateProgressStream();
      if (postSetupState !== PostSetupState.STATE_COMPLETE) {
        // Subscribe on PoST cration progress stream ASAP
        this.smesherService.activateProgressStream(
          this.handlePostDataCreationStatusStream
        );
      }
    }
    await this.updateSmesherState();
  };

  sendSmesherSettingsAndStartupState = async (retries = 5) => {
    const { config, error } = await this.smesherService.getPostConfig();
    if (error) {
      if (retries > 5) {
        await delay(5000);
        return this.sendSmesherSettingsAndStartupState(retries - 1);
      }
    }

    const { smesherId } = await this.smesherService.getSmesherID();
    const {
      postSetupState,
      numLabelsWritten,
    } = await this.smesherService.getPostSetupStatus();
    const nodeConfig = await this.loadConfig();
    const numUnits =
      nodeConfig.smeshing?.['smeshing-opts']?.['smeshing-opts-numunits'] || 0;
    const maxFileSize =
      nodeConfig.smeshing?.['smeshing-opts']?.['smeshing-opts-maxfilesize'] ||
      0;
    const isSmeshingStarted = nodeConfig.smeshing?.['smeshing-start'] || false;

    const data: IPCSmesherStartupData = {
      config,
      smesherId: smesherId || '',
      isSmeshingStarted,
      postSetupState,
      numLabelsWritten,
      numUnits,
      maxFileSize,
    };

    this.mainWindow.webContents.send(
      ipcConsts.SMESHER_SET_SETTINGS_AND_STARTUP_STATUS,
      data
    );

    if (PostSetupState.STATE_ERROR === postSetupState && retries > 0) {
      await delay(5000);
      return this.sendSmesherSettingsAndStartupState(retries - 1);
    }

    return data;
  };

  sendSmesherConfig = async () => {
    // TODO: Merge with `sendSmesherSettingsAndStartupState`
    const nodeConfig = await this.loadConfig();
    if (nodeConfig.smeshing && nodeConfig.smeshing['smeshing-opts']) {
      const opts = nodeConfig.smeshing['smeshing-opts'];
      const smeshingConfig = {
        coinbase: nodeConfig.smeshing['smeshing-coinbase'],
        dataDir: opts['smeshing-opts-datadir'],
        maxFileSize: opts['smeshing-opts-maxfilesize'],
        numUnits: opts['smeshing-opts-numunits'],
        provider: opts['smeshing-opts-provider'],
        throttle: opts['smeshing-opts-throttle'],
      };
      this.mainWindow.webContents.send(ipcConsts.SMESHER_SEND_SMESHING_CONFIG, {
        smeshingConfig,
      });
      return {
        ...smeshingConfig,
        start: nodeConfig.smeshing['smeshing-start'],
      };
    }
    return null;
  };

  sendPostSetupComputeProviders = async () => {
    const {
      error,
      providers,
    } = await this.smesherService.getSetupComputeProviders();
    this.mainWindow.webContents.send(
      ipcConsts.SMESHER_SET_SETUP_COMPUTE_PROVIDERS,
      { error, providers }
    );
  };

  getCoinbase = () => this.smesherService.getCoinbase();

  subscribeIPCEvents() {
    // handlers
    const selectPostFolder = async () => {
      return this.selectPostFolder({ mainWindow: this.mainWindow });
    };
    const smesherCheckFreeSpace = async (_event, request) => {
      return this.selectPostFolder({ ...request });
    };
    const getCoinbase = () => this.smesherService.getCoinbase();
    const setCoinbase = async (_event, { coinbase }) => {
      // TODO: Unused handler
      const res = await this.smesherService.setCoinbase({ coinbase });
      const config = await this.loadConfig();
      config.smeshing['smeshing-coinbase'] = coinbase;
      await this.writeConfig(config);
      return res;
    };
    const getMinGas = () => this.smesherService.getMinGas();
    const getEstimatedRewards = () => this.smesherService.getEstimatedRewards();

    ipcMain.handle(ipcConsts.SMESHER_SELECT_POST_FOLDER, selectPostFolder);
    ipcMain.handle(ipcConsts.SMESHER_CHECK_FREE_SPACE, smesherCheckFreeSpace);
    ipcMain.handle(
      ipcConsts.SMESHER_STOP_SMESHING,
      async (_event, { deleteFiles }: { deleteFiles?: boolean }) => {
        const res = await this.smesherService.stopSmeshing({
          deleteFiles: deleteFiles || false,
        });
        const config = await this.loadConfig();
        if (deleteFiles) {
          config.smeshing['smeshing-start'] = false;
          config.smeshing['smeshing-coinbase'] = '';
          config.smeshing['smeshing-opts']['smeshing-opts-datadir'] =
            '~/.spacemesh';
        } else {
          config.smeshing['smeshing-start'] = false;
        }
        await this.writeConfig(config);
        return res?.error;
      }
    );
    ipcMain.handle(ipcConsts.SMESHER_GET_COINBASE, getCoinbase);
    ipcMain.handle(ipcConsts.SMESHER_SET_COINBASE, setCoinbase);
    ipcMain.handle(ipcConsts.SMESHER_GET_MIN_GAS, getMinGas);
    ipcMain.handle(
      ipcConsts.SMESHER_GET_ESTIMATED_REWARDS,
      getEstimatedRewards
    );

    return () => {
      ipcMain.removeHandler(ipcConsts.SMESHER_SELECT_POST_FOLDER);
      ipcMain.removeHandler(ipcConsts.SMESHER_CHECK_FREE_SPACE);
      ipcMain.removeHandler(ipcConsts.SMESHER_STOP_SMESHING);
      ipcMain.removeHandler(ipcConsts.SMESHER_GET_COINBASE);
      ipcMain.removeHandler(ipcConsts.SMESHER_SET_COINBASE);
      ipcMain.removeHandler(ipcConsts.SMESHER_GET_MIN_GAS);
      ipcMain.removeHandler(ipcConsts.SMESHER_GET_ESTIMATED_REWARDS);
    };
  }

  startSmeshing = async (postSetupOpts: PostSetupOpts) =>
    this.smesherService.startSmeshing({
      ...postSetupOpts,
      handler: this.handlePostDataCreationStatusStream,
    });

  updateSmeshingConfig = async (postSetupOpts: PostSetupOpts) => {
    const {
      coinbase,
      dataDir,
      numUnits,
      computeProviderId,
      throttle,
      maxFileSize,
    } = postSetupOpts;

    const config = await this.loadConfig();
    config.smeshing = {
      'smeshing-coinbase': coinbase,
      'smeshing-opts': {
        'smeshing-opts-datadir': dataDir,
        'smeshing-opts-maxfilesize': maxFileSize,
        'smeshing-opts-numunits': numUnits,
        'smeshing-opts-provider': computeProviderId,
        'smeshing-opts-throttle': throttle,
      },
      'smeshing-start': true,
    };
    return this.writeConfig(config);
  };

  selectPostFolder = async ({ mainWindow }: { mainWindow: BrowserWindow }) => {
    const { filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: 'Select folder for smeshing',
      defaultPath: app.getPath('documents'),
      properties: ['openDirectory'],
    });
    const res = await this.checkDiskSpace({ dataDir: filePaths[0] });
    if (res.error) {
      return { error: res.error };
    }

    const isEmpty = await this.isEmptyDir(filePaths[0]);

    if (!isEmpty) {
      await dialog.showMessageBox(mainWindow, {
        message:
          "Important information! \n The folder should be empty only for the new Genesis ID and for the new account. \n Otherwise the Smeshing process won't start",
        type: 'warning',
      });
    }

    return {
      dataDir: filePaths[0],
      calculatedFreeSpace: res.calculatedFreeSpace,
    };
  };

  checkDiskSpace = async ({ dataDir }: { dataDir: string }) => {
    try {
      await fs.access(dataDir, fsConstants.W_OK);
      const diskSpace = await checkDiskSpace(dataDir);
      logger.log('checkDiskSpace', diskSpace.free, { dataDir });
      return { calculatedFreeSpace: diskSpace.free };
    } catch (error) {
      logger.error('checkDiskSpace', error, { dataDir });
      return { error };
    }
  };

  isEmptyDir = async (path: string) => {
    try {
      const directory = await fs.opendir(path);
      const entry = await directory.read();
      await directory.close();

      return entry === null;
    } catch (error) {
      logger.error('isEmptyDir', error, { dataDir: path });
      return false;
    }
  };

  handlePostDataCreationStatusStream = (
    error: any,
    status: Partial<PostSetupStatus>
  ) => {
    this.mainWindow.webContents.send(
      ipcConsts.SMESHER_POST_DATA_CREATION_PROGRESS,
      { error, status }
    );
  };

  isSmeshing = async () => {
    const smeshing = (await this.smesherService.isSmeshing()).isSmeshing;
    const status = (await this.smesherService.getPostSetupStatus())
      .postSetupState;
    return (
      smeshing ||
      status === PostSetupState.STATE_IN_PROGRESS ||
      status === PostSetupState.STATE_COMPLETE
    );
  };
}

export default SmesherManager;
