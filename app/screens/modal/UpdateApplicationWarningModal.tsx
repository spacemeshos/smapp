import React from 'react';
import styled from 'styled-components';
import Modal from '../../components/common/Modal';
import { Button } from '../../basicComponents';
import { smColors } from '../../vars';

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
  overflow-y: auto;
  margin-top: 15px;

  ul {
    list-style: none;
    margin-left: 10px;
  }
  li {
    margin: 10px 0;
  }
  li:before {
    content: '• ';
    padding: 5px;
  }
`;

const UpdateApplicationWarningModal = ({ isOpen, onApprove, onCancel }) => {
  if (!isOpen) return null;

  return (
    <Modal header="Update SMAPP" height={380}>
      <Message>
        <p>
          Restarting now is <b>CRITICAL</b> and may impact your node’s
          performance and rewards.
        </p>
        <ul>
          <li>
            Click <b style={{ color: smColors.green }}>RESTART NOW</b> to apply
            the update immediately. Delaying the update could result in
            potential loss of rewards.
          </li>
          <li>
            Click <b style={{ color: smColors.purple }}>POSTPONE</b> to delay
            the update. Be aware that postponing may slow down your node’s
            performance and future rewards.
          </li>
        </ul>
      </Message>
      <ButtonsWrapper>
        <Button onClick={onCancel} isPrimary={false} text="POSTPONE" />
        <Button onClick={onApprove} text="RESTART NOW" />
      </ButtonsWrapper>
    </Modal>
  );
};

export default UpdateApplicationWarningModal;
