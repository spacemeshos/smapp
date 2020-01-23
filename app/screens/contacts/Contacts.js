// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { CreateNewContact, CreatedNewContact } from '/components/contacts';
import { ScreenErrorBoundary } from '/components/errorHandler';
import { WrapperWith2SideBars, Input, DropDown } from '/basicComponents';
import { smColors } from '/vars';
import { getAbbreviatedText } from '/infra/utils';
import { searchIcon, addContact } from '/assets/images';
import type { RouterHistory } from 'react-router-dom';
import type { Contact } from '/types';

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
  border: 1px solid ${smColors.realBlack};
  background-color: ${smColors.white};
`;

const SearchIcon = styled.img`
  width: 15px;
  height: 15px;
  margin-left: 15px;
`;

const SubHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;
`;

const SubHeaderText = styled.div`
  font-size: 15px;
  line-height: 20px;
  color: ${smColors.realBlack};
`;

const SubHeaderInner = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const SubHeaderBtnUpperPart = styled.div`
  position: absolute;
  top: 0;
  left: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 140px;
  height: 60px;
  background-color: ${({ color }) => color};
  z-index: 1;
  &:hover {
    background-color: ${({ hoverColor }) => hoverColor};
  }
  cursor: inherit;
  text-align: center;
`;

const SubHeaderBtnLowerPart = styled.div`
  position: absolute;
  top: 5px;
  left: 0;
  width: 140px;
  height: 60px;
  border: 1px solid ${({ color }) => color};
  &:hover {
    border: 1px solid ${({ hoverColor }) => hoverColor};
  }
  cursor: inherit;
`;

const SubHeaderBtnWrapper = styled.div`
  position: relative;
  width: 140px;
  height: 65px;
  &:hover ${SubHeaderBtnUpperPart} {
    background-color: ${({ color }) => color};
  }
  &:hover ${SubHeaderBtnLowerPart} {
    border: 1px solid ${({ color }) => color};
  }
  cursor: pointer;
`;

const CreateNewContactText = styled.div`
  font-size: 15px;
  line-height: 21px;
  color: ${smColors.white};
  text-decoration: underline;
  cursor: inherit;
`;

const LastUsedNickname = styled.div`
  font-size: 13px;
  line-height: 17px;
  color: ${smColors.white};
  cursor: inherit;
`;

const LastUsedAddress = styled.div`
  font-size: 13px;
  line-height: 17px;
  color: ${smColors.mediumGray};
  text-decoration: underline;
  cursor: inherit;
`;

const LastUsedAddContact = styled.div`
  position: absolute;
  top: -1px;
  right: -1px;
  width: 19px;
  height: 19px;
  font-size: 25px;
  line-height: 25px;
  color: ${smColors.white};
  cursor: pointer;
  z-index: 10;
`;

const ContactsSubHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
`;

const ContactsSubHeaderText = styled.div`
  font-family: SourceCodeProBold;
  font-size: 16px;
  line-height: 20px;
  color: ${smColors.realBlack};
  margin-right: 20px;
`;

const ContactsList = styled.div`
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: scroll;
`;

const ContactRow = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid ${smColors.disabledGray};
  cursor: pointer;
`;

const ContactText = styled.div`
  flex: 1;
  font-size: 16px;
  line-height: 20px;
  color: ${smColors.black};
  text-align: left;
  margin-right: 10px;
`;

const SortingElement = styled.div`
  font-size: 13px;
  line-height: 17px;
  color: ${smColors.black};
  padding: 5px;
  cursor: inherit;
  ${({ isInDropDown }) => isInDropDown && `opacity: 0.5; border-bottom: 1px solid ${smColors.disabledGray};`}
  &:hover {
    opacity: 1;
    color: ${smColors.darkGray50Alpha};
  }
`;

const CreateNewContactImg = styled.img`
  position: absolute;
  top: 6px;
  right: 0;
  width: 31px;
  height: 28px;
  cursor: pointer;
`;

