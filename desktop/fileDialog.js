import { ipcConsts } from '../app/vars';

const fs = require('fs');
const util = require('util');
const electron = require('electron');

const { dialog } = electron;

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

class FileDialog {
  openReadFileDialog({ browserWindow, event, defaultPath }) {
    const options = {
      title: 'Load Wallet Backup File',
      defaultPath,
      buttonLabel: 'Load',
      filters: [{ name: 'Backup Files', extensions: ['json'] }],
      properties: ['openFile']
    };

    dialog.showOpenDialog(browserWindow, options, async (filePaths) => {
      if (filePaths && filePaths[0]) {
        try {
          const fileContent = await readFile(filePaths[0]);
          event.sender.send(ipcConsts.READ_FILE_SUCCESS, JSON.parse(fileContent));
        } catch (error) {
          event.sender.send(ipcConsts.READ_FILE_FAILURE, error.message);
        }
      }
    });
  }

  openSaveFileDialog({ browserWindow, event, defaultPath, fileContent }) {
    const options = {
      title: 'Save Wallet Backup File',
      defaultPath,
      buttonLabel: 'Save',
      filters: [{ name: 'Backup Files', extensions: ['json'] }]
    };

    dialog.showSaveDialog(browserWindow, options, async (fileName) => {
      if (fileName) {
        try {
          await writeFile(fileName, fileContent);
          event.sender.send(ipcConsts.SAVE_FILE_SUCCESS);
        } catch (error) {
          event.sender.send(ipcConsts.SAVE_FILE_FAILURE, error.message);
        }
      }
    });
  }
}

export default new FileDialog();
