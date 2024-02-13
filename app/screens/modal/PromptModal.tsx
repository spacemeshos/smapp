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
  const [timeleft, setTimeleft] = useState(Infinity);

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

  useEffect(() => {
    if (opts.cancelTimeout) {
      setTimeleft(opts.cancelTimeout);
      const ival = setInterval(() => {
        setTimeleft((val) => val - 1);
      }, 1000);
      return () => clearInterval(ival);
    }
    return () => {};
  }, [opts]);

  const handleResponse = (response: boolean) => {
    ipcRenderer.send(ipcConsts.PROMPT_MODAL_REQUEST, response);
    setIsOpen(false);
  };

  useEffect(() => {
    setImmediate(() => {
      if (opts.cancelTimeout && timeleft === 0) {
        setTimeleft(Infinity);
        handleResponse(false);
      }
    });
  }, [opts, timeleft]);

  if (!isOpen) return null;

  const cancelText = opts.cancelTimeout
    ? `${opts.cancelTitle} (${timeleft} sec)`
    : opts.cancelTitle;

  return (
    <Modal header={opts.title} width={600} height={360}>
      <Message>{opts.message}</Message>
      <ButtonNewGroup>
        <ButtonNew
          onClick={() => handleResponse(true)}
          text={opts.confirmTitle}
        />
        <ButtonNew
          isPrimary
          onClick={() => handleResponse(false)}
          text={cancelText}
        />
      </ButtonNewGroup>
    </Modal>
  );
};

export default PromptModal;
