import { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { ipcConsts } from '../vars';
import { ImportWalletWarningRequest } from '../../shared/ipcMessages';
import { eventsService } from '../infra/eventsService';

type UseImportFileWarningProps = [
  boolean,
  string,
  (userResponse: boolean) => void
];
const useImportFileWarning = (): UseImportFileWarningProps => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const handleShowModal = (
      _: Electron.IpcRendererEvent,
      payload: ImportWalletWarningRequest
    ) => {
      const { isDuplicateName, isDuplicateWallet, isDuplicatePath } = payload;

      const msgParts: string[] = [];
      if (isDuplicatePath) {
        msgParts.push('a wallet with this file path');
      }
      if (isDuplicateName) {
        msgParts.push('a wallet with the same name');
      }
      if (isDuplicateWallet) {
        msgParts.push('a wallet with the same data');
      }

      setMessage(`A wallet with ${msgParts.join(' and ')} already exists.`);
      setIsOpen(true);
    };

    ipcRenderer.on(ipcConsts.W_M_APPROVE_ADD_WALLET_REQUEST, handleShowModal);

    return () => {
      ipcRenderer.removeListener(
        ipcConsts.W_M_APPROVE_ADD_WALLET_REQUEST,
        handleShowModal
      );
    };
  }, []);

  const handleResponse = (response: boolean) => {
    eventsService.sendApproveAddWalletResponse(response);
    setIsOpen(false);
  };

  return [isOpen, message, handleResponse];
};

export default useImportFileWarning;
