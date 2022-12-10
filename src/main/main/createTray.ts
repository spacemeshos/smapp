import path from 'path';
import { app, BrowserWindow, Menu, Tray } from 'electron';
import { showMainWindow } from './utils';

let tray: Tray;

export default (mainWindow: BrowserWindow) => {
  tray = new Tray(path.resolve(__dirname, '../../../resources/icons/16x16.png'));
  tray.setToolTip('Spacemesh');
  const showSmapp = () => showMainWindow(mainWindow);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: showSmapp,
    },
    {
      label: 'Quit',
      click: app.quit,
    },
  ]);
  tray.on('double-click', showSmapp);
  tray.setContextMenu(contextMenu);
  return tray;
};
