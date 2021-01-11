import React from 'react';
import { useSelector } from 'react-redux';
import { Loader } from '../../basicComponents';
import { RootState } from '../../types';
import Modal from './Modal';

const OnQuitModal = () => {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  return (
    <Modal width={600} height={600} header="Shutting down, please wait...">
      <Loader size={Loader.sizes.BIG} isDarkMode={isDarkMode} />
    </Modal>
  );
};

export default OnQuitModal;
