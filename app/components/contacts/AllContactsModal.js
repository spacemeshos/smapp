// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Modal } from '/basicComponents';
import AllContacts from './AllContacts';
import type { Contact } from '/types';

const Wrapper = styled.div`
  width: 700px;
  height: 600px;
  display: flex;
  flex-direction: column;
  padding: 50px;
`;

type Props = {
  closeModal: () => void,
  selectContact: ({ contact: Contact }) => void
};

class AllContactsModal extends PureComponent<Props> {
  render() {
    const { closeModal } = this.props;
    return <Modal header="Search Contact" onCancelBtnClick={closeModal} onCloseClick={closeModal} content={this.renderModalBody()} />;
  }

  renderModalBody = () => {
    const { selectContact } = this.props;
    return (
      <Wrapper>
        <AllContacts selectContact={selectContact} isModalMode />
      </Wrapper>
    );
  };
}

export default AllContactsModal;
