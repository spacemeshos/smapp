import { app, dialog } from 'electron';
import { ipcConsts } from '../../app/vars';
import { AppContext } from './context';
import { showNotification } from './utils';

enum CloseAppPromptResult {
  CANCELED = 1, // To avoid conversion to `false`
  KEEP_SMESHING = 2,
  CLOSE = 3,
}

export default (context: AppContext) => {
  context.isAppClosing = false;

  const showPrompt = async () => {
    const { mainWindow } = context;
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
  const isSmeshing = async () =>
    context.managers.smesher?.isSmeshing() || false;
  const notify = () =>
    showNotification(context, {
      title: 'Spacemesh',
      body: 'Smesher is running in the background.',
    });

  const quit = () => {
    context.isAppClosing = true;
    app.quit();
  };

  const handleClosingApp = async (event: Electron.Event) => {
    if (context.isAppClosing) return;
    event.preventDefault();
    const { mainWindow } = context;
    if (!mainWindow) {
      quit();
      return;
    }
    const promptResult =
      ((await isSmeshing()) && (await showPrompt())) ||
      CloseAppPromptResult.CLOSE;
    if (promptResult === CloseAppPromptResult.KEEP_SMESHING) {
      setTimeout(notify, 1000);
      mainWindow.hide();
      context.showWindowOnLoad = false;
      mainWindow.reload();
    } else if (promptResult === CloseAppPromptResult.CLOSE) {
      mainWindow.webContents.send(ipcConsts.CLOSING_APP);
      await context.managers?.node?.stopNode();
      quit();
    }
  };

  return handleClosingApp;
};
