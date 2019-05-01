// @flow
import React, { PureComponent } from 'react';
import { Modal } from '/basicComponents';
import AddNewContact from './AddNewContact';

type Props = {
  address: string,
  closeModal: () => void,
  navigateToExplanation: () => void,
  onSave: ({ address: string, nickname: string, email?: string }) => void
};

class AddNewContactModal extends PureComponent<Props> {
  render() {
    const { navigateToExplanation, closeModal, onSave, address } = this.props;
    return (
      <Modal
        header="Create New Contact"
        onQuestionMarkClick={navigateToExplanation}
        onCancelBtnClick={closeModal}
        onCloseClick={closeModal}
        content={<AddNewContact onSave={onSave} defaultAddress={address} isModalMode />}
      />
    );
  }
}

export default AddNewContactModal;
