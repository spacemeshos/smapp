import {
  Observable,
  combineLatest,
  Subject,
  filter,
  distinctUntilChanged,
  map,
} from 'rxjs';
import { eqProps } from 'ramda';
import { makeSubscription } from '../rx.utils';
import {
  NodeConfig,
  NodeConfigWithDefinedSmeshing,
  Wallet,
  WalletType,
} from '../../../shared/types';
import Warning, { WarningType } from '../../../shared/warning';

const handleSmeshingProvingOptsWarning = (
  nodeConfig: NodeConfigWithDefinedSmeshing,
  $warnings: Subject<Warning>
) => {
  const isSmeshingSetUp = nodeConfig?.smeshing?.['smeshing-start'] ?? null;
  const nonces =
    nodeConfig.smeshing?.['smeshing-proving-opts']?.[
      'smeshing-opts-proving-nonces'
    ];
  const threads =
    nodeConfig.smeshing?.['smeshing-proving-opts']?.[
      'smeshing-opts-proving-threads'
    ];

  if (isSmeshingSetUp !== null && !(nonces && threads)) {
    $warnings.next(
      new Warning(WarningType.UpdateSmeshingProvingOpts, {
        payload: {},
        message: 'No smeshing-proving-opts in the user node config',
      })
    );
  }
};

export default (
  $wallet: Observable<Wallet | null>,
  $nodeConfig: Subject<NodeConfig>,
  $warnings: Subject<Warning>
) => {
  return makeSubscription(
    combineLatest([$wallet, $nodeConfig]).pipe(
      filter(
        ([wallet, nodeConfig]) =>
          nodeConfig &&
          Boolean(nodeConfig?.smeshing) &&
          wallet?.meta.type !== WalletType.RemoteApi
      ),
      map(([_, nodeConfig]) => nodeConfig as NodeConfigWithDefinedSmeshing),
      distinctUntilChanged(eqProps('smeshing'))
    ),
    (nodeConfig: NodeConfigWithDefinedSmeshing) =>
      handleSmeshingProvingOptsWarning(nodeConfig, $warnings)
  );
};
