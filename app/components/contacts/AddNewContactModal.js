// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Modal } from '/basicComponents';
import AddNewContact from './AddNewContact';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

type Props = {
  publicWalletAddress: string,
  closeModal: () => void,
  navigateToExplanation: () => void,
  onSave: ({ publicWalletAddress: string, nickname: string, email?: string }) => void
};

class AddNewContactModal extends PureComponent<Props> {
  render() {
    const { navigateToExplanation, closeModal } = this.props;
    return (
      <Modal header="Create New Contact" onQuestionMarkClick={navigateToExplanation} onCancelBtnClick={closeModal} onCloseClick={closeModal} content={this.renderModalBody()} />
    );
  }

  renderModalBody = () => {
    const { onSave, publicWalletAddress } = this.props;
    return (
      <Wrapper>
        <AddNewContact onSave={onSave} publicWalletAddress={publicWalletAddress} modalMode />
      </Wrapper>
    );
  };
}

export default AddNewContactModal;
