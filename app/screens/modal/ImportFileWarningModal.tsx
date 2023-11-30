import React from 'react';
import styled from 'styled-components';
import Modal from '../../components/common/Modal';
import { Button } from '../../basicComponents';
import useImportFileWarning from '../../hooks/useImportFileWarning';

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: auto 0 15px 0;
  padding-top: 30px;
`;

const Message = styled.pre`
  font-size: 14px;
  line-height: 1.33em;
  word-wrap: break-word;
  white-space: pre-wrap;
  flex: 1;
  overflow-y: auto;
  height: 150px;
`;

const ImportFileWarningModal = () => {
  const { isOpen, message, handleResponse } = useImportFileWarning();

  if (!isOpen) return null;

  return (
    <Modal header="CONFIRM FILE IMPORT" subHeader=" " width={600} height={300}>
      <Message>{message}</Message>
      <ButtonsWrapper>
        <Button
          isPrimary={false}
          onClick={() => handleResponse(true)}
          text="IMPORT"
        />
        <Button onClick={() => handleResponse(false)} text="CANCEL" />
      </ButtonsWrapper>
    </Modal>
  );
};

export default ImportFileWarningModal;
