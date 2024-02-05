import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';
import Modal from '../../components/common/Modal';
import { ipcConsts } from '../../vars';
import {
  GENERIC_PROMPT_DEFAULTS,
  GenericPromptOpts,
} from '../../../shared/genericPrompt';
import { ButtonNew, ButtonNewGroup } from '../../basicComponents';

const Message = styled.pre`
  font-size: 14px;
  line-height: 1.33em;
  word-wrap: break-word;
  white-space: pre-wrap;
  overflow-y: auto;
  height: 150px;
  margin-top: 15px;
`;

const PromptModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [opts, setOpts] = useState<Required<GenericPromptOpts>>({
    ...GENERIC_PROMPT_DEFAULTS,
    title: '',
    message: '',
  });

  useEffect(() => {
    const handleShowModal = (_, opts: GenericPromptOpts) => {
      setOpts({
        ...GENERIC_PROMPT_DEFAULTS,
        ...opts,
      });
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
    <Modal header={opts.title} width={600} height={300}>
      <Message>{opts.message}</Message>
      <ButtonNewGroup>
        <ButtonNew
          onClick={() => handleResponse(true)}
          text={opts.confirmTitle}
        />
        <ButtonNew
          isPrimary
          onClick={() => handleResponse(false)}
          text={opts.cancelTitle}
        />
      </ButtonNewGroup>
    </Modal>
  );
};

export default PromptModal;
