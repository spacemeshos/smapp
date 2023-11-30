import { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { ipcConsts } from '../vars';
import { ImportWalletWarningRequest } from '../../shared/ipcMessages';
import { eventsService } from '../infra/eventsService';

type UseImportFileWarningReturn = {
  isOpen: boolean;
  message: string;
  handleResponse: (userResponse: boolean) => void;
};

const useImportFileWarning = (): UseImportFileWarningReturn => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const handleShowModal = (
      _: Electron.IpcRendererEvent,
      payload: ImportWalletWarningRequest
    ) => {
      const { isDuplicateName, isDuplicateWallet, isDuplicatePath } = payload;

      let formattedMessage = '';

      if (isDuplicateWallet || isDuplicatePath) {
        // If the wallet or/and path is duplicated, regardless of name duplication
        formattedMessage =
          'This wallet is already opened. Do you want to import it anyway?';
      } else if (isDuplicateName) {
        // If only the name is duplicated, the path or encrypted data different
        formattedMessage =
          'A different wallet with the same name is already opened in Smapp. Double-check which one you use and consider renaming one of them.';
      }

      setMessage(formattedMessage);
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

  return { isOpen, message, handleResponse };
};

export default useImportFileWarning;
