// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Modal } from '/basicComponents';
import SearchContacts from './SearchContacts';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 50px;
`;

type Props = {
  closeModal: () => void,
  navigateToExplanation: () => void,
  onSave: ({ publicWalletAddress: string, nickname: string, email?: string }) => void
};

class SearchContactsModal extends PureComponent<Props> {
  render() {
    const { navigateToExplanation, closeModal } = this.props;
    return (
      <Modal header="Create New Contact" onQuestionMarkClick={navigateToExplanation} onCancelBtnClick={closeModal} onCloseClick={closeModal} content={this.renderModalBody()} />
    );
  }

  renderModalBody = () => {
    const { onSave } = this.props;
    return (
      <Wrapper>
        <SearchContacts showLastUsedAddresses={false} onSelect={onSave} />
      </Wrapper>
    );
  };
}

export default SearchContactsModal;
