import React from 'react';
import styled from 'styled-components';
import { loader, loaderWhite } from '../../assets/images';
import Modal from './Modal';

const Spinner = styled.img`
  margin-right: auto;
  height: 40px;
`;

type Props = {
  isDarkMode: boolean;
};

const CloseAppModal = ({ isDarkMode }: Props) => (
  <Modal header="SHUTTING DOWN" subHeader="please wait...">
    <Spinner alt="Please wait..." src={isDarkMode ? loaderWhite : loader} />
  </Modal>
);

export default CloseAppModal;
