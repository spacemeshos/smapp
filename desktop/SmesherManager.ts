import fs from 'fs';
import { app, ipcMain, dialog, BrowserWindow } from 'electron';
import { ipcConsts } from '../app/vars';
import SmesherService from './SmesherService';
import StoreService from './storeService';
import Logger from './logger';

const checkDiskSpace = require('check-disk-space');

const logger = Logger({ className: 'SmesherService' });

// Status type:
// The status code, which should be an enum value of [google.rpc.Code][google.rpc.Code].
// int32 code = 1;
// A developer-facing error message, which should be in English. Any
// user-facing error message should be localized and sent in the
// [google.rpc.Status.details][google.rpc.Status.details] field, or localized by the client.
// string message = 2;
// A list of messages that carry the error details.  There is a common set of
// message types for APIs to use.
// repeated google.protobuf.Any details = 3;

// notificationsService.notify({
//   title: 'Spacemesh',
//   notification: 'Your Smesher setup is complete! You are now participating in the Spacemesh network!',
//   callback: () => this.handleNavigation({ index: 0 })
// });

class SmesherManager {
  private smesherService: any;

  constructor(mainWindow: BrowserWindow) {
    this.subscribeToEvents(mainWindow);
    this.smesherService = new SmesherService();
    this.smesherService.createService();
  }

  subscribeToEvents = (mainWindow: BrowserWindow) => {
    ipcMain.handle(ipcConsts.SMESHER_GET_SETTINGS, () => {
      const savedSmeshingParams = StoreService.get('smeshingParams');
      const coinbase = savedSmeshingParams?.coinbase;
      const dataDir = savedSmeshingParams?.dataDir;
      return { coinbase, dataDir };
    });
    ipcMain.handle(ipcConsts.SMESHER_SELECT_POST_FOLDER, async () => {
      const res = await this.selectPostFolder({ mainWindow });
      return res;
    });
    ipcMain.handle(ipcConsts.SMESHER_CHECK_FREE_SPACE, async (_event, request) => {
      const res = await this.selectPostFolder({ ...request });
      return res;
    });
    ipcMain.handle(ipcConsts.SMESHER_IS_SMESHING, async () => {
      const res = await this.smesherService.isSmeshing();
      return res;
    });
    ipcMain.handle(ipcConsts.SMESHER_START_SMESHING, async (_event, request) => {
      const res = await this.smesherService.startSmeshing({ ...request });
      return res;
    });
    ipcMain.handle(ipcConsts.SMESHER_STOP_SMESHING, async (_event, request) => {
      const res = await this.smesherService.stopSmeshing({ ...request });
      return res;
    });
    ipcMain.handle(ipcConsts.SMESHER_GET_SMESHER_ID, async () => {
      const res = await this.smesherService.getSmesherID();
      return res;
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
    ipcMain.handle(ipcConsts.SMESHER_GET_POST_STATUS, async () => {
      const res = await this.smesherService.getPostStatus();
      return res;
    });
    ipcMain.handle(ipcConsts.SMESHER_GET_POST_COMPUTE_PROVIDERS, async () => {
      const res = await this.smesherService.getPostComputeProviders();
      return res;
    });
    ipcMain.handle(ipcConsts.SMESHER_CREATE_POST_DATA, async (_event, request) => {
      const res = await this.smesherService.createPostData({ ...request, handler: this.handlePostDataCreationStatusStream });
      return res;
    });
    ipcMain.handle(ipcConsts.SMESHER_STOP_POST_DATA_CREATION, async (_event, request) => {
      const res = await this.smesherService.stopPostDataCreationSession({ ...request });
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

  handlePostDataCreationStatusStream = () => {};
}

export default SmesherManager;
