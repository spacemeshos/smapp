// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { removeFromContacts, updateTransaction } from '/redux/wallet/actions';
import styled from 'styled-components';
import { EnterPasswordModal } from '/components/settings';
import { Link } from '/basicComponents';
import { smColors } from '/vars';
import type { Action, Contact } from '/types';

const ButtonsWrapper = styled.div`
  justify-content: flex-end;
  text-decoration: underline;
`;

type Props = {
  removeFromContacts: Action,
  updateTransaction: Action,
  contact: Contact
};

type State = {
  address: string,
  initialAddress: string,
  nickname: string,
  hasError: boolean,
  errorMsg: string,
  shouldShowPasswordModal: boolean
};

class DeleteContact extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      address: props.contact.address,
      nickname: props.contact.nickname,
      shouldShowPasswordModal: false
    };
  }

  render() {
    const { shouldShowPasswordModal } = this.state;
    return (
      <ButtonsWrapper>
        <Link onClick={() => this.setState({ shouldShowPasswordModal: true })} text="delete" style={{ color: smColors.orange, marginRight: 15 }} />
        {shouldShowPasswordModal && <EnterPasswordModal submitAction={this.deleteFromContact} closeModal={() => this.setState({ shouldShowPasswordModal: false })} />}
      </ButtonsWrapper>
    );
  }

  deleteFromContact = async ({ password }: { password: string }) => {
    const { removeFromContacts, updateTransaction } = this.props;
    const { address, nickname } = this.state;
    this.setState({ shouldShowPasswordModal: false }); // Before component is unmounted
    await removeFromContacts({ password, contact: { address, nickname } });
    updateTransaction({ newData: { address, nickname } });
  };
}

const mapStateToProps = (state) => ({
  contacts: state.wallet.contacts
});

const mapDispatchToProps = {
  removeFromContacts,
  updateTransaction
};

DeleteContact = connect<any, any, _, _, _, _>(mapStateToProps, mapDispatchToProps)(DeleteContact);

export default DeleteContact;
