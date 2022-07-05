import { ProtoGrpcType } from '../proto/smesher';
import {
  PostSetupOpts,
  PostSetupState,
  PostSetupStatus,
} from '../shared/types';

import { PostSetupStatusStreamResponse__Output } from '../proto/spacemesh/v1/PostSetupStatusStreamResponse';
import { SmesherIDResponse__Output } from '../proto/spacemesh/v1/SmesherIDResponse';

import Logger from './logger';
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

class SmesherService extends NetServiceFactory<
  ProtoGrpcType,
  'SmesherService'
> {
  private stream: ReturnType<
    Service<ProtoGrpcType, 'SmesherService'>['PostSetupStatusStream']
  > | null = null;

  logger = Logger({ className: 'SmesherService' });

  createService = () => {
    this.createNetService(PROTO_PATH, undefined, 'SmesherService');
  };

  getPostConfig = () =>
    this.callService('PostConfig', {})
      .then(({ bitsPerLabel, labelsPerUnit, minNumUnits, maxNumUnits }) => ({
        config: {
          bitsPerLabel,
          labelsPerUnit: parseInt(labelsPerUnit.toString()),
          minNumUnits,
          maxNumUnits,
        },
      }))
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({ config: {} }));

  getSmesherId = () =>
    this.callService('SmesherID', {})
      .then(({ accountId }) => ({
        smesherId: accountId ? toHexString(accountId.address) : '',
      }))
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({ smesherId: '' }));

  getSetupComputeProviders = () =>
    this.callService('PostSetupComputeProviders', { benchmark: true })
      .then((response) => ({
        providers: response.providers.map(
          ({ id, model, computeApi, performance = 0 }) => ({
            id,
            model,
            computeApi,
            performance: parseInt(performance.toString()),
          })
        ),
      }))
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({ providers: [] }));

  isSmeshing = () =>
    this.callService('IsSmeshing', {})
      .then((response) => ({
        ...response,
        isSmeshing: response?.isSmeshing || false,
      }))
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({ isSmeshing: false }));

  startSmeshing = ({
    coinbase,
    dataDir,
    numUnits,
    numFiles,
    computeProviderId,
    throttle,
    handler,
  }: PostSetupOpts & {
    handler: (error: Error, status: Partial<PostSetupStatus>) => void;
  }) =>
    this.callService('StartSmeshing', {
      coinbase: { address: fromHexString(coinbase.substring(2)) },
      opts: {
        dataDir,
        numUnits,
        numFiles,
        computeProviderId,
        throttle,
      },
    }).then((response) => {
      this.postDataCreationProgressStream(handler);
      return response.status;
    });

  activateProgressStream = (
    handler: (error: Error, status: Partial<PostSetupStatus>) => void
  ) => this.postDataCreationProgressStream(handler);

  deactivateProgressStream = () => {
    if (this.stream) {
      this.stream.cancel();
      this.stream = null;
      return true;
    }
    return false;
  };

  stopSmeshing = ({ deleteFiles }: { deleteFiles: boolean }) =>
    this.callService('StopSmeshing', { deleteFiles })
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({}));

  getSmesherID = () =>
    this.callService('SmesherID', {})
      .then((response: SmesherIDResponse__Output) => ({
        smesherId: `0x${
          response.accountId ? toHexString(response.accountId.address) : '00'
        }`,
      }))
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({ smesherId: '' }));

  getCoinbase = () =>
    this.callService('Coinbase', {})
      .then((response) => ({
        coinbase: response.accountId
          ? `0x${toHexString(response.accountId.address)}`
          : '0x00',
      }))
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({ coinbase: '0x00' }));

  setCoinbase = ({ coinbase }: { coinbase: string }) =>
    this.callService('SetCoinbase', {
      id: { address: fromHexString(coinbase) },
    })
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({}));

  getMinGas = () =>
    this.callService('MinGas', {})
      .then((response) => ({
        minGas: response.mingas
          ? parseInt(response.mingas.value.toString())
          : null,
      }))
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({}));

  getEstimatedRewards = () =>
    this.callService('EstimatedRewards', {})
      .then((response) => {
        const estimatedRewards = {
          amount: parseInt(response.amount?.value?.toString() || '0'),
          commitmentSize: response.numUnits,
        };
        return { estimatedRewards };
      })
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({}));

  getPostSetupStatus = () =>
    this.callService('PostSetupStatus', {})
      .then((response) => {
        const { status } = response;
        if (status === null) {
          throw new Error('PostSetupStatus is null');
        }
        const { state, numLabelsWritten, errorMessage } = status;
        return {
          postSetupState: state,
          numLabelsWritten: numLabelsWritten
            ? parseInt(numLabelsWritten.toString())
            : 0,
          errorMessage,
        };
      })
      .then(this.normalizeServiceResponse)
      .catch(
        this.normalizeServiceError({
          postSetupState: PostSetupState.STATE_UNSPECIFIED,
          numLabelsWritten: 0,
          errorMessage: '',
        })
      );

  private postDataCreationProgressStream = (
    handler: (error: any, status: Partial<PostSetupStatus>) => void
  ) => {
    if (!this.service) {
      throw new Error(`SmesherService is not running`);
    }
    if (!this.stream) {
      let streamError = null;
      this.stream = this.service.PostSetupStatusStream({});
      this.stream.on(
        'data',
        (response: PostSetupStatusStreamResponse__Output) => {
          const { status } = response;
          if (status === null) return; // TODO
          const { state, numLabelsWritten, errorMessage, opts } = status;
          this.logger.log('grpc PostDataCreationProgressStream', {
            state,
            numLabelsWritten,
            errorMessage,
          });
          handler(null, {
            postSetupState: state,
            numLabelsWritten: numLabelsWritten
              ? parseInt(numLabelsWritten.toString())
              : 0,
            errorMessage,
            opts: opts as PostSetupOpts | null,
          });
          streamError = null;
        }
      );
      this.stream.on('error', (error: any) => {
        this.logger.error('grpc PostDataCreationProgressStream', error);
        // @ts-ignore
        handler(error, {}); // TODO
        streamError = error;
      });
      this.stream.on('end', async () => {
        if (!streamError) {
          // In case if Smeshing is done it just closes the stream
          // so we have to notify client on Smesher Post Setup Status
          // Expected: STATE_COMPLETE and numLabelsWritten > 0
          const status = await this.getPostSetupStatus();
          handler(null, status);
          this.stream = null;
        }
        console.log('PostDataCreationProgressStream ended'); // eslint-disable-line no-console
        this.stream = null;
      });
    }
  };
}

export default SmesherService;
