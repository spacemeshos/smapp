import { ProtoGrpcType } from '../proto/smesher';
import Logger from './logger';
import StoreService from './storeService';
import { fromHexString, toHexString } from './utils';
import NetServiceFactory, { Service } from './NetServiceFactory';

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

class SmesherService extends NetServiceFactory<ProtoGrpcType, 'SmesherService'> {
  private stream: ReturnType<Service<ProtoGrpcType, 'SmesherService'>['PostDataCreationProgressStream']> | null = null;

  logger = Logger({ className: 'SmesherService' });

  createService = () => {
    this.createNetService(PROTO_PATH, '', '', 'SmesherService');
  };

  isSmeshing = () =>
    this.callService('IsSmeshing', {})
      .then((response) => ({ ...response, isSmeshing: response?.isSmeshing || false }))
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({ isSmeshing: false }));

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
    computeProviderId: number;
    throttle: boolean;
    handler: () => void;
  }) =>
    this.callService('StartSmeshing', {
      coinbase: { address: fromHexString(coinbase.substring(2)) },
      opts: {
        dataDir,
        numUnits: commitmentSize,
        numFiles: 1,
        computeProviderId,
        throttle
      }
    }).then((response) => {
      const netId = StoreService.get('netSettings.netId');
      StoreService.set(`${netId}-smeshingParams`, { dataDir, coinbase });
      this.postDataCreationProgressStream({ handler });
      return response.status;
    });

  stopSmeshing = ({ deleteFiles }: { deleteFiles: boolean }) =>
    this.callService('StopSmeshing', { deleteFiles }).then(this.normalizeServiceResponse).catch(this.normalizeServiceError({}));

  getSmesherID = () =>
    this.callService('SmesherID', {})
      .then((response) => ({ response: `0x${response.accountId ? toHexString(response.accountId.address) : '00'}` }))
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({}));

  getCoinbase = () =>
    this.callService('Coinbase', {})
      .then((response) => ({
        coinbase: response.accountId ? `0x${toHexString(response.accountId.address)}` : '0x00'
      }))
      .catch(this.normalizeServiceError({}));

  setCoinbase = ({ coinbase }: { coinbase: string }) =>
    this.callService('SetCoinbase', { id: { address: fromHexString(coinbase) } })
      .then((response) => {
        const netId = StoreService.get('netSettings.netId');
        const savedSmeshingParams = StoreService.get(`${netId}-smeshingParams`);
        StoreService.set('smeshingParams', { dataDir: savedSmeshingParams.dataDir, coinbase });
        return { status: response.status };
      })
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({}));

  getMinGas = () =>
    this.callService('MinGas', {})
      .then((response) => ({ minGas: response.mingas ? parseInt(response.mingas.value) : null }))
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({}));

  getEstimatedRewards = () =>
    this.callService('EstimatedRewards', {})
      .then((response) => {
        const estimatedRewards = { amount: parseInt(response.amount?.value || 0), commitmentSize: response.numUnits };
        return { estimatedRewards };
      })
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({}));

  getPostStatus = () =>
    this.callService('PostStatus', {})
      .then((response) => {
        // TODO: Wrong types there. Do we need it?
        //
        // const {
        //   status: { filesStatus, initInProgress, bytesWritten, errorMessage, errorType }
        // } = response;
        // const status = { filesStatus, initInProgress, bytesWritten: parseInt(bytesWritten), errorMessage, errorType };
        // return { status };
        return response;
      })
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({}));

  getPostComputeProviders = () =>
    this.callService('PostComputeProviders', { benchmark: true })
      .then(({ postComputeProvider }) => postComputeProvider.map(({ id, model, computeApi, performance }) => ({ id, model, computeApi, performance: parseInt(performance) })))
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({}));

  stopPostDataCreationSession = ({ deleteFiles }: { deleteFiles: boolean }) =>
    // TODO: No such endpoint in Service
    new Promise((resolve) => {
      // @ts-ignore
      this.service.StopPostDataCreationSession({ W_M_SHOW_DELETE_FILEs: deleteFiles }, (error, response) => {
        if (error) {
          this.logger.error('grpc StopPostDataCreationSession', error, { deleteFiles });
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
        this.logger.log('grpc PostDataCreationProgressStream', status);
        // @ts-ignore
        handler({ status, error: null });
      });
      this.stream.on('error', (error: any) => {
        this.logger.error('grpc PostDataCreationProgressStream', error);
        // @ts-ignore
        handler({ status: null, error });
      });
      this.stream.on('end', () => {
        console.log('PostDataCreationProgressStream ended'); // eslint-disable-line no-console
        this.stream = null;
      });
    }
  };
}

export default SmesherService;
