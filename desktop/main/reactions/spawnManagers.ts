import { BrowserWindow } from 'electron';
import {
  distinctUntilChanged,
  from,
  Observable,
  ReplaySubject,
  Subject,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { Network, NodeConfig } from '../../../shared/types';
import { Managers } from '../app.types';
import { generateGenesisIDFromConfig } from '../Networks';
import SmesherManager from '../../SmesherManager';
import NodeManager from '../../NodeManager';
import WalletManager from '../../WalletManager';

let managers: Managers | null = null;

const spawnManagers = async (
  mainWindow: BrowserWindow,
  genesisID: string,
  netName: string
): Promise<Managers> => {
  if (!mainWindow)
    throw new Error('Cannot spawn managers: MainWindow not found');

  // init managers
  if (!managers) {
    const smesher = new SmesherManager(mainWindow, genesisID, netName);
    const node = new NodeManager(mainWindow, genesisID, smesher);
    const wallet = new WalletManager(mainWindow, node);

    managers = { smesher, node, wallet };
  } else {
    // update GenesisID and netName for instance
    managers.smesher.setNetName(netName);
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
  $mainWindow: ReplaySubject<BrowserWindow>,
  $currentNetwork: Observable<Network | null>
) => {
  const sub = $nodeConfig
    .pipe(
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      withLatestFrom($mainWindow, $currentNetwork),
      switchMap(([nodeConfig, mainWindow, currentNetwork]) =>
        from(
          spawnManagers(
            mainWindow,
            generateGenesisIDFromConfig(nodeConfig),
            currentNetwork?.netName || ''
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
