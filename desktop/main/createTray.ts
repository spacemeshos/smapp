import path from 'path';
import { app, Menu, Tray } from 'electron';
import { AppContext } from './context';
import { showMainWindow } from './utils';

export default (context: AppContext) => {
  const tray = new Tray(
    path.resolve(__dirname, '../../resources/icons/16x16.png')
  );
  tray.setToolTip('Spacemesh');
  const showSmapp = () => showMainWindow(context);
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
  context.tray = tray;
  return tray;
};
