import { app, Menu, BrowserWindow, shell } from 'electron';

class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu() {
    if (process.env.NODE_ENV !== 'production' || process.env.DEBUG_PROD === 'true') {
      this.addInspectElementMenu();
    }

    const template = this.buildMenuTemplate();
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  addInspectElementMenu() {
    this.mainWindow.openDevTools();
    this.mainWindow.webContents.on('context-menu', (e, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.inspectElement(x, y);
          }
        }
      ]).popup(this.mainWindow);
    });
  }

  buildMenuTemplate() {
    const isMac = process.platform === 'darwin';
    return [
      isMac
        ? {
            label: isMac ? app.getName() : '&File',
            submenu: [
              {
                label: 'About',
                click: () => {
                  shell.openExternal('https://testnet.spacemesh.io/');
                }
              },
              { type: 'separator' },
              { role: 'quit' }
            ]
          }
        : {
            label: '&File',
            submenu: [
              {
                label: 'About',
                click: () => {
                  shell.openExternal('https://testnet.spacemesh.io/');
                }
              },
              { type: 'separator' },
              { role: 'quit' }
            ]
          },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
        ]
      },
      {
        label: 'View',
        submenu:
          process.env.NODE_ENV === 'development'
            ? [{ role: 'reload' }, { role: 'forcereload' }, { type: 'separator' }, { role: 'toggledevtools' }, { type: 'separator' }, { role: 'togglefullscreen' }]
            : [{ role: 'togglefullscreen' }]
      },
      {
        label: 'Window',
        submenu: [{ role: 'minimize' }, { role: 'zoom' }, ...(isMac ? [{ type: 'separator' }, { role: 'front' }, { type: 'separator' }, { role: 'window' }] : [{ role: 'close' }])]
      }
    ];
  }
}

export default MenuBuilder;
