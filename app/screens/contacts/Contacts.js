// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { CreateNewContact } from '/components/contacts';
import { ScreenErrorBoundary } from '/components/errorHandler';
import { WrapperWith2SideBars, Input, DropDown } from '/basicComponents';
import { smColors } from '/vars';
import { getAbbreviatedText } from '/infra/utils';
import type { Contact } from '/types';

const SubHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;
`;

const SubHeaderText = styled.div`
  font-size: 16px;
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
  width: 135px;
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
  width: 135px;
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
`;

const LastUsedAddress = styled.div`
  font-size: 13px;
  line-height: 17px;
  color: ${smColors.mediumGray};
  text-decoration: underline;
`;

const LastUsedAddContact = styled.div`
  position: absolute;
  top: 2;
  right: 2;
  width: 19px;
  height: 19px;
  font-size: 19px;
  line-height: 19px;
  color: ${smColors.white};
  cursor: pointer;
`;

const ContactsSubHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
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
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid ${smColors.disabledGray};
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
  top: 0;
  right: 0;
  width: 37px;
  height: 36px;
  cursor: pointer;
`;

const sortOptions = [{ id: 1, label: 'Sort by A-Z' }, { id: 2, label: 'Sort by Z-A' }];

type Props = {
  contacts: Contact[],
  lastUsedContacts: Contact[]
};

type State = {
  addressToAdd?: string,
  tmpSearchTerm: string,
  searchTerm: string,
  shouldShowCreateNewContactModal: boolean,
  selectedSorting: number
};

class Contacts extends Component<Props, State> {
  state = {
    addressToAdd: '',
    tmpSearchTerm: '',
    searchTerm: '',
    shouldShowCreateNewContactModal: false,
    selectedSorting: 0
  };

  render() {
    const { contacts } = this.props;
    const { addressToAdd, tmpSearchTerm, shouldShowCreateNewContactModal, selectedSorting } = this.state;
    return (
      <WrapperWith2SideBars width={1000} height={600} header="MY CONTACTS">
        <Input
          value={tmpSearchTerm}
          type="text"
          placeholder="Search contacts"
          onChange={({ value }) => this.setState({ tmpSearchTerm: value })}
          onChangeDebounced={({ value }) => this.setState({ searchTerm: value })}
          style={{ marginBottom: 20 }}
        />
        {!shouldShowCreateNewContactModal ? (
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
        ) : (
          <CreateNewContact initialAddress={addressToAdd} onCompleteAction={() => this.setState({ addressToAdd: '', shouldShowCreateNewContactModal: false })} />
        )}
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
        <ContactsList>{contacts && contacts.length && this.renderContacts()}</ContactsList>
      </WrapperWith2SideBars>
    );
  }

  renderLastUsedContacts = () => {
    const { lastUsedContacts } = this.props;
    if (lastUsedContacts && lastUsedContacts.length) {
      return lastUsedContacts.map((contact) => (
        <SubHeaderBtnWrapper color={smColors.realBlack}>
          <SubHeaderBtnUpperPart color={smColors.black} hoverColor={smColors.realBlack}>
            <LastUsedNickname>{contact.nickname || 'UNKNOWN ADDRESS'}</LastUsedNickname>
            <LastUsedAddress>{getAbbreviatedText(contact.address)}</LastUsedAddress>
            {!contact.nickname && (
              <LastUsedAddContact onClick={() => this.setState({ addressToAdd: contact.address, shouldShowCreateNewContactModal: true })}>+</LastUsedAddContact>
            )}
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
      <ContactRow key={`${contact.nickname}_${contact.address}`}>
        <ContactText>{contact.nickname || 'UNKNOWN ADDRESS'}</ContactText>
        <ContactText>{getAbbreviatedText(contact.address, 8)}</ContactText>
        <ContactText>{contact.email}</ContactText>
        {!contact.nickname && <CreateNewContactImg onClick={() => this.setState({ addressToAdd: contact.address, shouldShowCreateNewContactModal: true })} />}
        <CreateNewContactImg onClick={() => this.setState({ addressToAdd: contact.address, shouldShowCreateNewContactModal: true })} />
      </ContactRow>
    ));
  };

  contactFilter = (contact: Contact) => {
    const { searchTerm } = this.state;
    const nicknameMatch = contact.nickname && contact.nickname.toLowerCase().includes(searchTerm);
    const addressMatch = contact.address && contact.address.toLowerCase().includes(searchTerm);
    const emailMatch = contact.email && contact.email.includes(searchTerm);
    return nicknameMatch || addressMatch || emailMatch;
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
}

const mapStateToProps = (state) => ({
  contacts: state.wallet.contacts,
  lastUsedContacts: state.wallet.lastUsedContacts
});

Contacts = connect(mapStateToProps)(Contacts);
Contacts = ScreenErrorBoundary(Contacts);
export default Contacts;
