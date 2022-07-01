import { shell } from 'electron';
import { Observable, withLatestFrom } from 'rxjs';
import { ipcConsts } from '../../../app/vars';
import { ShowFileRequest } from '../../../shared/ipcMessages';
import { Network } from '../../../shared/types';
import Logger from '../../logger';
import { DEFAULT_WALLETS_DIRECTORY } from '../constants';
import { fromIPC, makeSubscription } from '../rx.utils';
import { getNodeLogsPath } from '../utils';

const logger = Logger({ className: 'handleShowFile' });

export default ($currentNetwork: Observable<Network | null>) =>
  makeSubscription(
    fromIPC<ShowFileRequest>(ipcConsts.W_M_SHOW_FILE_IN_FOLDER).pipe(
      withLatestFrom($currentNetwork)
    ),
    ([{ filePath, isLogFile }, network]) => {
      try {
        if (filePath) {
          shell.showItemInFolder(filePath);
        } else if (isLogFile && network) {
          const logFilePath = getNodeLogsPath(network.netID);
          shell.showItemInFolder(logFilePath);
        } else {
          shell.openPath(DEFAULT_WALLETS_DIRECTORY);
        }
      } catch (error) {
        logger.error('showFileInDirectory', error);
      }
    }
  );
