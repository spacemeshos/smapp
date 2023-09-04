import { delay, from, retry, Subject, switchMap } from 'rxjs';
import { Managers } from '../app.types';

const isNodeReady$ = (
  $isNodeReady: Subject<void>,
  $managers: Subject<Managers>
) => {
  const sub = $managers
    .pipe(
      switchMap((managers) =>
        from(
          managers.node.isNodeAlive().then((x) => {
            if (!x) {
              throw new Error('Try again');
            }
            return x;
          })
        )
      ),
      delay(5000),
      retry()
    )
    .subscribe(() => {
      $isNodeReady.next();
    });

  return () => sub.unsubscribe();
};

export default isNodeReady$;
