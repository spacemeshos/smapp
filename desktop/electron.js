const { app, BrowserWindow, protocol } = require('electron');
const isDev = require('electron-is-dev');
const url = require('url');
const path = require('path');

require('electron-debug')();
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    center: true,
    icon: path.join(__dirname, '../public/icons/png/64x64.png'),
    webPreferences: {
      webSecurity: true
    }
  });

  const urlPath = url.format({
    pathname: path.join(__dirname, '../build', 'index.html'),
    protocol: 'file:',
    slashes: true
  });

  mainWindow.loadURL(isDev ? 'http://localhost:3000' : urlPath);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Prompt users before window close
  mainWindow.on('close', () => {
    // e.preventDefault();
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  protocol.interceptFileProtocol(
    'file',
    (request, callback) => {
      const url = request.url.substr(7);
      callback({
        path: path.normalize(`${url}`)
      });
    },
    (err) => {
      if (err) console.log('Failed to register protocol');
    }
  );
  createWindow();
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
