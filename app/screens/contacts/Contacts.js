// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { addLastUsedAddress, updateTransaction } from '/redux/wallet/actions';
import { AddNewContact, AllContacts } from '/components/contacts';
import { smColors } from '/vars';
import type { Action, Contact, TxList, Tx } from '/types';
import uniqBy from 'lodash.uniqby';

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
  updateTransaction: Action,
  addLastUsedAddress: Action,
  transactions: TxList,
  contacts: Contact[],
  lastUsedAddresses: Contact[]
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

  componentDidMount() {
    this.generateLastUsedListFromTransactions();
  }

  handleSaveLastUsedAddress = ({ address, nickname, email }: Contact) => {
    const { addLastUsedAddress, transactions, updateTransaction, lastUsedAddresses } = this.props;
    const lastUsedTransaction: Tx = transactions.find((transaction: Tx) => transaction.address === address);
    const isInLastUsedList = !!lastUsedAddresses.find((lastUsed: Contact) => lastUsed.address === address);
    this.setState({ addressToAdd: '' });
    updateTransaction({ tx: { ...lastUsedTransaction, address, nickname, isSavedContact: true } });
    if (isInLastUsedList) {
      addLastUsedAddress({ contact: { address, nickname, email } });
    }
  };

  generateLastUsedListFromTransactions = () => {
    const { transactions, addLastUsedAddress, contacts } = this.props;
    const recentSentTransactions: TxList = uniqBy(transactions, 'address')
      .filter((transaction: Tx) => transaction.isSent)
      .slice(0, 3)
      .reverse();
    recentSentTransactions.forEach((transaction: Tx) => {
      const indexInContacts = contacts.findIndex((contact: Contact) => contact.address === transaction.address);
      if (indexInContacts < 0) {
        addLastUsedAddress({ contact: { address: transaction.address, nickname: null, email: null } });
      } else {
        const contact = { ...contacts[indexInContacts] };
        addLastUsedAddress({ contact });
      }
    });
  };
}
const mapStateToProps = (state) => ({
  transactions: state.wallet.transactions[state.wallet.currentAccountIndex],
  contacts: state.wallet.contacts,
  lastUsedAddresses: state.wallet.lastUsedAddresses
});

const mapDispatchToProps = {
  updateTransaction,
  addLastUsedAddress
};

Contacts = connect(
  mapStateToProps,
  mapDispatchToProps
)(Contacts);

export default Contacts;