const sortOptions = [
  { id: 1, label: 'Sort by A-Z' },
  { id: 2, label: 'Sort by Z-A' }
];

type Props = {
  contacts: Contact[],
  lastUsedContacts: Contact[],
  history: RouterHistory
};

type State = {
  addressToAdd?: string,
  tmpSearchTerm: string,
  searchTerm: string,
  shouldShowCreateNewContactModal: boolean,
  selectedSorting: number,
  isNewContactCreated: boolean
};

class Contacts extends Component<Props, State> {
  newContactCreatedTimeOut: TimeoutID;

  state = {
    addressToAdd: '',
    tmpSearchTerm: '',
    searchTerm: '',
    shouldShowCreateNewContactModal: false,
    selectedSorting: 0,
    isNewContactCreated: false
  };

  render() {
    const { contacts } = this.props;
    const { tmpSearchTerm, searchTerm, selectedSorting } = this.state;
    return (
      <WrapperWith2SideBars width={1000} height={600} header="CONTACTS">
        <SearchWrapper>
          <SearchIcon src={searchIcon} />
          <Input
            value={tmpSearchTerm}
            type="text"
            placeholder="Search contacts"
            onChange={({ value }) => this.setState({ tmpSearchTerm: value })}
            onChangeDebounced={({ value }) => this.setState({ searchTerm: value })}
            style={{ border: '1px solid transparent' }}
          />
        </SearchWrapper>
        {this.renderSubHeader()}
        <ContactsSubHeader>
          <ContactsSubHeaderText>All Contacts</ContactsSubHeaderText>
          <DropDown
            data={sortOptions}
            onPress={({ index }) => this.setState({ selectedSorting: index })}
            DdElement={this.renderSortElementElement}
            selectedItemIndex={selectedSorting}
            style={{ flex: '0 0 150px', borderBottom: '1px solid' }}
          />
        </ContactsSubHeader>
        <ContactsList>
          {contacts && contacts.length ? this.renderContacts() : <ContactText>{searchTerm ? 'No contacts matching criteria' : 'No contacts added yet'}</ContactText>}
        </ContactsList>
      </WrapperWith2SideBars>
    );
  }

  componentWillUnmount() {
    this.newContactCreatedTimeOut && clearTimeout(this.newContactCreatedTimeOut);
  }

  renderSubHeader = () => {
    const { contacts } = this.props;
    const { addressToAdd, shouldShowCreateNewContactModal, isNewContactCreated } = this.state;
    if (shouldShowCreateNewContactModal) {
      return <CreateNewContact initialAddress={addressToAdd} onCompleteAction={this.createdNewContact} onCancel={this.cancelCreateNewContact} />;
    }
    if (isNewContactCreated) {
      return <CreatedNewContact contact={contacts[0]} action={() => this.navigateToSendCoins({ contact: contacts[0] })} />;
    }
    return (
      <SubHeader>
        <SubHeaderText>
          Recent
          <br />
          --
        </SubHeaderText>
        <SubHeaderInner>
          <SubHeaderBtnWrapper onClick={() => this.setState({ shouldShowCreateNewContactModal: true })} color={smColors.darkerPurple}>
            <SubHeaderBtnUpperPart color={smColors.purple} hoverColor={smColors.darkerPurple}>
              <CreateNewContactText>
                CREATE NEW
                <br />
                CONTACT
              </CreateNewContactText>
            </SubHeaderBtnUpperPart>
            <SubHeaderBtnLowerPart color={smColors.purple} hoverColor={smColors.darkerPurple} />
          </SubHeaderBtnWrapper>
          {this.renderLastUsedContacts()}
        </SubHeaderInner>
      </SubHeader>
    );
  };

