import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { eventsService } from '../../infra/eventsService';
import { Loader } from '../../basicComponents';
import { RootState } from '../../types';
import Modal from './Modal';

const OnQuitModal = () => {
  const [isClosing, setIsClosing] = useState(false);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  useEffect(() => {
    eventsService.closeApp(() => setIsClosing(true));
    return () => {
      eventsService.removeAllListeners();
    };
  }, []);

  return isClosing ? (
    <Modal width={600} height={600} header="Shutting down, please wait...">
      <Loader size={Loader.sizes.BIG} isDarkMode={isDarkMode} />
    </Modal>
  ) : null;
};

export default OnQuitModal;
