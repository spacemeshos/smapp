import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ipcRenderer } from 'electron';
import Modal from '../../components/common/Modal';
import { ipcConsts } from '../../vars';
import { ButtonNew, ButtonNewGroup } from '../../basicComponents';
import {
  GENERIC_MODAL_DEFAULTS,
  GenericModalOpts,
} from '../../../shared/genericModal';

const Message = styled.pre`
  font-size: 14px;
  line-height: 1.33em;
  word-wrap: break-word;
  white-space: pre-wrap;
  overflow-y: auto;
  height: 150px;
  margin-top: 15px;
`;

const GenericModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [opts, setOpts] = useState<Required<GenericModalOpts>>({
    ...GENERIC_MODAL_DEFAULTS,
    title: '',
    message: '',
  });

  useEffect(() => {
    const handleShowModal = (_, opts: GenericModalOpts) => {
      setOpts({
        ...GENERIC_MODAL_DEFAULTS,
        ...opts,
      });
      setIsOpen(true);
    };

    ipcRenderer.on(ipcConsts.GENERIC_MODAL_SHOW, handleShowModal);

    return () => {
      ipcRenderer.removeListener(ipcConsts.GENERIC_MODAL_SHOW, handleShowModal);
    };
  }, []);

  const close = () => setIsOpen(false);
  const handleButtonClick = (eventName) => () => {
    ipcRenderer.send(ipcConsts.GENERIC_MODAL_BTN_PRESS, eventName);
    close();
  };

  if (!isOpen) return null;

  return (
    <Modal header={opts.title} width={600} height={300}>
      <Message>{opts.message}</Message>
      {opts.buttons.length > 0 && (
        <ButtonNewGroup>
          {opts.buttons.map((btn, ix) => (
            <ButtonNew
              key={ix}
              onClick={
                btn.action === 'close'
                  ? () => close()
                  : handleButtonClick(btn.action)
              }
              text={btn.label}
            />
          ))}
        </ButtonNewGroup>
      )}
    </Modal>
  );
};

export default GenericModal;
