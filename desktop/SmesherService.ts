import { ProtoGrpcType } from '../api/generated';
import { PostSetupStatusStreamResponse__Output } from '../api/generated/spacemesh/v1/PostSetupStatusStreamResponse';

import {
  DeviceType,
  HexString,
  PostSetupOpts,
  PostSetupState,
  PostSetupStatus,
} from '../shared/types';
import memoDebounce from '../shared/memoDebounce';
import { BITS_PER_LABEL, MINUTE } from '../shared/constants';
import { toHexString } from '../shared/utils';

import { SmesherIDsResponse__Output } from '../api/generated/spacemesh/v1/SmesherIDsResponse';
import Logger from './logger';
import NetServiceFactory, { Service } from './NetServiceFactory';
import { getPrivateNodeConnectionConfig } from './main/utils';

const PROTO_PATH = 'vendor/api/spacemesh/v1/smesher.proto';

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
  'v1',
  'SmesherService'
> {
  private stream: ReturnType<
    Service<ProtoGrpcType, 'v1', 'SmesherService'>['PostSetupStatusStream']
  > | null = null;

  logger = Logger({ className: 'SmesherService' });

  createService = () => {
    this.createNetService(
      PROTO_PATH,
      getPrivateNodeConnectionConfig(),
      'v1',
      'SmesherService'
    );
  };

  getPostConfig = () =>
    this.callServiceWithRetries('PostConfig', {})
      .then(({ bitsPerLabel, labelsPerUnit, minNumUnits, maxNumUnits }) => ({
        config: {
          bitsPerLabel: bitsPerLabel > 0 ? bitsPerLabel : BITS_PER_LABEL,
          labelsPerUnit: parseInt(labelsPerUnit.toString()),
          minNumUnits,
          maxNumUnits,
        },
      }))
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({ config: {} }));

  getSetupProviders = () =>
    this.callServiceWithRetries('PostSetupProviders', {
      benchmark: true,
    })
      .then((response) => ({
        providers: response.providers.map(
          ({ id, model, deviceType, performance = 0 }) => ({
            id: id ?? 0,
            model,
            deviceType: deviceType ?? DeviceType.DEVICE_CLASS_CPU,
            performance: parseInt(performance.toString()),
          })
        ),
      }))
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({ providers: [] }));

  isSmeshing = () =>
    this.callServiceWithRetries('IsSmeshing', {})
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
    maxFileSize,
    provider: providerId,
    handler,
  }: PostSetupOpts & {
    handler: (error: Error, status: Partial<PostSetupStatus>) => void;
  }) =>
    this.callService('StartSmeshing', {
      coinbase: { address: coinbase },
      opts: {
        dataDir,
        numUnits,
        maxFileSize,
        providerId,
      },
    }).then((response) => {
      this.postSetupStatusStream(handler);
      return response.status;
    });

  activateProgressStream = (
    handler: (error: Error, status: Partial<PostSetupStatus>) => void
  ) => this.postSetupStatusStream(handler);

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

  getSmesherIDs = (): Promise<{
    error: Error | null;
    smesherIds: HexString[];
  }> =>
    this.callServiceWithRetries('SmesherIDs', {})
      .then((response: SmesherIDsResponse__Output) => ({
        smesherIds: response.publicKeys.map(toHexString),
      }))
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({ smesherIds: [] }));

  getCoinbase = (): Promise<{ error: Error | null; coinbase: string }> =>
    this.callServiceWithRetries('Coinbase', {})
      .then((response): { coinbase: string } => ({
        coinbase: response.accountId ? response.accountId.address : '',
      }))
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({ coinbase: '' }));

  setCoinbase = ({ coinbase }: { coinbase: string }) =>
    this.callService('SetCoinbase', {
      id: { address: coinbase },
    })
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({}));

  getMinGas = () =>
    this.callServiceWithRetries('MinGas', {})
      .then((response) => ({
        minGas: response.mingas
          ? parseInt(response.mingas.value.toString())
          : null,
      }))
      .then(this.normalizeServiceResponse)
      .catch(this.normalizeServiceError({}));

  getEstimatedRewards = () =>
    this.callServiceWithRetries('EstimatedRewards', {})
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
    this.callServiceWithRetries('PostSetupStatus', {})
      .then((response) => {
        const { status } = response;
        if (status === null) {
          throw new Error('PostSetupStatus is null');
        }
        const { state, numLabelsWritten } = status;
        return {
          postSetupState: state,
          numLabelsWritten: numLabelsWritten
            ? parseInt(numLabelsWritten.toString())
            : 0,
        };
      })
      .then(this.normalizeServiceResponse)
      .catch(
        this.normalizeServiceError({
          postSetupState: PostSetupState.STATE_ERROR,
          numLabelsWritten: 0,
        })
      );

  private postSetupStatusStream = (
    handler: (error: any, status: Partial<PostSetupStatus>) => void
  ) => {
    const unsub = this.runStream(
      'PostSetupStatusStream',
      {},
      memoDebounce(
        0.5 * MINUTE,
        (response: PostSetupStatusStreamResponse__Output) => {
          const { status } = response;
          if (status === null) return; // TODO
          const { state, numLabelsWritten, opts } = status;
          this.logger.log('grpc PostDataCreationProgressStream', {
            state,
            numLabelsWritten,
          });
          const result = {
            postSetupState: state,
            numLabelsWritten: numLabelsWritten
              ? parseInt(numLabelsWritten.toString())
              : 0,
            opts: opts as PostSetupOpts | null,
          };
          handler(null, result);
          this.logger.log('PostSetupStatusStream', result);
          if (state === PostSetupState.STATE_COMPLETE) {
            this.logger.log(
              'PostSetupStatusStream',
              'Status complete -> closing stream'
            );
            unsub();
          }
        }
      )
    );
    return unsub;
  };
}

export default SmesherService;
