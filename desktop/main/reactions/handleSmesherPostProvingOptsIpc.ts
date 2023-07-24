import { from, Subject, switchMap, withLatestFrom } from 'rxjs';
import { ipcConsts } from '../../../app/vars';
import { PostProvingOpts } from '../../../shared/types';
import { SmeshingSetupState } from '../../NodeManager';
import Logger from '../../logger';
import { Managers } from '../app.types';
import { fromIPC, wrapResult } from '../rx.utils';

const logger = Logger({ className: 'handleSmesherOptsIpc' });

const updatePostProvingOpts = (
  managers: Managers,
  provingOpts: PostProvingOpts
) =>
  wrapResult(
    managers.smesher
      .updatePostProvingOpts(provingOpts)
      .then(() => SmeshingSetupState.ViaRestart)
  );

export default ($managers: Subject<Managers>) => {
  const startSmeshingRequest = fromIPC<PostProvingOpts>(
    ipcConsts.SMESHER_UPDATE_POST_PROVING_OPTS
  ).pipe(
    withLatestFrom($managers),
    switchMap(([provingOpts, managers]) =>
      from(updatePostProvingOpts(managers, provingOpts))
    )
  );

  const sub = startSmeshingRequest.subscribe(([err, res]) => {
    if (err) {
      logger.error('SmesherManager.updatePostProvingOpts failed', err);
    } else if (!res) {
      logger.error(
        'SmesherManager.updatePostProvingOpts not updated',
        err,
        res
      );
    }
  });

  return () => sub.unsubscribe();
};
