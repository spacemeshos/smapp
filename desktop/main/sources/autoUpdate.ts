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
import { isEmpty } from 'ramda';
import { ipcConsts } from '../../../app/vars';
import { Network } from '../../../shared/types';
import { delay, isDebPackage } from '../../../shared/utils';
import Logger from '../../logger';
import StoreService from '../../storeService';
import { Managers } from '../app.types';
import {
  checkUpdates,
  getCurrentVersion,
  installUpdate,
  notifyDownloadStarted,
  notifyError,
  notifyForceUpdate,
  notifyDownloadManually,
  notifyNoUpdates,
  subscribe,
  unsubscribe,
} from '../autoUpdater';
import { MINUTE } from '../constants';
import { fromIPC } from '../rx.utils';

const logger = Logger({ className: 'autoUpdate' });

const handleAutoUpdates = (
  everyMs: number,
  $mainWindow: Observable<BrowserWindow>,
  $managers: Observable<Managers>,
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
      // when no updates or empty update response
      const isUpdateInfoEmpty = isEmpty(nextUpdateInfo);
      // when version from package and network equal
      if (nextUpdateInfo === false) {
        notifyNoUpdates(mainWindow);
        return;
      }

      // dep package does not support auto update, for dep update info always empty
      if (isUpdateInfoEmpty && isDebPackage()) {
        notifyDownloadManually(mainWindow);
      } else if (isUpdateInfoEmpty) {
        notifyNoUpdates(mainWindow);
      } else if (download) {
        notifyDownloadStarted(mainWindow);
      }
    }),
    // Force update if needed
    combineLatest([$managers, $downloaded, $currentNetwork])
      .pipe(
        withLatestFrom($mainWindow),
        map(([[managers, updateInfo, curNetwork], mainWindow]) => {
          if (curNetwork?.minSmappRelease) {
            const currentVersion = getCurrentVersion();
            const isOutdatedVersion =
              currentVersion.compare(curNetwork.minSmappRelease) === -1;

            if (!isOutdatedVersion) return null;

            return async () => {
              notifyForceUpdate(mainWindow, updateInfo);
              const isNodeRunning = managers.node.isNodeRunning();
              try {
                logger.log('forceUpdate', updateInfo);
                if (isNodeRunning) {
                  // If Smapp is running Node — turn it off first
                  StoreService.set('startNodeOnNextLaunch', true);
                  await managers.node.stopNode();
                }
                installUpdate();
              } catch (err) {
                logger.error('forceUpdate', err);
                if (err instanceof Error) {
                  notifyError(mainWindow, err);
                }
              }
              if (isNodeRunning) {
                // In case installation failed and Smapp was running Node before — start it again
                await delay(MINUTE);
                const res = await managers.node.startNode();
                logger.log('forceUpdate -> recover Node', res);
              }
            };
          }
          return null;
        }),
        filter(Boolean)
      )
      .subscribe((runForceUpdate) => runForceUpdate()),
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
