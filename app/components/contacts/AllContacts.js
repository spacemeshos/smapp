// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { SmInput } from '/basicComponents';
import { search } from '/assets/images';
import { smColors } from '/vars';
import type { Contact } from '/types';
import ContactsList from './ContactsList';

const SearchRow = styled.div`
  height: 44px;
  display: flex;
  flex-direction: row;
  margin-bottom: 45px;
`;

const IconWrapper = styled.div`
  height: 44px;
  width: 44px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid ${smColors.borderGray};
  border-radius: 0 2px 2px 0;
  border-left: none;
`;

const Icon = styled.img`
  height: 21px;
  width: 20px;
`;

// $FlowStyledIssue
const ListsWrapper = styled.div`
  max-height: ${({ isModalMode }) => (isModalMode ? '400px' : '600px')};
  overflow-x: hidden;
  overflow-y: visible;
`;

type Props = {
  contacts: Contact[],
  lastUsedAddresses: Contact[],
  addContact: ({ address: string }) => void,
  selectContact: ({ contact: Contact }) => void,
  isModalMode?: boolean
};

type State = {
  searchTerm: string
};

class AllContacts extends Component<Props, State> {
  state = {
    searchTerm: ''
  };

  render() {
    const { contacts, lastUsedAddresses, addContact, selectContact, isModalMode } = this.props;
    const { searchTerm } = this.state;

    return (
      <div>
        <SearchRow>
          <SmInput type="text" placeholder="Search contact" onChange={this.handleSearchTyping} hasDebounce isErrorMsgEnabled={false} />
          <IconWrapper>
            <Icon src={search} />
          </IconWrapper>
        </SearchRow>
        <ListsWrapper isModalMode={isModalMode}>
          <div>
            {lastUsedAddresses && lastUsedAddresses.length ? (
              <ContactsList
                title="Last used addresses"
                emptyText="No last used addresses"
                addContact={addContact}
                selectContact={selectContact}
                list={lastUsedAddresses}
                searchTerm={searchTerm}
              />
            ) : null}
            <ContactsList title="Contacts" emptyText="No contact" selectContact={selectContact} list={contacts} searchTerm={searchTerm} />
          </div>
        </ListsWrapper>
      </div>
    );
  }

  handleSearchTyping = ({ value }: { value: string }) => {
    this.setState({ searchTerm: value.toLowerCase() });
  };
}

const mapStateToProps = (state) => ({
  contacts: state.wallet.contacts,
  lastUsedAddresses: state.wallet.lastUsedAddresses
});

AllContacts = connect<any, any, _, _, _, _>(mapStateToProps)(AllContacts);
export default AllContacts;
