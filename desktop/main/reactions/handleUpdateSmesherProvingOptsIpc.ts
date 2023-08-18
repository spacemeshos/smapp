import { from, Subject, switchMap, withLatestFrom, tap } from 'rxjs';
import { ipcConsts } from '../../../app/vars';
import { NodeConfig, PostProvingOpts } from '../../../shared/types';
import { fromIPC, wrapResult } from '../rx.utils';
import { updateSmeshingOpts } from '../NodeConfig';
import Logger from '../../logger';
import { Managers } from '../app.types';

const logger = Logger({ className: 'handleUpdateSmeshingProvingOptsIpc' });

const updateSmeshingProvingOptsAndRestartNode = async (
  managers: Managers,
  provingOpts: PostProvingOpts
) => {
  const mergedConfig = await updateSmeshingOpts(managers.node.getGenesisID(), {
    'smeshing-proving-opts': {
      'smeshing-opts-proving-nonces': provingOpts.nonces,
      'smeshing-opts-proving-threads': provingOpts.threads,
    },
  });

  if (managers.node.isNodeRunning()) {
    await managers.node.restartNode();
  }

  return mergedConfig;
};

export default (
  $managers: Subject<Managers>,
  $nodeConfig: Subject<NodeConfig>
) => {
  const updateSmeshingProvingOptsAndRestartNode$ = fromIPC<PostProvingOpts>(
    ipcConsts.SMESHER_UPDATE_PROVING_OPTS
  ).pipe(
    withLatestFrom($managers),
    switchMap(([provingOpts, managers]) =>
      from(
        wrapResult(
          updateSmeshingProvingOptsAndRestartNode(managers, provingOpts)
        )
      )
    ),
    tap(([err, res]) => {
      if (err || !res) {
        logger.error(
          `${ipcConsts.SMESHER_UPDATE_PROVING_OPTS} update failed`,
          err,
          res
        );
      } else {
        $nodeConfig.next(res);
        logger.log(
          ipcConsts.SMESHER_UPDATE_PROVING_OPTS,
          'postProvingOpts updated in the node config'
        );
      }
    })
  );

  const sub = updateSmeshingProvingOptsAndRestartNode$.subscribe();

  return () => sub.unsubscribe();
};
