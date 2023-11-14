import { catchError, from, Subject, throwError } from 'rxjs';
import Warning from '../../../shared/warning';
import AutoStartManager from '../../AutoStartManager';
import { makeSubscription } from '../rx.utils';

export default ($warnings: Subject<Warning>) =>
  makeSubscription(
    from(AutoStartManager.syncIsAutoStartOnLoginEnabled()).pipe(
      catchError((err: any) => {
        $warnings.next(err);
        return throwError(() => err);
      })
    ),
    () => {}
  );