  renderLastUsedContacts = () => {
    const { lastUsedContacts } = this.props;
    if (lastUsedContacts && lastUsedContacts.length) {
      return lastUsedContacts.map((contact) => (
        <SubHeaderBtnWrapper color={smColors.realBlack} onClick={() => this.navigateToSendCoins({ contact })} key={contact.address}>
          <SubHeaderBtnUpperPart color={smColors.black} hoverColor={smColors.realBlack}>
            <LastUsedNickname>{contact.nickname || 'UNKNOWN ADDRESS'}</LastUsedNickname>
            <LastUsedAddress>{getAbbreviatedText(contact.address)}</LastUsedAddress>
            {!contact.nickname && <LastUsedAddContact onClick={(e) => this.openAddNewContactModal(e, contact)}>+</LastUsedAddContact>}
          </SubHeaderBtnUpperPart>
          <SubHeaderBtnLowerPart color={smColors.black} hoverColor={smColors.realBlack} />
        </SubHeaderBtnWrapper>
      ));
    }
    return null;
  };

  renderSortElementElement = ({ label, isMain }: { label: string, isMain: boolean }) => (
    <SortingElement key={label} isInDropDown={!isMain}>
      {label}
    </SortingElement>
  );

  renderContacts = () => {
    const { contacts } = this.props;
    const { searchTerm } = this.state;
    const filteredContacts = contacts.filter(this.contactFilter);
    if (filteredContacts.length === 0) {
      return <ContactText>{`No contacts matching criteria "${searchTerm}" found`}</ContactText>;
    }
    const sortedContacts = filteredContacts.sort(this.sortContacts);
    return sortedContacts.map((contact) => (
      <ContactRow key={`${contact.nickname}_${contact.address}`} onClick={() => this.navigateToSendCoins({ contact })}>
        <ContactText>{contact.nickname || 'UNKNOWN ADDRESS'}</ContactText>
        <ContactText>{getAbbreviatedText(contact.address)}</ContactText>
        {!contact.nickname && <CreateNewContactImg onClick={(e) => this.openAddNewContactModal(e, contact)} src={addContact} />}
      </ContactRow>
    ));
  };

  contactFilter = (contact: Contact) => {
    const { searchTerm } = this.state;
    const nicknameMatch = contact.nickname && contact.nickname.toLowerCase().includes(searchTerm);
    const addressMatch = contact.address && contact.address.toLowerCase().includes(searchTerm);
    return nicknameMatch || addressMatch;
  };

  sortContacts = (c1: Contact, c2: Contact) => {
    const { selectedSorting } = this.state;
    if (c1.nickname > c2.nickname) {
      return selectedSorting === 0 ? 1 : -1;
    }
    if (c1.nickname < c2.nickname) {
      return selectedSorting === 0 ? -1 : 1;
    }
    if (c1.address > c2.address) {
      return selectedSorting === 0 ? 1 : -1;
    }
    if (c1.address < c2.address) {
      return selectedSorting === 0 ? -1 : 1;
    }
    return 0;
  };

  openAddNewContactModal = (e: Event, contact: Contact) => {
    e.stopPropagation();
    this.setState({ addressToAdd: contact.address, shouldShowCreateNewContactModal: true });
  };

  createdNewContact = () => {
    this.setState({ addressToAdd: '', shouldShowCreateNewContactModal: false, isNewContactCreated: true });
    this.newContactCreatedTimeOut = setTimeout(() => this.setState({ isNewContactCreated: false }), 10000);
  };

  cancelCreateNewContact = () => {
    this.setState({ addressToAdd: '', shouldShowCreateNewContactModal: false, isNewContactCreated: false });
  };

  navigateToSendCoins = ({ contact }: { contact: Contact }) => {
    const { history } = this.props;
    history.push('/main/wallet/send-coins', { contact });
  };
}

const mapStateToProps = (state) => ({
  contacts: state.wallet.contacts,
  lastUsedContacts: state.wallet.lastUsedContacts
});

Contacts = connect(mapStateToProps)(Contacts);
Contacts = ScreenErrorBoundary(Contacts);
export default Contacts;
