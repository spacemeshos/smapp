import NetServiceFactory from './NetServiceFactory';
import Logger from './logger';
import StoreService from './storeService';
import { fromHexString, toHexString } from './utils';

const logger = Logger({ className: 'SmesherService' });

const PROTO_PATH = 'proto/smesher.proto';

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

class SmesherService extends NetServiceFactory {
  stream: any = null;

  createService = () => {
    this.createNetService(PROTO_PATH, '', '', 'SmesherService');
  };

  isSmeshing = () =>
    new Promise((resolve) => {
      // @ts-ignore
      this.service.IsSmeshing({}, (error, response) => {
        if (error) {
          logger.error('grpc isSmeshing', error);
          resolve({ isSmeshing: false, error });
        }
        resolve({ isSmeshing: response.isSmeshing, error: null });
      });
    });

  startSmeshing = ({
    coinbase,
    dataDir,
    commitmentSize,
    computeProviderId,
    throttle,
    handler
  }: {
    coinbase: string;
    dataDir: string;
    commitmentSize: number;
    computeProviderId: string;
    throttle: boolean;
    handler: () => void;
  }) =>
    new Promise((resolve, reject) => {
      const netId = StoreService.get('netSettings.netId');
      StoreService.set(`${netId}-smeshingParams`, { dataDir, coinbase });
      // @ts-ignore
      this.service.StartSmeshing(
        {
          coinbase: { address: fromHexString(coinbase.substring(2)) },
          opts: {
            data_dir: dataDir,
            num_units: commitmentSize,
            num_files: 1,
            compute_provider_id: computeProviderId,
            throttle
          }
        },
        (error: any, response: any) => {
          if (error) {
            logger.error('grpc StartSmeshing', error, { dataDir, commitmentSize, coinbase });
            reject(error);
          } else {
            this.postDataCreationProgressStream({ handler });
            resolve(response.status);
          }
        }
      );
    });

  stopSmeshing = ({ deleteFiles }: { deleteFiles: boolean }) =>
    new Promise((resolve) => {
      // @ts-ignore
      this.service.StopSmeshing({ W_M_SHOW_DELETE_FILEs: deleteFiles }, (error, response) => {
        if (error) {
          logger.error('grpc StopSmeshing', error, { deleteFiles });
          resolve({ error });
        } else {
          resolve({ status: response.status });
        }
      });
    });

  getSmesherID = () =>
    new Promise((resolve) => {
      // @ts-ignore
      this.service.SmesherID({}, (error, response) => {
        if (error) {
          logger.error('grpc SmesherID', error);
          resolve({ error });
        } else {
          const smesherId = `0x${toHexString(response.account_id.address)}`;
          resolve({ smesherId });
        }
      });
    });

  getCoinbase = () =>
    new Promise((resolve) => {
      // @ts-ignore
      this.service.Coinbase({}, (error, response) => {
        if (error) {
          logger.error('grpc Coinbase', error);
          resolve({ error });
        } else {
          const coinbase = `0x${toHexString(response.response.accountId.address)}`;
          resolve({ coinbase });
        }
      });
    });

  setCoinbase = ({ coinbase }: { coinbase: string }) =>
    new Promise((resolve) => {
      // @ts-ignore
      this.service.SetCoinbase({ id: { address: fromHexString(coinbase) } }, (error, response) => {
        if (error) {
          logger.error('grpc SetCoinbase', error, { coinbase });
          resolve({ error });
        } else {
          const netId = StoreService.get('netSettings.netId');
          const savedSmeshingParams = StoreService.get(`${netId}-smeshingParams`);
          StoreService.set('smeshingParams', { dataDir: savedSmeshingParams.dataDir, coinbase });
          resolve({ status: response.status });
        }
      });
    });

  getMinGas = () =>
    new Promise((resolve) => {
      // @ts-ignore
      this.service.MinGas({}, (error, response) => {
        if (error) {
          logger.error('grpc MinGas', error);
          response({ error });
        } else {
          const minGas = parseInt(response.mingas.value);
          resolve({ minGas });
        }
      });
    });

  getEstimatedRewards = () =>
    new Promise((resolve) => {
      // @ts-ignore
      this.service.EstimatedRewards({}, (error, response) => {
        if (error) {
          logger.error('grpc EstimatedRewards', error);
          resolve({ error });
        } else {
          const estimatedRewards = { amount: parseInt(response.amount.value), commitmentSize: parseInt(response.dataSize) };
          resolve({ estimatedRewards });
        }
      });
    });

  getPostStatus = () =>
    new Promise((resolve) => {
      // @ts-ignore
      this.service.PostStatus({}, (error, response) => {
        if (error) {
          logger.error('grpc PostStatus', error);
          resolve({ error });
        } else {
          const {
            status: { filesStatus, initInProgress, bytesWritten, errorMessage, errorType }
          } = response;
          const status = { filesStatus, initInProgress, bytesWritten: parseInt(bytesWritten), errorMessage, errorType };
          resolve({ status });
        }
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
      // @ts-ignore
      this.service.PostComputeProviders({ benchmark: true }, (error, response) => {
        if (error) {
          logger.error('grpc PostComputeProviders', error);
          resolve({ error });
        } else {
          // const postComputeProviders: { id: number; model: string; computeApi: string; performance: number }[] = [];
          // response.postComputeProvider.forEach(({ id, model, computeApi, performance }: { id: string; model: string; computeApi: string; performance: string }) => {
          //   postComputeProviders.push({ id: parseInt(id), model, computeApi, performance: parseInt(performance) });
          // });
          resolve({ postComputeProviders: [] });
        }
      });
    });

  stopPostDataCreationSession = ({ deleteFiles }: { deleteFiles: boolean }) =>
    new Promise((resolve) => {
      // @ts-ignore
      this.service.StopPostDataCreationSession({ W_M_SHOW_DELETE_FILEs: deleteFiles }, (error, response) => {
        if (error) {
          logger.error('grpc StopPostDataCreationSession', error, { deleteFiles });
          resolve({ error });
        } else {
          resolve({ status: response.status });
        }
      });
    });

  postDataCreationProgressStream = ({ handler }: { handler: ({ status, error }: { status: any; error: any }) => void }) => {
    if (!this.stream) {
      // @ts-ignore
      this.stream = this.service.PostDataCreationProgressStream({});
      this.stream.on('data', (response: any) => {
        const {
          status: { filesStatus, initInProgress, bytesWritten, errorMessage, errorType }
        } = response;
        const status = { filesStatus, initInProgress, bytesWritten: parseInt(bytesWritten), errorMessage, errorType };
        logger.log('grpc PostDataCreationProgressStream', status);
        // @ts-ignore
        handler({ status, error: null });
      });
      this.stream.on('error', (error: any) => {
        logger.error('grpc PostDataCreationProgressStream', error);
        // @ts-ignore
        handler({ status: null, error });
      });
      this.stream.on('end', () => {
        console.log('PostDataCreationProgressStream ended'); // eslint-disable-line no-console
      });
    }
  };
}

export default SmesherService;
