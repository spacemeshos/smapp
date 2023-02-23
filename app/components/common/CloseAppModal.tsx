import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import ReactPortal from '../../screens/modal/ReactPortal';
import { RootState } from '../../types';
import Modal from './Modal';

const Spinner = styled.img.attrs(({ theme: { icons } }) => ({
  src: icons.loader,
}))`
  margin-right: auto;
  height: 40px;
`;

const CloseAppModal = () => {
  const isClosingApp = useSelector((state: RootState) => state.ui.isClosingApp);

  if (!isClosingApp) {
    return null;
  }

  return (
    <ReactPortal modalId="spacemesh-shutting-down">
      <Modal header="SHUTTING DOWN" subHeader="please wait...">
        <Spinner alt="Please wait..." />
      </Modal>
    </ReactPortal>
  );
};

export default CloseAppModal;
