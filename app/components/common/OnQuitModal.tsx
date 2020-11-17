import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ipcRenderer } from 'electron';
import { Loader } from '../../basicComponents';
import { ipcConsts } from '../../vars';
import { notificationsService } from '../../infra/notificationsService';
import { RootState } from '../../types';
import Modal from './Modal';

const OnQuitModal = () => {
  const [isClosing, setIsClosing] = useState(false);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  ipcRenderer.on(ipcConsts.KEEP_RUNNING_IN_BACKGROUND, () => {
    setTimeout(() => {
      notificationsService.notify({
        title: 'Spacemesh',
        notification: 'Smesher is running in the background.'
      });
    }, 1000);
  });
  ipcRenderer.on(ipcConsts.CLOSING_APP, () => {
    setIsClosing(true);
  });

  return isClosing ? (
    <Modal width={600} height={600} header="Shutting down, please wait...">
      <Loader size={Loader.sizes.BIG} isDarkMode={isDarkMode} />
    </Modal>
  ) : null;
};

export default OnQuitModal;
