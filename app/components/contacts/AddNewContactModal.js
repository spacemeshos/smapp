// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Modal } from '/basicComponents';
// import { smColors } from '/vars';
import AddNewContact from './AddNewContact';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  /* padding: 50px; */
`;

type Props = {
  publicWalletAddress: string,
  closeModal: () => void,
  navigateToExplanation: () => void,
  //   onSave: ({ publicWalletAddress: string, nickname: string, email: string }) => void
  onSave: Function
};

class AddNewContactModal extends PureComponent<Props> {
  render() {
    return (
      <Modal
        header="Create New Contact"
        onQuestionMarkClick={this.onQuestionMarkClick}
        onCancelBtnClick={this.onCloseClick}
        onCloseClick={this.onCloseClick}
        content={this.renderModalBody()}
      />
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

  onQuestionMarkClick = () => {
    const { navigateToExplanation } = this.props;
    navigateToExplanation();
  };

  onCloseClick = () => {
    const { closeModal } = this.props;
    closeModal();
  };
}

export default AddNewContactModal;
