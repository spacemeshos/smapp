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
import NodeManager from '../../NodeManager';
import WalletManager from '../../WalletManager';

let managers: Managers | null = null;

const spawnManagers = async (
  mainWindow: BrowserWindow,
  genesisID: string,
  $nodeConfig: Subject<NodeConfig>
): Promise<Managers> => {
  if (!mainWindow)
    throw new Error('Cannot spawn managers: MainWindow not found');

  // init managers
  if (!managers) {
    const smesher = new SmesherManager(mainWindow, genesisID, $nodeConfig);
    const node = new NodeManager(mainWindow, genesisID, smesher, $nodeConfig);
    const wallet = new WalletManager(mainWindow, node);

    managers = { smesher, node, wallet };
  } else {
    // update GenesisID and netName for instance
    managers.smesher.setGenesisID(genesisID);
    managers.node.setGenesisID(genesisID);

    // set up browser window
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
        from(
          spawnManagers(
            mainWindow,
            generateGenesisIDFromConfig(nodeConfig),
            $nodeConfig
          )
        )
      )
    )
    .subscribe((newManagers) => {
      $managers.next(newManagers);
    });

  return () => sub.unsubscribe();
};

export default spawnManagers$;
