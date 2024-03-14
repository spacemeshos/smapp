import { constants as fsConstants, promises as fs } from 'fs';
import path from 'path';
import * as R from 'ramda';
import { Subject } from 'rxjs';
import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import checkDiskSpace from 'check-disk-space';
import { ipcConsts } from '../app/vars';
import {
  HexString,
  IPCSmesherStartupData,
  NodeConfig,
  PostProvingOpts,
  PostSetupOpts,
  PostSetupState,
  PostSetupStatus,
} from '../shared/types';
import { Event } from '../api/generated/spacemesh/v1/Event';
import { delay, getShortGenesisId } from '../shared/utils';
import SmesherService from './SmesherService';
import Logger from './logger';
import AbstractManager from './AbstractManager';
import { safeSmeshingOpts } from './main/smeshingOpts';
import {
  loadCustomNodeConfig,
  loadNodeConfig,
  updateSmeshingOpts,
} from './main/NodeConfig';
import {
  deleteSmeshingMetadata,
  getSmeshingMetadata,
  updateSmeshingMetadata,
} from './SmesherMetadataUtils';
import AdminService from './AdminService';

import { DEFAULT_SMESHING_BATCH_SIZE } from './main/constants';

const logger = Logger({ className: 'SmesherService' });

class SmesherManager extends AbstractManager {
  private adminService: AdminService;

  private smesherService: SmesherService;

  private genesisID: string;

  private $nodeConfig: Subject<NodeConfig>;

  constructor(
    mainWindow: BrowserWindow,
    genesisID: string,
    $nodeConfig: Subject<NodeConfig>
  ) {
    super(mainWindow);
    this.adminService = new AdminService();
    this.smesherService = new SmesherService();
    this.smesherService.createService();
    this.adminService.createService();
    this.genesisID = genesisID;
    this.$nodeConfig = $nodeConfig;
  }

  unsubscribe = () => {
    this.smesherService.deactivateProgressStream();
    this.smesherService.cancelStreams();
    this.unsubscribeIPC();
  };

  getSmeshingConfig = async () => {
    const config = await loadNodeConfig();
    return config.smeshing || {};
  };

  getSmesherIds = async () => {
    const res = await this.smesherService.getSmesherIDs();
    if (res.error) {
      throw res.error;
    }
    return res.smesherIds;
  };

  getCurrentDataDir = async (genesisID: HexString) => {
    const smeshingConfig = await this.getSmeshingConfig();
    const DEFAULT_KEYBIN_PATH = path.resolve(
      app.getPath('home'),
      './post/',
      getShortGenesisId(genesisID)
    );
    return R.pathOr(
      DEFAULT_KEYBIN_PATH,
      ['smeshing-opts', 'smeshing-opts-datadir'],
      smeshingConfig
    );
  };

  setGenesisID = (id: HexString) => {
    this.genesisID = id;
  };

  updateSmesherState = async () => {
    await this.sendSmesherSettingsAndStartupState();
    await this.sendSmesherMetadata();
  };

