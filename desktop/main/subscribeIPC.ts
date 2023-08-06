import { BrowserWindow, ipcMain, nativeTheme } from 'electron';
import { ipcConsts } from '../../app/vars';
import { AppContext } from './context';

export default (context: AppContext) => {
  // Theme
  ipcMain.handle(
    ipcConsts.GET_OS_THEME_COLOR,
    () => nativeTheme.shouldUseDarkColors
  );
  ipcMain.on(ipcConsts.SEND_THEME_COLOR, (_event, request) => {
    context.isDarkMode = request.isDarkMode;
  });

  // Open print page with recovery words
  ipcMain.on(ipcConsts.PRINT, (_event, request: { content: string }) => {
    const { mainWindow } = context;
    const printerWindow = new BrowserWindow({
      parent: mainWindow,
      width: 800,
      height: 800,
      show: true,
      webPreferences: { devTools: false },
    });
    const html = `<body>${request.content}</body><script>window.onafterprint = () => setTimeout(window.close, 3000); window.print();</script>`;
    printerWindow.loadURL(`data:text/html;charset=utf-8,${encodeURI(html)}`);
  });
};
