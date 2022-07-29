import React from 'react';
import styled from 'styled-components';
import Modal from './Modal';

const Spinner = styled.img.attrs(({ theme: { icons } }) => ({
  src: icons.loader,
}))`
  margin-right: auto;
  height: 40px;
`;

const CloseAppModal = () => (
  <Modal header="SHUTTING DOWN" subHeader="please wait...">
    <Spinner alt="Please wait..." />
  </Modal>
);

export default CloseAppModal;
