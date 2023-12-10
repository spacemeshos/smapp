import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';
import Modal from '../../components/common/Modal';
import { Button } from '../../basicComponents';
import { ipcConsts } from '../../vars';

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

const PromptModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleShowModal = (_, { title, message }) => {
      setTitle(title);
      setMessage(message);
      setIsOpen(true);
    };

    ipcRenderer.on(ipcConsts.PROMPT_MODAL_REQUEST, handleShowModal);

    return () => {
      ipcRenderer.removeListener(
        ipcConsts.PROMPT_MODAL_REQUEST,
        handleShowModal
      );
    };
  }, []);

  const handleResponse = (response: boolean) => {
    ipcRenderer.send(ipcConsts.PROMPT_MODAL_REQUEST, response);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <Modal header={title} subHeader=" " width={600} height={300}>
      <Message>{message}</Message>
      <ButtonsWrapper>
        <Button
          isPrimary={false}
          onClick={() => handleResponse(true)}
          text="CONFIRM"
        />
        <Button onClick={() => handleResponse(false)} text="CANCEL" />
      </ButtonsWrapper>
    </Modal>
  );
};

export default PromptModal;
