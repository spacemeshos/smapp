import { BrowserView, BrowserWindow, shell } from 'electron';
import { BehaviorSubject, filter, Observable, withLatestFrom } from 'rxjs';
import { ipcConsts } from '../../../app/vars';
import { Network } from '../../../shared/types';
import { fromIPC, makeSubscription } from '../rx.utils';

export default (
  $mainWindow: Observable<BrowserWindow>,
  $currentNetwork: Observable<Network | null>
) => {
  const $dashboard = new BehaviorSubject<BrowserView | null>(null);

  const open = makeSubscription(
    fromIPC<void>(ipcConsts.OPEN_BROWSER_VIEW).pipe(
      withLatestFrom($currentNetwork, $mainWindow),
      filter((a): a is [void, Network, BrowserWindow] => Boolean(a[1]))
    ),
    ([_, currentNetwork, mainWindow]) => {
      const browserView = new BrowserView({});
      mainWindow.setBrowserView(browserView);
      browserView.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
      });
      const contentBounds = mainWindow.getContentBounds();
      browserView.setBounds({
        x: 0,
        y: 90,
        width: contentBounds.width - 35,
        height: contentBounds.height - 100,
      });
      browserView.setAutoResize({
        width: true,
        height: true,
        horizontal: true,
        vertical: true,
      });
      const dashUrl = currentNetwork.dash;
      browserView.webContents.loadURL(
        // TODO: use theme to show `&darkMode` or not
        //       to do so we need to wrap `isDarkMode`
        //       into observables
        `${dashUrl}?hide-right-line&darkMode`
      );
      $dashboard.next(browserView);
    }
  );
  const close = makeSubscription(
    fromIPC<void>(ipcConsts.DESTROY_BROWSER_VIEW).pipe(
      withLatestFrom($dashboard)
    ),
    ([_, browserView]) => {
      browserView?.setBounds &&
        browserView.setBounds({ x: 0, y: 0, width: 0, height: 0 });
    }
  );

  return () => {
    // unsub
    open();
    close();
  };
};
