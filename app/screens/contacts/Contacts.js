// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { addToContacts } from '/redux/wallet/actions';
import { SmInput } from '/basicComponents';
import { SearchableList, AddNewContact } from '/components/contacts';
import { search } from '/assets/images';
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
  flex: 1;
  margin-right: 100px;
`;
const RightPane = styled.div`
  min-width: 388px;
`;

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
  history: { push: (string) => void },
  addToContacts: Action,
  contacts: Contact[],
  lastUsedAddresses: Contact[]
};

type State = {
  searchPhrase: string
};

class Contacts extends Component<Props, State> {
  state = {
    searchPhrase: ''
  };

  render() {
    const { contacts, lastUsedAddresses } = this.props;
    const { searchPhrase } = this.state;
    return (
      <Wrapper>
        <Header>My Contacts</Header>
        <BodyWrapper>
          <LeftPane>
            <SearchRow>
              <SmInput type="text" placeholder="Search..." onChange={this.handleSearchTyping} hasDebounce />
              <IconWrapper>
                <Icon src={search} />
              </IconWrapper>
            </SearchRow>
            <SearchableList onSave={this.handleSaveFromLastUsed} title="Last used addresses" list={lastUsedAddresses} searchPhrase={searchPhrase} />
            <SearchableList onSave={this.handleSaveFromLastUsed} title="Contacts" list={contacts} searchPhrase={searchPhrase} />
          </LeftPane>
          <RightPane>
            <AddNewContact onSave={this.handleSave} />
          </RightPane>
        </BodyWrapper>
      </Wrapper>
    );
  }

  handleSearchTyping = ({ value }: { value: string }) => {
    this.setState({ searchPhrase: value });
  };

  handleSave = ({ publicWalletAddress, nickname, email }: Contact) => {
    const { addToContacts } = this.props;
    const contact = {
      publicWalletAddress,
      nickname,
      email
    };
    addToContacts({ contact });
  };

  handleSaveFromLastUsed = ({ publicWalletAddress, nickname, email }: Contact) => {
    // TODO: implement this when modal save to contacts is ready
    // eslint-disable-next-line no-console
    console.warn('Handle Save from last used', publicWalletAddress, nickname, email);
  };
}

const mapStateToProps = (state) => ({
  walletFiles: state.wallet.walletFiles,
  contacts: state.wallet.contacts,
  lastUsedAddresses: state.wallet.lastUsedAddresses
});

const mapDispatchToProps = {
  addToContacts
};

Contacts = connect(
  mapStateToProps,
  mapDispatchToProps
)(Contacts);

export default Contacts;
