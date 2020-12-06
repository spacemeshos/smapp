import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ipcRenderer } from 'electron';
import { Loader } from '../../basicComponents';
import { ipcConsts } from '../../vars';
import { RootState } from '../../types';
import Modal from './Modal';

const OnQuitModal = () => {
  const [isClosing, setIsClosing] = useState(false);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  useEffect(() => {
    ipcRenderer.on(ipcConsts.CLOSING_APP, () => {
      setIsClosing(true);
    });
    return () => {
      ipcRenderer.removeAllListeners(ipcConsts.CLOSING_APP);
    };
  }, []);

  return isClosing ? (
    <Modal width={600} height={600} header="Shutting down, please wait...">
      <Loader size={Loader.sizes.BIG} isDarkMode={isDarkMode} />
    </Modal>
  ) : null;
};

export default OnQuitModal;
