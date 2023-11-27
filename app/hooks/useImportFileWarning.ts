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

      const similarities: string[] = [];
      if (isDuplicatePath) {
        similarities.push('file path');
      }
      if (isDuplicateName) {
        similarities.push('name');
      }
      if (isDuplicateWallet) {
        similarities.push('data');
      }

      let formattedMessage = 'A wallet with the same ';
      if (similarities.length > 0) {
        formattedMessage += similarities.join(', ');
      } else {
        formattedMessage = 'A wallet';
      }
      formattedMessage += ' already exists.';

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
