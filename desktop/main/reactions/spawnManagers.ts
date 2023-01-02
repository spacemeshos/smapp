import { BrowserWindow } from 'electron';
import {
  delay,
  distinctUntilChanged,
  ReplaySubject,
  share,
  skip,
  Subject,
  withLatestFrom,
} from 'rxjs';
import { NodeConfig } from '../../../shared/types';
import Logger from '../../logger';
import { Managers } from '../app.types';
import { generateGenesisIDFromConfig } from '../Networks';
import { withLatest } from '../rx.utils';
import SmesherManager from '../../SmesherManager';
import { NODE_CONFIG_FILE } from '../constants';
import NodeManager from '../../NodeManager';
import WalletManager from '../../WalletManager';

const logger = Logger({ className: 'rx' });

const spawnManagers = async (
  mainWindow: BrowserWindow,
  genesisID: string
): Promise<Managers> => {
  if (!mainWindow)
    throw new Error('Cannot spawn managers: MainWindow not found');

  const smesher = new SmesherManager(mainWindow, NODE_CONFIG_FILE);
  const node = new NodeManager(mainWindow, genesisID, smesher);
  const wallet = new WalletManager(mainWindow, node);

  return { smesher, node, wallet };
};

const spawnManagers$ = (
  $nodeConfig: Subject<NodeConfig>,
  $managers: Subject<Managers>,
  $mainWindow: ReplaySubject<BrowserWindow>
) => {
  const $uniqNodeCondig = $nodeConfig.pipe(
    distinctUntilChanged(
      (prev, next) => JSON.stringify(prev) === JSON.stringify(next)
    ),
    share()
  );
  const subs = [
    // If node config changed, then unsubscribe managers
    $uniqNodeCondig
      .pipe(skip(1), withLatestFrom($managers))
      .subscribe(([_, managers]) => {
        if (managers) {
          managers.wallet.unsubscribe();
          managers.smesher.unsubscribe();
          managers.node.unsubscribe();
        }
      }),
    // And then spawn new managers
    $uniqNodeCondig
      .pipe(delay(1), withLatest($mainWindow))
      .subscribe(([mw, nodeConfig]) =>
        spawnManagers(mw, generateGenesisIDFromConfig(nodeConfig))
          .then((nextManagers) => {
            $managers.next(nextManagers);
            return nextManagers;
          })
          .catch((err) =>
            logger.error(
              'spawnManagers$ > Can not spawn new managers',
              err,
              generateGenesisIDFromConfig(nodeConfig)
            )
          )
      ),
  ];
  return () => subs.forEach((unsub) => unsub.unsubscribe());
};

export default spawnManagers$;
