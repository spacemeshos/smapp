import { app, BrowserWindow, dialog } from 'electron';
import { Subject } from 'rxjs';
import { ipcConsts } from '../../app/vars';
import { Managers } from './app.types';
import { showNotification } from './utils';

enum CloseAppPromptResult {
  CANCELED = 1, // To avoid conversion to `false`
  KEEP_SMESHING = 2,
  CLOSE = 3,
}

const promptBeforeClose = (
  mainWindow: BrowserWindow,
  managers: Partial<Managers>,
  $isAppClosing: Subject<boolean>,
  $showWindowOnLoad: Subject<boolean>
) => {
  const showPrompt = async () => {
    if (!mainWindow) return CloseAppPromptResult.KEEP_SMESHING;
    const { response } = await dialog.showMessageBox(mainWindow, {
      title: 'Quit App',
      message:
        '\nQuitting stops smeshing and may cause loss of future due smeshing rewards.' +
        '\n\n\n• Click RUN IN BACKGROUND to close the App window and to keep smeshing in the background.' +
        '\n\n• Click QUIT to close the app and stop smeshing.\n',
      buttons: ['RUN IN BACKGROUND', 'QUIT', 'Cancel'],
      cancelId: 2,
    });
    switch (response) {
      default:
      case 2:
        return CloseAppPromptResult.CANCELED;
      case 0:
        return CloseAppPromptResult.KEEP_SMESHING;
      case 1:
        return CloseAppPromptResult.CLOSE;
    }
  };
  const isNodeRunning = async () => managers?.node?.isNodeRunning() || false;
  const notify = () =>
    showNotification(mainWindow, {
      title: 'Spacemesh',
      body: 'Smesher is running in the background.',
    });

  const quit = async () => {
    try {
      managers.wallet?.unsubscribeAllStreams();
      await managers.node?.stopNode();
    } finally {
      $isAppClosing.next(true);
      app.quit();
    }
  };

  let cachedPromptResult: number | null = null;

  const handleClosingApp = async (event: Electron.Event) => {
    if (cachedPromptResult !== null) return;
    event.preventDefault();
    if (!mainWindow) {
      quit();
      return;
    }
    const promptResult =
      ((await isNodeRunning()) && (await showPrompt())) ||
      CloseAppPromptResult.CLOSE;
    cachedPromptResult = promptResult;
    // clear cache
    // eslint-disable-next-line no-return-assign
    setTimeout(() => (cachedPromptResult = null), 5000);
    if (promptResult === CloseAppPromptResult.KEEP_SMESHING) {
      setTimeout(notify, 1000);
      mainWindow.hide();
      $showWindowOnLoad.next(false);
      mainWindow.reload();
    } else if (promptResult === CloseAppPromptResult.CLOSE) {
      $isAppClosing.next(true);
      mainWindow.webContents.send(ipcConsts.CLOSING_APP);
      managers.wallet?.unsubscribeAllStreams();
      await managers?.node?.stopNode();
      quit();
    }
  };

  return handleClosingApp;
};

export default promptBeforeClose;
