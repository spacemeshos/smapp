import fs from 'fs';
import { app, ipcMain, dialog } from 'electron';
import { ipcConsts } from '../app/vars';
import NetServiceFactory from './netServiceFactory';
import { Logger } from './logger';
import StoreService from './storeService';
import { fromHexString, toHexString } from './utils';

const checkDiskSpace = require('check-disk-space');

const logger = Logger({ className: 'SmesherService' });
const getDeadline = () => new Date().setSeconds(new Date().getSeconds() + 120000);

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

class SmesherService extends NetServiceFactory {
  constructor() {
    super('proto/smesher.proto', 'localhost:9091', 'SmesherService');
  }

  subscribeToEvents = (mainWindow) => {
    ipcMain.handle(ipcConsts.SMESHER_GET_SETTINGS, () => {
      const networkId = StoreService.get({ key: 'networkId' });
      const savedSmeshingParams = StoreService.get({ key: `${networkId}-smeshingParams` });
      const coinbase = savedSmeshingParams?.coinbase;
      const dataDir = savedSmeshingParams?.dataDir;
      const genesisTime = StoreService.get({ key: `${networkId}-genesisTime` });
      const minCommitmentSize = StoreService.get({ key: `${networkId}-minCommitmentSize` });
      return { coinbase, dataDir, genesisTime, minCommitmentSize, networkId };
    });
    ipcMain.handle(ipcConsts.SMESHER_SELECT_POST_FOLDER, async () => {
      const res = await this.selectPostFolder({ mainWindow });
      return res;
    });
    ipcMain.handle(ipcConsts.SMESHER_CHECK_FREE_SPACE, async (event, request) => {
      const res = await this.selectPostFolder({ ...request });
      return res;
    });
    ipcMain.handle(ipcConsts.SMESHER_IS_SMESHING, async () => {
      const res = await this.isSmeshing();
      return res;
    });
    ipcMain.handle(ipcConsts.SMESHER_START_SMESHING, async (event, request) => {
      const res = await this.startSmeshing({ ...request });
      return res;
    });
    ipcMain.handle(ipcConsts.SMESHER_STOP_SMESHING, async (event, request) => {
      const res = await this.stopSmeshing({ ...request });
      return res;
    });
    ipcMain.handle(ipcConsts.SMESHER_GET_SMESHER_ID, async () => {
      const res = await this.getSmesherID();
      return res;
    });
    ipcMain.handle(ipcConsts.SMESHER_GET_COINBASE, async () => {
      const res = await this.getCoinbase();
      return res;
    });
    ipcMain.handle(ipcConsts.SMESHER_SET_COINBASE, async (event, request) => {
      const res = await this.setCoinbase({ ...request });
      return res;
    });
    ipcMain.handle(ipcConsts.SMESHER_GET_MIN_GAS, async () => {
      const res = await this.getMinGas();
      return res;
    });
    ipcMain.handle(ipcConsts.SMESHER_GET_ESTIMATED_REWARDS, async (event, request) => {
      const res = await this.getEstimatedRewards({ ...request });
      return res;
    });
    ipcMain.handle(ipcConsts.SMESHER_GET_POST_STATUS, async () => {
      const res = await this.getPostStatus();
      return res;
    });
    ipcMain.handle(ipcConsts.SMESHER_GET_POST_COMPUTE_PROVIDERS, async () => {
      const res = await this.getPostComputeProviders();
      return res;
    });
    ipcMain.handle(ipcConsts.SMESHER_CREATE_POST_DATA, async () => {
      const res = await this.createPostData();
      return res;
    });
    ipcMain.handle(ipcConsts.SMESHER_STOP_POST_DATA_CREATION, async (event, request) => {
      const res = await this.stopPostDataCreationSession({ ...request });
      return res;
    });
  };

