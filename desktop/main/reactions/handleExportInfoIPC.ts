import { writeFile } from 'fs/promises';
import { combineLatest, from, map, mergeMap, Observable } from 'rxjs';
import { BrowserWindow, dialog } from 'electron';
import { handleIPC, handlerResult, makeSubscription } from '../rx.utils';
import { ipcConsts } from '../../../app/vars';
import AdminService from '../../AdminService';
import DebugService from '../../DebugService';
import Logger from '../../logger';

const logger = Logger({ className: 'handleExportInfoIPC' });

const saveDialog = async (
  browser: BrowserWindow,
  data: Record<string, any>
) => {
  const { canceled, filePath } = await dialog.showSaveDialog(browser, {
    title: 'Export network info',
    buttonLabel: 'Export',
    defaultPath: 'netInfo.json',
  });
  if (canceled || !filePath) {
    return { filePath: null, data, canceled };
  }
  return { filePath, data, canceled };
};

const handleExportInfoIPC = ($mainWindow: Observable<BrowserWindow>) =>
  makeSubscription(
    handleIPC(
      ipcConsts.EXPORT_NET_INFO,
      () => {
        const adminService = new AdminService();
        const debugService = new DebugService();
        debugService.createService();
        adminService.createService();

        const netInfo = from(debugService.getNetworkInfo());
        const peerInfo = from(adminService.getPeerInfo());

        return combineLatest([netInfo, peerInfo, $mainWindow]).pipe(
          mergeMap(([netInfo, peerInfo, browser]) =>
            from(saveDialog(browser, { netInfo, peerInfo }))
          ),
          map(handlerResult)
        );
      },
      (data) => data
    ),
    ({ filePath, data }) => {
      if (filePath) {
        writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
          // eslint-disable-next-line promise/always-return
          .then(() => {
            logger.log('Network data exported', { filePath, data });
          })
          .catch((err) =>
            logger.error('Cannot write file', err, { filePath, data })
          );
      }
    }
  );

export default handleExportInfoIPC;
