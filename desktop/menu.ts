import { app, Menu, BrowserWindow } from 'electron';
import { eventsService } from '../app/infra/eventsService';

class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu() {
    if (process.env.NODE_ENV !== 'production' || process.env.DEBUG_PROD === 'true') {
      this.addInspectElementMenu();
    } else {
      this.addInputAndSelectionMenu();
    }

    const template = this.buildMenuTemplate();
    // @ts-ignore
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  addInspectElementMenu() {
    // @ts-ignore
    this.mainWindow.openDevTools();
    this.mainWindow.webContents.on('context-menu', (_e, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            // @ts-ignore
            this.mainWindow.inspectElement(x, y);
          }
        } // @ts-ignore
      ]).popup(this.mainWindow);
    });
  }

  addInputAndSelectionMenu() {
    const selectionMenu = Menu.buildFromTemplate([{ role: 'copy' }, { type: 'separator' }, { role: 'selectAll' }]);

    const inputMenu = Menu.buildFromTemplate([
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { type: 'separator' },
      { role: 'selectAll' }
    ]);

    this.mainWindow.webContents.on('context-menu', (_e, props) => {
      const { selectionText, isEditable } = props;
      if (isEditable) {
        // @ts-ignore
        inputMenu.popup(this.mainWindow);
      } else if (selectionText && selectionText.trim() !== '') {
        // @ts-ignore
        selectionMenu.popup(this.mainWindow);
      }
    });
  }

  buildMenuTemplate() {
    const isMac = process.platform === 'darwin';
    return [
      isMac
        ? {
            label: isMac ? app.name : '&File',
            submenu: [
              {
                label: 'About',
                click: () => {
                  eventsService.openExternalLink({ link: 'https://testnet.spacemesh.io/' });
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
                  eventsService.openExternalLink({ link: 'https://testnet.spacemesh.io/' });
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
