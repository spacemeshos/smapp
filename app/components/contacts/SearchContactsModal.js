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
  resolve: ({ publicWalletAddress: string, nickname: string, email?: string }) => void
};

class SearchContactsModal extends PureComponent<Props> {
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
    const { resolve } = this.props;
    return (
      <Wrapper>
        <SearchContacts showLastUsedAddresses={false} onSelect={resolve} />
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

export default SearchContactsModal;
