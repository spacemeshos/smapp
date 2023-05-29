import {
  BrowserView,
  BrowserWindow,
  ipcMain,
  nativeTheme,
  shell,
} from 'electron';
import { ipcConsts } from '../../app/vars';
import { AppContext } from './context';

export default (context: AppContext) => {
  // Basic
  ipcMain.on(ipcConsts.RELOAD_APP, () => context.mainWindow?.reload());

  // Theme
  ipcMain.handle(
    ipcConsts.GET_OS_THEME_COLOR,
    () => nativeTheme.shouldUseDarkColors
  );
  ipcMain.on(ipcConsts.SEND_THEME_COLOR, (_event, request) => {
    context.isDarkMode = request.isDarkMode;
  });

  // Handle opening dash screen
  (() => {
    let browserView;

    ipcMain.on(ipcConsts.OPEN_BROWSER_VIEW, () => {
      const { mainWindow, currentNetwork } = context;
      if (!mainWindow || !currentNetwork) return;
      browserView = new BrowserView({
        webPreferences: {
          nodeIntegration: false,
        },
      });
      mainWindow.setBrowserView(browserView);
      browserView.webContents.on('new-window', (event, url) => {
        event.preventDefault();
        shell.openExternal(url);
      });
      const contentBounds = mainWindow.getContentBounds();
      browserView.setBounds({
        x: 0,
        y: 90,
        width: contentBounds.width - 35,
        height: 600,
      });
      browserView.setAutoResize({
        width: true,
        height: true,
        horizontal: true,
        vertical: true,
      });
      const dashUrl = currentNetwork.dash;
      browserView.webContents.loadURL(
        `${dashUrl}?hide-right-line${context.isDarkMode ? '&darkMode' : ''}`
      );
    });

    ipcMain.on(ipcConsts.DESTROY_BROWSER_VIEW, () => {
      browserView?.setBounds &&
        browserView.setBounds({ x: 0, y: 0, width: 0, height: 0 });
      // TODO: destroy
    });
  })();

  // Open print page with 12 words
  ipcMain.on(ipcConsts.PRINT, (_event, request: { content: string }) => {
    const { mainWindow } = context;
    const printerWindow = new BrowserWindow({
      parent: mainWindow,
      width: 800,
      height: 800,
      show: true,
      webPreferences: { nodeIntegration: true, devTools: false },
    });
    const html = `<body>${request.content}</body><script>window.onafterprint = () => setTimeout(window.close, 3000); window.print();</script>`;
    printerWindow.loadURL(`data:text/html;charset=utf-8,${encodeURI(html)}`);
  });
};
