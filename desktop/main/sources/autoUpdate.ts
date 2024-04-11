import { BrowserWindow } from 'electron';
import { UpdateInfo } from 'electron-updater';
import {
  combineLatest,
  filter,
  first,
  interval,
  map,
  merge,
  Observable,
  Subject,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { ipcConsts } from '../../../app/vars';
import { Network } from '../../../shared/types';
import {
  checkUpdates,
  installUpdate,
  notifyDownloadStarted,
  notifyDownloadManually,
  notifyNoUpdates,
  subscribe,
  unsubscribe,
  UpdateInfoStatus,
} from '../autoUpdater';
import { MINUTE } from '../../../shared/constants';
import { fromIPC } from '../rx.utils';

const handleAutoUpdates = (
  everyMs: number,
  $mainWindow: Observable<BrowserWindow>,
  $currentNetwork: Observable<Network | null>
) => {
  type DoDownload = boolean;
  type Data = [BrowserWindow, Network, DoDownload];

  const $request = new Subject<boolean>();
  const $downloaded = new Subject<UpdateInfo>();

  const $data = $currentNetwork.pipe(
    filter(Boolean),
    withLatestFrom($mainWindow),
    map(([net, mw]) => [mw, net, false] as Data)
  );

  const $first = $data.pipe(first());
  const $byInterval = interval(everyMs + MINUTE).pipe(switchMap(() => $data));
  const $byIpcRequest = $request.pipe(
    withLatestFrom($data),
    map(([download, [mw, cn]]) => [mw, cn, download] as Data)
  );
  const $trigger = merge($first, $byIpcRequest, $byInterval);

  const subs = [
    // Each time we got new mainWindow - resubscribe
    combineLatest([$mainWindow, $currentNetwork]).subscribe(
      ([mainWnindow, currentNetwork]) => {
        if (!currentNetwork) return;
        unsubscribe();
        subscribe(mainWnindow, currentNetwork, $downloaded);
      }
    ),
    // Check for updates when: init, ipc request, byInterval
    $trigger.subscribe(async ([mainWindow, curNet, download]) => {
      const nextUpdateInfo = await checkUpdates(mainWindow, curNet, download);

      if (nextUpdateInfo.status === UpdateInfoStatus.UpdateManually) {
        notifyDownloadManually(mainWindow, nextUpdateInfo.version);
      } else if (
        nextUpdateInfo.status === UpdateInfoStatus.UpdateNotAvailable
      ) {
        notifyNoUpdates(mainWindow);
      } else if (download) {
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