  serviceStartupFlow = async () => {
    const cfg = await this.sendSmesherConfig();
    if (cfg?.start) {
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

    const { smesherIds } = await this.smesherService.getSmesherIDs();
    const {
      postSetupState,
      numLabelsWritten,
    } = await this.smesherService.getPostSetupStatus();
    const nodeConfig = await loadNodeConfig();
    const numUnits =
      nodeConfig.smeshing?.['smeshing-opts']?.['smeshing-opts-numunits'] || 0;
    const maxFileSize =
      nodeConfig.smeshing?.['smeshing-opts']?.['smeshing-opts-maxfilesize'] ||
      0;
    const isSmeshingStarted = nodeConfig.smeshing?.['smeshing-start'] || false;

    const data: IPCSmesherStartupData = {
      config,
      smesherIds,
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
    const nodeConfig = await loadNodeConfig();
    if (nodeConfig.smeshing && nodeConfig.smeshing['smeshing-opts']) {
      const opts = nodeConfig.smeshing['smeshing-opts'];
      const freeSpace = await this.checkDiskSpace({
        dataDir: nodeConfig.smeshing['smeshing-opts']['smeshing-opts-datadir'],
      });
      const smeshingConfig = {
        coinbase: nodeConfig.smeshing['smeshing-coinbase'],
        dataDir: opts['smeshing-opts-datadir'],
        maxFileSize: opts['smeshing-opts-maxfilesize'],
        numUnits: opts['smeshing-opts-numunits'],
        provider: opts['smeshing-opts-provider'],
      };
      this.mainWindow.webContents.send(ipcConsts.SMESHER_SEND_SMESHING_CONFIG, {
        smeshingConfig,
        freeSpace,
      });
      return {
        ...smeshingConfig,
        start: nodeConfig.smeshing['smeshing-start'],
      };
    }
    return null;
  };

  sendPostSetupProviders = async () => {
    const { error, providers } = await this.smesherService.getSetupProviders();
    this.mainWindow.webContents.send(
      ipcConsts.SMESHER_SET_SETUP_COMPUTE_PROVIDERS,
      { error, providers }
    );
  };

  sendSmesherMetadata = async () => {
    const dataDirPath = await this.getCurrentDataDir(this.genesisID);
    const metadata = await getSmeshingMetadata(dataDirPath);
    this.mainWindow.webContents.send(ipcConsts.SMESHER_METADATA_INFO, metadata);
  };

  clearSmesherMetadata = async () => {
    const dataDirPath = await this.getCurrentDataDir(this.genesisID);
    await deleteSmeshingMetadata(dataDirPath);
    this.mainWindow.webContents.send(ipcConsts.SMESHER_METADATA_INFO, {});
  };

  getCoinbase = async () => {
    // return this.smesherService.getCoinbase();
    // Node returns wrong coinbase when smeshing is paused
    // To avoid flaky behavior here is a workaround:
    const config = await this.getSmeshingConfig();
    return { coinbase: config['smeshing-coinbase'] ?? '' };
  };

  subscribeIPCEvents() {
    // handlers
    const selectPostFolder = async () => {
      return this.selectPostFolder({ mainWindow: this.mainWindow });
    };
    const getCoinbase = () => this.smesherService.getCoinbase();
    const getMinGas = () => this.smesherService.getMinGas();
    const getEstimatedRewards = () => this.smesherService.getEstimatedRewards();

    ipcMain.on(ipcConsts.REQUEST_SETUP_COMPUTE_PROVIDERS, () =>
      this.sendPostSetupProviders()
    );
    ipcMain.handle(ipcConsts.SMESHER_SELECT_POST_FOLDER, selectPostFolder);
    ipcMain.handle(
      ipcConsts.SMESHER_STOP_SMESHING,
      async (_event, { deleteFiles }: { deleteFiles?: boolean }) => {
        const res = await this.smesherService.stopSmeshing({
          deleteFiles: deleteFiles || false,
        });

        deleteFiles && (await this.clearSmesherMetadata());

        const newConfig = await updateSmeshingOpts(
          this.genesisID,
          deleteFiles ? {} : { 'smeshing-start': false }
        );

        this.$nodeConfig.next(newConfig);

        return res?.error;
      }
    );
    ipcMain.handle(ipcConsts.SMESHER_GET_COINBASE, getCoinbase);
    ipcMain.handle(ipcConsts.SMESHER_GET_MIN_GAS, getMinGas);
    ipcMain.handle(
      ipcConsts.SMESHER_GET_ESTIMATED_REWARDS,
      getEstimatedRewards
    );

    return () => {
      ipcMain.removeHandler(ipcConsts.SMESHER_SELECT_POST_FOLDER);
      ipcMain.removeHandler(ipcConsts.SMESHER_STOP_SMESHING);
      ipcMain.removeHandler(ipcConsts.SMESHER_GET_COINBASE);
      ipcMain.removeHandler(ipcConsts.SMESHER_GET_MIN_GAS);
      ipcMain.removeHandler(ipcConsts.SMESHER_GET_ESTIMATED_REWARDS);
      ipcMain.removeAllListeners(ipcConsts.REQUEST_SETUP_COMPUTE_PROVIDERS);
    };
  }

  startSmeshing = async (postSetupOpts: PostSetupOpts) =>
    this.smesherService.startSmeshing({
      ...postSetupOpts,
      handler: this.handlePostDataCreationStatusStream,
    });

  updateSmeshingConfig = async (
    postSetupOpts: PostSetupOpts,
    provingOpts: PostProvingOpts,
    genesisID: HexString
  ) => {
    const {
      coinbase,
      dataDir,
      numUnits,
      provider,
      maxFileSize,
    } = postSetupOpts;
    const { nonces, threads } = provingOpts;
    const customNodeConfig = await loadCustomNodeConfig(this.genesisID);
    const opts = safeSmeshingOpts(
      {
        'smeshing-coinbase': coinbase,
        'smeshing-opts': {
          'smeshing-opts-datadir': dataDir,
          'smeshing-opts-maxfilesize': maxFileSize,
          'smeshing-opts-numunits': numUnits,
          'smeshing-opts-provider': provider,
          'smeshing-opts-compute-batch-size': R.pathOr(
            DEFAULT_SMESHING_BATCH_SIZE,
            ['smeshing-opts', 'smeshing-opts-compute-batch-size'],
            customNodeConfig?.smeshing || {}
          ),
        },
        'smeshing-proving-opts': {
          'smeshing-opts-proving-nonces': nonces,
          'smeshing-opts-proving-threads': threads,
        },
        'smeshing-start': true,
      },
      genesisID
    );

    return updateSmeshingOpts(genesisID, opts);
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

    return res;
  };

  checkDiskSpace = async ({ dataDir }: { dataDir: string }) => {
    try {
      await fs.access(dataDir, fsConstants.W_OK);
      const diskSpace = await checkDiskSpace(dataDir);
      logger.log('checkDiskSpace', diskSpace.free, { dataDir });
      return { dataDir, calculatedFreeSpace: diskSpace.free };
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
    if (error) {
      logger.error('handlePostDataCreationStatusStream', error);
      return;
    }

    if (status.postSetupState === PostSetupState.STATE_COMPLETE) {
      // eslint-disable-next-line promise/no-promise-in-callback
      this.getCurrentDataDir(this.genesisID)
        .then((dataDirPath) =>
          updateSmeshingMetadata(dataDirPath, {
            smeshingStart: Date.now(),
          })
        )
        .then((metadata) =>
          this.mainWindow.webContents.send(
            ipcConsts.SMESHER_METADATA_INFO,
            metadata
          )
        )
        .catch((error) =>
          logger.error(
            'handlePostDataCreationStatusStream - updateSmeshingMetadata',
            error
          )
        );
    }

    this.mainWindow.webContents.send(
      ipcConsts.SMESHER_POST_DATA_CREATION_PROGRESS,
      { error, status }
    );
  };

  isSmeshing = async (): Promise<boolean> => {
    const smeshing = (await this.smesherService.isSmeshing()).isSmeshing;
    const status = (await this.smesherService.getPostSetupStatus())
      .postSetupState;
    return (
      smeshing ||
      status === PostSetupState.STATE_PREPARED ||
      status === PostSetupState.STATE_PAUSED ||
      status === PostSetupState.STATE_IN_PROGRESS ||
      status === PostSetupState.STATE_COMPLETE
    );
  };

  subscribeNodeEvents = (handler: (err: Error | null, event?: Event) => void) =>
    this.adminService.activateEventsStream(handler);
}

export default SmesherManager;
