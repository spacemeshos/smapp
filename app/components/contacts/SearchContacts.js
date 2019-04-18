// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { SmInput } from '/basicComponents';
import { SearchableList } from '/components/contacts';
import { search } from '/assets/images';
import { smColors } from '/vars';
import type { Contact } from '/types';

const SearchRow = styled.div`
  display: flex;
  height: 44px;
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
`;

const Icon = styled.img`
  height: 21px;
  width: 20px;
`;

type Props = {
  showLastUsedAddresses: boolean,
  contacts: Contact[],
  lastUsedAddresses: Contact[],
  onSave: ({ publicWalletAddress: string }) => void,
  onSelect: ({ publicWalletAddress: string, nickname: string, email?: string }) => void
};

type State = {
  searchPhrase: string
};

class SearchContacts extends Component<Props, State> {
  state = {
    searchPhrase: ''
  };

  render() {
    const { contacts, lastUsedAddresses, onSave, showLastUsedAddresses, onSelect } = this.props;
    const { searchPhrase } = this.state;
    return (
      <React.Fragment>
        <SearchRow>
          <SmInput type="text" placeholder="Search..." onChange={this.handleSearchTyping} hasDebounce />
          <IconWrapper>
            <Icon src={search} />
          </IconWrapper>
        </SearchRow>
        {showLastUsedAddresses && <SearchableList onSave={onSave} title="Last used addresses" list={lastUsedAddresses} searchPhrase={searchPhrase} />}
        <SearchableList title="Contacts" onSelect={onSelect} list={contacts} searchPhrase={searchPhrase} />
      </React.Fragment>
    );
  }

  handleSearchTyping = ({ value }: { value: string }) => {
    this.setState({ searchPhrase: value });
  };
}

const mapStateToProps = (state) => ({
  contacts: state.wallet.contacts,
  lastUsedAddresses: state.wallet.lastUsedAddresses
});

SearchContacts = connect(mapStateToProps)(SearchContacts);

export default SearchContacts;
