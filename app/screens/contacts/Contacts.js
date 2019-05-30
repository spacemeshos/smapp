// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { updateTransactions } from '/redux/wallet/actions';
import { AddNewContact, AllContacts } from '/components/contacts';
import { smColors } from '/vars';
import type { Action, Contact } from '/types';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 50px 60px;
  overflow: hidden;
`;

const Header = styled.div`
  font-size: 31px;
  font-weight: bold;
  color: ${smColors.lighterBlack};
  line-height: 42px;
  margin-bottom: 35px;
`;

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const LeftPane = styled.div`
  flex: 1.5;
  margin-right: 100px;
`;

type Props = {
  updateTransactions: Action
};

type State = {
  addressToAdd?: string
};

class Contacts extends Component<Props, State> {
  state = {
    addressToAdd: ''
  };

  render() {
    const { addressToAdd } = this.state;
    return (
      <Wrapper>
        <Header>My Contacts</Header>
        <BodyWrapper>
          <LeftPane>
            <AllContacts addContact={({ address }) => this.setState({ addressToAdd: address })} />
          </LeftPane>
          <AddNewContact defaultAddress={addressToAdd} onSave={this.handleSaveLastUsedAddress} />
        </BodyWrapper>
      </Wrapper>
    );
  }

  handleSaveLastUsedAddress = async ({ address, nickname }: Contact) => {
    const { updateTransactions } = this.props;
    this.setState({ addressToAdd: '' });
    await updateTransactions({ txMeta: { address, nickname, isSavedContact: true } });
  };
}
const mapStateToProps = (state) => ({
  contacts: state.wallet.contacts
});

const mapDispatchToProps = {
  updateTransactions
};

Contacts = connect(
  mapStateToProps,
  mapDispatchToProps
)(Contacts);

export default Contacts;
