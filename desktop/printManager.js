// @flow
import fs from 'fs';
import path from 'path';
import { app, shell } from 'electron';
import { ipcConsts } from '../app/vars';

const documentsDirPath = app.getPath('documents');

class PrintManager {
  static readyToPrint = ({ printerWindow, event }: { printerWindow: any, event: any }) => {
    try {
      const pdfPath = path.join(documentsDirPath, 'print.pdf');
      const contents = printerWindow.webContents;
      const printers = contents.getPrinters();
      const selectedPrinter = printers.find((printer) => printer.name === 'HP_Color_LaserJet_MFP_M181fw__FF692E_');
      // eslint-disable-next-line no-console
      console.warn('selected printer', selectedPrinter, 'web content', contents.print);
      contents.print({ silent: false, printBackground: true, deviceName: selectedPrinter.name }, (success) => {
        // eslint-disable-next-line no-console
        console.warn('print success', success);
      });
      // to PDF
      contents.printToPDF({}, function(error, data) {
        if (error) throw error;
        fs.writeFile(pdfPath, data, function(error) {
          if (error) {
            throw error;
          }
          shell.openItem(pdfPath);
          event.sender.send(ipcConsts.PRINT_SUCCESS, pdfPath);
        });
      });
    } catch (error) {
      event.sender.send(ipcConsts.PRINT_FAILURE, error.message);
    }
  };

  static print = async ({ printerWindow, event, content }: { printerWindow: any, event: any, content: any }) => {
    try {
      printerWindow.webContents.send(ipcConsts.PRINT, content);
    } catch (error) {
      event.sender.send(ipcConsts.PRINT_FAILURE, error.message);
    }
  };
}

export default PrintManager;