  selectPostFolder = async ({ mainWindow }) => {
    const { filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: 'Select folder for smeshing',
      defaultPath: app.getPath('documents'),
      properties: ['openDirectory']
    });
    const res = await this.checkDiskSpace({ folderPath: filePaths[0] });
    if (res.error) {
      return { error: res.error };
    }
    return { selectedFolder: filePaths[0], freeSpace: res.freeSpace };
  };

  checkDiskSpace = async ({ folder }) => {
    try {
      fs.accessSync(folder, fs.constants.W_OK);
      const diskSpace = await checkDiskSpace(folder);
      logger.log(`checkDiskSpace`, diskSpace.free, { folder });
      return { freeSpace: diskSpace.free };
    } catch (error) {
      logger.error('checkDiskSpace', error, { folder });
      return { error };
    }
  };

  isSmeshing = () =>
    new Promise((resolve) => {
      this.service.IsSmeshing({}, { deadline: new Date().setSeconds(new Date().getSeconds() + 200) }, (error, response) => {
        if (error) {
          logger.error('grpc isSmeshing', error);
          resolve({ error });
        }
        logger.log('grpc isSmeshing', response.is_smeshing);
        resolve({ isSmeshing: response.is_smeshing });
      });
    });

  startSmeshing = ({ dataDir, commitmentSize, coinbase }) =>
    new Promise((resolve) => {
      // const networkId = StoreService.get({ key: 'networkId' });
      // StoreService.set({ key: `${networkId}-smeshingParams`, value: { dataDir, coinbase } });
      this.service.StartSmeshing(
        { coinbase: fromHexString(coinbase.substring(2)), data_dir: dataDir, commitment_size: commitmentSize },
        { deadline: getDeadline() },
        (error, response) => {
          if (error) {
            logger.error('grpc StartSmeshing', error, { dataDir, commitmentSize, coinbase });
            resolve({ error });
          }
          logger.log('grpc StartSmeshing', response.status, { dataDir, commitmentSize, coinbase });
          resolve({ status: response.status });
        }
      );
    });

  stopSmeshing = ({ deleteFiles }) =>
    new Promise((resolve) => {
      this.service.StopSmeshing({ delete_files: !!deleteFiles }, { deadline: getDeadline() }, (error, response) => {
        if (error) {
          logger.error('grpc StopSmeshing', error, { deleteFiles });
          resolve({ error });
        }
        logger.log('grpc StopSmeshing', response.status, { deleteFiles });
        resolve({ status: response.status });
      });
    });

  getSmesherID = () =>
    new Promise((resolve) => {
      this.service.SmesherID({}, { deadline: getDeadline() }, (error, response) => {
        if (error) {
          logger.error('grpc SmesherID', error);
          resolve({ error });
        }
        const smesherId = `0x${toHexString(response.account_id.address)}`;
        logger.log('grpc SmesherID', smesherId);
        resolve({ smesherId });
      });
    });

  getCoinbase = () =>
    new Promise((resolve) => {
      this.service.Coinbase({}, { deadline: getDeadline() }, (error, response) => {
        if (error) {
          logger.error('grpc Coinbase', error);
          resolve({ error });
        }
        const coinbase = `0x${toHexString(response.account_id.address)}`;
        logger.log('grpc Coinbase', coinbase);
        resolve({ coinbase });
      });
    });

  setCoinbase = ({ coinbase }) =>
    new Promise((resolve) => {
      this.service.SetCoinbase({ id: { address: fromHexString(coinbase.substring(2)) } }, { deadline: getDeadline() }, (error, response) => {
        if (error) {
          logger.error('grpc SetCoinbase', error, { coinbase });
          resolve({ error });
        }
        logger.log('grpc SetCoinbase', response.status, { coinbase });
        const networkId = StoreService.get({ key: 'networkId' });
        const savedSmeshingParams = StoreService.get({ key: `${networkId}-smeshingParams` });
        StoreService.set({ key: `${networkId}-smeshingParams`, value: { dataDir: savedSmeshingParams.dataDir, coinbase } });
        resolve({ status: response.status });
      });
    });

  getMinGas = () =>
    new Promise((resolve) => {
      this.service.MinGas({}, { deadline: getDeadline() }, (error, response) => {
        if (error) {
          logger.error('grpc MinGas', error);
          response({ error });
        }
        const minGas = parseInt(response.mingas.value);
        logger.log('grpc MinGas', minGas);
        resolve({ minGas });
      });
    });

  getEstimatedRewards = () =>
    new Promise((resolve) => {
      this.service.EstimatedRewards({}, { deadline: getDeadline() }, (error, response) => {
        if (error) {
          logger.error('grpc EstimatedRewards', error);
          resolve({ error });
        }
        const estimatedRewards = { amount: parseInt(response.amount.value), commitmentSize: parseInt(response.data_size) };
        logger.log('grpc EstimatedRewards', { estimatedRewards });
        resolve({ estimatedRewards });
      });
    });

  getPostStatus = () =>
    //     enum FilesStatus {
    //         FILES_STATUS_UNSPECIFIED = 0; // Lane's favorite impossible value
    //         FILES_STATUS_NOT_FOUND = 1; // Expected data files do not exist
    //         FILES_STATUS_PARTIAL = 2; // Some files exist and init can be continued (and may be in progress)
    //         FILES_STATUS_COMPLETE = 3; // Expected data files are available and verified
    //     }
    //     enum ErrorType {
    //         ERROR_TYPE_UNSPECIFIED = 0; // Lane's favorite impossible value
    //         ERROR_TYPE_FILE_NOT_FOUND = 1; // All expected post data files not found in expected path
    //         ERROR_TYPE_READ_ERROR = 2; // Failure to read from a data file
    //         ERROR_TYPE_WRITE_ERROR = 3; // Failure to write to a data file
    //     }
    new Promise((resolve) => {
      this.service.PostStatus({}, { deadline: getDeadline() }, (error, response) => {
        if (error) {
          logger.error('grpc PostStatus', error);
          resolve({ error });
        }
        const {
          status: { files_status, init_in_progress, bytes_written, error_message, error_type } // eslint-disable-line camelcase
        } = response;
        const status = { filesStatus: files_status, initInProgress: init_in_progress, bytesWritten: parseInt(bytes_written), errorMessage: error_message, errorType: error_type };
        logger.log('grpc PostStatus', status);
        resolve({ status });
      });
    });

  getPostComputeProviders = () =>
    // enum ComputeApiClass {
    //     COMPUTE_API_CLASS_UNSPECIFIED = 0;
    //     COMPUTE_API_CLASS_CPU = 1; // useful for testing on systems without a cuda or vulkan GPU
    //     COMPUTE_API_CLASS_CUDA = 2;
    //     COMPUTE_API_CLASS_VULKAN = 3;
    // }
    new Promise((resolve) => {
      this.service.PostComputeProviders({}, { deadline: getDeadline() }, (error, response) => {
        if (error) {
          logger.error('grpc PostComputeProviders', error);
          resolve({ error });
        }
        const postComputeProviders = [];
        // eslint-disable-next-line camelcase
        response.post_compute_provider.forEach(({ id, model, compute_api, performance }) => {
          postComputeProviders.push({ id: parseInt(id), model, computeApi: compute_api, performance: parseInt(performance) });
        });
        logger.log('grpc PostComputeProviders', postComputeProviders);
        resolve({ postComputeProviders });
      });
    });

  createPostData = ({ path, commitmentSize, append, throttle, providerId }) =>
    // string path = 1; // User provided path to create the post data files at
    //     uint64 data_size = 2; // Requested post data size
    //     bool   append = 3; // Append to existing files if they exist. Otherwise overwrite.
    //     bool   throttle = 4; // Throttle down setup phase computations while user is interactive on system
    //     uint32 provider_id = 5; // A PostProvider id
    new Promise((resolve) => {
      this.service.CreatePostData({ data: { path, data_size: commitmentSize, append, throttle, provider_id: providerId } }, { deadline: getDeadline() }, (error, response) => {
        if (error) {
          logger.error('grpc CreatePostData', error, { path, commitmentSize, append, throttle, providerId });
          resolve({ error });
        }
        this.postDataCreationProgressStream();
        logger.log('grpc CreatePostData', response.status, { path, commitmentSize, append, throttle, providerId });
        resolve({ status: response.status });
      });
    });

  stopPostDataCreationSession = ({ deleteFiles }) =>
    new Promise((resolve, reject) => {
      this.service.StopPostDataCreationSession({ delete_files: deleteFiles }, { deadline: getDeadline() }, (error, response) => {
        if (error) {
          logger.error('grpc StopPostDataCreationSession', error, { deleteFiles });
          reject(error);
        }
        logger.log('grpc StopPostDataCreationSession', response.status, { deleteFiles });
        resolve({ status: response.status });
      });
    });

  postDataCreationProgressStream = () => {
    //     enum FilesStatus {
    //         FILES_STATUS_UNSPECIFIED = 0; // Lane's favorite impossible value
    //         FILES_STATUS_NOT_FOUND = 1; // Expected data files do not exist
    //         FILES_STATUS_PARTIAL = 2; // Some files exist and init can be continued (and may be in progress)
    //         FILES_STATUS_COMPLETE = 3; // Expected data files are available and verified
    //     }
    //     enum ErrorType {
    //         ERROR_TYPE_UNSPECIFIED = 0; // Lane's favorite imposible value
    //         ERROR_TYPE_FILE_NOT_FOUND = 1; // All expected post data files not found in expected path
    //         ERROR_TYPE_READ_ERROR = 2; // Failure to read from a data file
    //         ERROR_TYPE_WRITE_ERROR = 3; // Failure to write to a data file
    //     }
    const stream = this.service.PostDataCreationProgressStream({});
    stream.on('data', (response) => {
      const {
        status: { files_status, init_in_progress, bytes_written, error_message, error_type } // eslint-disable-line camelcase
      } = response;
      const status = { filesStatus: files_status, initInProgress: init_in_progress, bytesWritten: parseInt(bytes_written), errorMessage: error_message, errorType: error_type };
      logger.log('grpc PostDataCreationProgressStream', status);
      ipcMain.send(ipcConsts.SMESHER_POST_DATA_CREATION_PROGRESS, { status });
    });
    stream.on('error', (error) => {
      logger.error('grpc PostDataCreationProgressStream', error);
      ipcMain.send(ipcConsts.SMESHER_POST_DATA_CREATION_PROGRESS, { error });
    });
    stream.on('end', () => {
      console.log('PostDataCreationProgressStream ended'); // eslint-disable-line no-console
    });
  };
}

export default SmesherService;
