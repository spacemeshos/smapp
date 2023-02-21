import { BrowserWindow } from 'electron';
import { UpdateInfo } from 'electron-updater';
import {
  distinctUntilChanged,
  filter,
  first,
  interval,
  map,
  merge,
  Observable,
  sample,
  Subject,
  withLatestFrom,
} from 'rxjs';
import { ipcConsts } from '../../../app/vars';
import { Network } from '../../../shared/types';
import {
  checkUpdates,
  installUpdate,
  notifyDownloadStarted,
  subscribe,
  unsubscribe,
} from '../autoUpdater';
import { HOUR } from '../constants';
import { fromIPC } from '../rx.utils';

const handleAutoUpdates = (
  $mainWindow: Observable<BrowserWindow>,
  $currentNetwork: Observable<Network | null>
) => {
  type Data = [BrowserWindow, Network, boolean];

  const $request = new Subject<boolean>();
  const $downloaded = new Subject<UpdateInfo>();

  const $data = $currentNetwork.pipe(
    filter(Boolean),
    withLatestFrom($mainWindow),
    map(([net, mw]) => [mw, net, false] as Data)
  );

  const $first = $data.pipe(first());
  const $daily = interval(24 * HOUR).pipe(
    withLatestFrom($data),
    map(([_, data]) => data)
  );
  const $byIpcRequest = $data.pipe(
    sample($request),
    withLatestFrom($request),
    map(([[mw, cn], download]) => [mw, cn, download] as Data)
  );
  const $trigger = merge($first, $byIpcRequest, $daily).pipe(
    distinctUntilChanged(
      (prev, next) =>
        prev[1].genesisID === next[1].genesisID && prev[2] === next[2]
    )
  );

  const subs = [
    // Each time we got new mainWindow - resubscribe
    $mainWindow.subscribe((mainWnindow) => {
      unsubscribe();
      subscribe(mainWnindow, $downloaded);
    }),
    // Check for updates when: init, ipc request, daily
    $trigger.subscribe(async ([mainWindow, curNet, download]) => {
      const nextUpdateInfo = await checkUpdates(mainWindow, curNet, download);
      if (!nextUpdateInfo) return;
      if (download) {
        notifyDownloadStarted(mainWindow);
      }
    }),
    // Trigger check of updates
    fromIPC<void>(ipcConsts.AU_CHECK_UPDATES).subscribe(() =>
      $request.next(false)
    ),
    // Trigger downloading update
    fromIPC<void>(ipcConsts.AU_REQUEST_DOWNLOAD).subscribe(() => {
      $request.next(true);
    }),
    // Trigger installation
    fromIPC<void>(ipcConsts.AU_REQUEST_INSTALL).subscribe(() =>
      installUpdate()
    ),
  ];

  return () => subs.forEach((sub) => sub.unsubscribe());
};

export default handleAutoUpdates;
