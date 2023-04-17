import { BrowserWindow } from 'electron';
import {
  distinctUntilChanged,
  from,
  ReplaySubject,
  Subject,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { NodeConfig } from '../../../shared/types';
import { Managers } from '../app.types';
import { generateGenesisIDFromConfig } from '../Networks';
import SmesherManager from '../../SmesherManager';
import { NODE_CONFIG_FILE } from '../constants';
import NodeManager from '../../NodeManager';
import WalletManager from '../../WalletManager';

let managers: Managers | null = null;

const spawnManagers = async (
  mainWindow: BrowserWindow,
  genesisID: string
): Promise<Managers> => {
  if (!mainWindow)
    throw new Error('Cannot spawn managers: MainWindow not found');

  if (!managers) {
    const smesher = new SmesherManager(mainWindow, NODE_CONFIG_FILE, genesisID);
    const node = new NodeManager(mainWindow, genesisID, smesher);
    const wallet = new WalletManager(mainWindow, node);

    managers = { smesher, node, wallet };
  } else {
    managers.smesher.setBrowserWindow(mainWindow);
    managers.node.setBrowserWindow(mainWindow);
    managers.wallet.setBrowserWindow(mainWindow);
  }

  return managers;
};

const spawnManagers$ = (
  $nodeConfig: Subject<NodeConfig>,
  $managers: Subject<Managers>,
  $mainWindow: ReplaySubject<BrowserWindow>
) => {
  const sub = $nodeConfig
    .pipe(
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      withLatestFrom($mainWindow),
      switchMap(([nodeConfig, mainWindow]) =>
        from(spawnManagers(mainWindow, generateGenesisIDFromConfig(nodeConfig)))
      )
    )
    .subscribe((newManagers) => {
      $managers.next(newManagers);
    });

  return () => sub.unsubscribe();
};

export default spawnManagers$;
