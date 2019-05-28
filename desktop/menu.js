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

  buildDarwinTemplate() {
    return [
      {
        label: app.getName(),
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
          { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
          { label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' },
          { type: 'separator' },
          { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
          { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
          { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
          { label: 'Select All', accelerator: 'Command+A', selector: 'selectAll:' }
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
        submenu: [
          { label: 'Minimize', accelerator: 'Command+M', selector: 'performMiniaturize:' },
          { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
          { type: 'separator' },
          { label: 'Bring All to Front', selector: 'arrangeInFront:' }
        ]
      }
    ];
  }

  buildDefaultTemplate() {
    return [
      {
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
        label: '&View',
        submenu:
          process.env.NODE_ENV === 'development'
            ? [{ role: 'reload' }, { role: 'forcereload' }, { type: 'separator' }, { role: 'toggledevtools' }, { type: 'separator' }, { role: 'togglefullscreen' }]
            : [{ role: 'togglefullscreen' }]
      }
    ];
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
