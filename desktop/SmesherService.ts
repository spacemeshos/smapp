import NetServiceFactory from './netServiceFactory';
import Logger from './logger';
import StoreService from './storeService';
import { fromHexString, toHexString } from './utils';

const logger = Logger({ className: 'SmesherService' });
const getDeadline = () => new Date().setSeconds(new Date().getSeconds() + 120000);

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
    super.createNetService(PROTO_PATH, '', '', 'SmesherService');
  };

  isSmeshing = () =>
    new Promise((resolve) => {
      // @ts-ignore
      this.service.IsSmeshing({}, { deadline: new Date().setSeconds(new Date().getSeconds() + 200) }, (error, response) => {
        if (error) {
          logger.error('grpc isSmeshing', error);
          resolve({ error });
        }
        logger.log('grpc isSmeshing', response.is_smeshing);
        resolve({ isSmeshing: response.is_smeshing });
      });
    });

  startSmeshing = ({ dataDir, commitmentSize, coinbase }: { dataDir: string; commitmentSize: number; coinbase: string }) =>
    new Promise((resolve) => {
      // const netId = StoreService.get({ key: 'netId' });
      // StoreService.set({ key: `${netId}-smeshingParams`, value: { dataDir, coinbase } });
      // @ts-ignore
      this.service.StartSmeshing(
        { coinbase: fromHexString(coinbase.substring(2)), data_dir: dataDir, commitment_size: commitmentSize },
        { deadline: getDeadline() },
        (error: any, response: any) => {
          if (error) {
            logger.error('grpc StartSmeshing', error, { dataDir, commitmentSize, coinbase });
            resolve({ error });
          }
          logger.log('grpc StartSmeshing', response.status, { dataDir, commitmentSize, coinbase });
          resolve({ status: response.status });
        }
      );
    });

  stopSmeshing = ({ deleteFiles }: { deleteFiles: boolean }) =>
    new Promise((resolve) => {
      // @ts-ignore
      this.service.StopSmeshing({ W_M_SHOW_DELETE_FILEs: deleteFiles }, { deadline: getDeadline() }, (error, response) => {
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
      // @ts-ignore
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
      // @ts-ignore
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

  setCoinbase = ({ coinbase }: { coinbase: string }) =>
    new Promise((resolve) => {
      // @ts-ignore
      this.service.SetCoinbase({ id: { address: fromHexString(coinbase) } }, { deadline: getDeadline() }, (error, response) => {
        if (error) {
          logger.error('grpc SetCoinbase', error, { coinbase });
          resolve({ error });
        }
        logger.log('grpc SetCoinbase', response.status, { coinbase });
        const savedSmeshingParams = StoreService.get('smeshingParams');
        StoreService.set({ smeshingParams: { dataDir: savedSmeshingParams.dataDir, coinbase } });
        resolve({ status: response.status });
      });
    });

  getMinGas = () =>
    new Promise((resolve) => {
      // @ts-ignore
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
      // @ts-ignore
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
    new Promise((resolve) => {
      // @ts-ignore
      this.service.PostStatus({}, { deadline: getDeadline() }, (error, response) => {
        if (error) {
          logger.error('grpc PostStatus', error);
          resolve({ error });
        }
        const {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          status: { files_status, init_in_progress, bytes_written, error_message, error_type }
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
      // @ts-ignore
      this.service.PostComputeProviders({}, { deadline: getDeadline() }, (error, response) => {
        if (error) {
          logger.error('grpc PostComputeProviders', error);
          resolve({ error });
        }
        const postComputeProviders: { id: number; model: string; computeApi: string; performance: number }[] = [];
        // eslint-disable-next-line @typescript-eslint/naming-convention
        response.post_compute_provider.forEach(({ id, model, compute_api, performance }: { id: string; model: string; compute_api: string; performance: string }) => {
          postComputeProviders.push({ id: parseInt(id), model, computeApi: compute_api, performance: parseInt(performance) });
        });
        logger.log('grpc PostComputeProviders', postComputeProviders);
        resolve({ postComputeProviders });
      });
    });

  createPostData = ({
    path,
    commitmentSize,
    append,
    throttle,
    providerId,
    handler
  }: {
    path: string;
    commitmentSize: number;
    append: boolean;
    throttle: boolean;
    providerId: number;
    handler: () => void;
  }) =>
    //     string path = 1; // User provided path to create the post data files at
    //     uint64 data_size = 2; // Requested post data size
    //     bool   append = 3; // Append to existing files if they exist. Otherwise overwrite.
    //     bool   throttle = 4; // Throttle down setup phase computations while user is interactive on system
    //     uint32 provider_id = 5; // A PostProvider id
    new Promise((resolve) => {
      // @ts-ignore
      this.service.CreatePostData({ data: { path, data_size: commitmentSize, append, throttle, provider_id: providerId } }, { deadline: getDeadline() }, (error, response) => {
        if (error) {
          logger.error('grpc CreatePostData', error, { path, commitmentSize, append, throttle, providerId });
          resolve({ error });
        }
        this.postDataCreationProgressStream({ handler });
        logger.log('grpc CreatePostData', response.status, { path, commitmentSize, append, throttle, providerId });
        resolve({ status: response.status });
      });
    });

  stopPostDataCreationSession = ({ deleteFiles }: { deleteFiles: boolean }) =>
    new Promise((resolve) => {
      // @ts-ignore
      this.service.StopPostDataCreationSession({ W_M_SHOW_DELETE_FILEs: deleteFiles }, { deadline: getDeadline() }, (error, response) => {
        if (error) {
          logger.error('grpc StopPostDataCreationSession', error, { deleteFiles });
          resolve({ error });
        }
        logger.log('grpc StopPostDataCreationSession', response.status, { deleteFiles });
        resolve({ status: response.status });
      });
    });

  postDataCreationProgressStream = ({ handler }: { handler: ({ status, error }: { status: any; error: any }) => void }) => {
    if (!this.stream) {
      // @ts-ignore
      this.stream = this.service.PostDataCreationProgressStream({});
      this.stream.on('data', (response: any) => {
        const {
          // @ts-ignore
          status: { files_status, init_in_progress, bytes_written, error_message, error_type } // eslint-disable-line @typescript-eslint/naming-convention
        } = response;
        const status = { filesStatus: files_status, initInProgress: init_in_progress, bytesWritten: parseInt(bytes_written), errorMessage: error_message, errorType: error_type };
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
