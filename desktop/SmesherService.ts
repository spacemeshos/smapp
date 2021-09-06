import { ProtoGrpcType } from '../proto/smesher';
import { PostSetupOpts, PostSetupStatus, PostSetupComputeProvider } from '../shared/types';

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
    this.createNetService(PROTO_PATH, undefined, 'SmesherService');
  };

  getPostConfig = () =>
    new Promise<{ error: any; config: SmesherConfig }>((resolve) => {
      // @ts-ignore
      this.service.PostConfig({}, (error, response) => {
        if (error) {
          logger.error('grpc PostConfig', error);
          resolve({ error, config: {} as SmesherConfig });
        } else {
          const { bitsPerLabel, labelsPerUnit, minNumUnits, maxNumUnits } = response;
          resolve({ error: null, config: { bitsPerLabel, labelsPerUnit: parseInt(labelsPerUnit), minNumUnits, maxNumUnits } });
        }
      });
    });

  getSmesherId = () =>
    new Promise<{ error: any; smesherId: string }>((resolve) => {
      // @ts-ignore
      this.service.SmesherID({}, (error, response) => {
        if (error) {
          logger.error('grpc SmesherID', error);
          resolve({ error, smesherId: '' });
        } else {
          const { accountId } = response;
          resolve({ error: null, smesherId: toHexString(accountId.address) });
        }
      });
    });

  getSetupComputeProviders = () =>
    new Promise<{ error: any; postSetupComputeProviders: PostSetupComputeProvider[] }>((resolve) => {
      // @ts-ignore
      this.service.PostSetupComputeProviders({ benchmark: true }, (error, response) => {
        if (error) {
          logger.error('grpc PostSetupComputeProviders', error);
          resolve({ error, postSetupComputeProviders: [] });
        } else {
          const postSetupComputeProviders: PostSetupComputeProvider[] = [];
          response.providers.forEach(({ id, model, computeApi, performance }: { id: number; model: string; computeApi: number; performance: string }) => {
            postSetupComputeProviders.push({ id, model, computeApi, performance: parseInt(performance) });
          });
          resolve({ error: null, postSetupComputeProviders });
        }
      });
    });

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

  getPostSetupStatus = () =>
    this.callService('PostSetupStatus', {})
      .then((response) => {
        const {
          status: { state, numLabelsWritten }
        } = response;
        return { postSetupState: state, numLabelsWritten: numLabelsWritten ? parseInt(numLabelsWritten) : 0 };
      })
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({}));

  getPostComputeProviders = () =>
    this.callService('PostSetupComputeProviders', { benchmark: true })
      .then(({ postComputeProvider }) => postComputeProvider.map(({ id, model, computeApi, performance }) => ({ id, model, computeApi, performance: parseInt(performance) })))
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({}));

  postDataCreationProgressStream = ({ handler }: { handler: (error: any, status: PostSetupStatus) => void }) => {
    if (!this.stream) {
      // @ts-ignore
      this.stream = this.service.PostSetupStatusStream({});
      this.stream.on('data', (response: any) => {
        const {
          status: { state, numLabelsWritten, errorMessage }
        } = response;
        const status = { filesStatus, initInProgress, bytesWritten: parseInt(bytesWritten), errorMessage, errorType };
        logger.log('grpc PostDataCreationProgressStream', status);
        // @ts-ignore
        handler(null, { postSetupState: state, numLabelsWritten: parseInt(numLabelsWritten), errorMessage });
      });
      this.stream.on('error', (error: any) => {
        this.logger.error('grpc PostDataCreationProgressStream', error);
        // @ts-ignore
        handler(error, {});
      });
      this.stream.on('end', () => {
        console.log('PostDataCreationProgressStream ended'); // eslint-disable-line no-console
        this.stream = null;
      });
    }
  };
}

export default SmesherService;
