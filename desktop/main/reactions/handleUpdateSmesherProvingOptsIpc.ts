import { from, Subject } from 'rxjs';
import { ipcConsts } from '../../../app/vars';
import { NodeConfig, PostProvingOpts } from '../../../shared/types';
import { handleIPC, makeSubscription, wrapResult } from '../rx.utils';
import { updateSmeshingOpts } from '../NodeConfig';
import Logger from '../../logger';

const logger = Logger({ className: 'handleUpdateSmeshingOptsIpc' });

export default ($nodeConfig: Subject<NodeConfig>) =>
  makeSubscription(
    handleIPC(
      ipcConsts.SMESHER_UPDATE_PROVING_OPTS,
      ([genesisID, postProvingOpts]: [string, PostProvingOpts]) =>
        from(
          wrapResult(
            updateSmeshingOpts(genesisID, {
              'smeshing-proving-opts': {
                'smeshing-opts-proving-nonces': postProvingOpts.nonces,
                'smeshing-opts-proving-threads': postProvingOpts.threads,
              },
            })
          )
        ),
      () => true
    ),
    (nodeConfig) => {
      $nodeConfig.next(nodeConfig);
      logger.log(
        ipcConsts.SMESHER_UPDATE_PROVING_OPTS,
        'postProvingOpts updated in the node config'
      );
    }
  );
