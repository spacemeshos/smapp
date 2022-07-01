import { from, Subject, switchMap, withLatestFrom } from 'rxjs';
import { ipcConsts } from '../../../app/vars';
import { PostSetupOpts } from '../../../shared/types';
import Logger from '../../logger';
import { Managers } from '../app.types';
import { fromIPC, wrapResult } from '../rx.utils';

const logger = Logger({ className: 'handleSmesherIpc' });

const startSmeshing = (managers, opts) =>
  wrapResult(managers.node.startSmeshing(opts));

export default (
  $managers: Subject<Managers>,
  $smeshingStarted: Subject<void>
) => {
  const startSmeshingRequest = fromIPC<PostSetupOpts>(
    ipcConsts.SMESHER_START_SMESHING
  ).pipe(
    withLatestFrom($managers),
    switchMap(([opts, managers]) =>
      managers.node.isNodeRunning()
        ? from(startSmeshing(managers, opts))
        : from(
            managers.node.startNode().then(() => startSmeshing(managers, opts))
          )
    )
  );

  const sub = startSmeshingRequest.subscribe(([err, res]) => {
    if (err) {
      logger.error('NodeManager.startSmeshing failed', err);
    } else if (!res) {
      logger.error('NodeManager.startSmeshing not started', err, res);
    } else {
      $smeshingStarted.next();
    }
  });

  return () => sub.unsubscribe();
};
