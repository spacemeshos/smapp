import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { CreateNewContact, CreatedNewContact } from '../../components/contacts';
import { WrapperWith2SideBars, Input, DropDown } from '../../basicComponents';
import { smColors } from '../../vars';
import { getAbbreviatedText } from '../../infra/utils';
import { searchIcon, addContact, explorer, copyWhite, copyBlack, clock } from '../../assets/images';
import { Contact, RootState } from '../../types';
import { EnterPasswordModal } from '../../components/settings';
import { removeFromContacts } from '../../redux/wallet/actions';

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
  margin-bottom: 45px;
`;

const SubHeaderText = styled.div`
  font-size: 15px;
  line-height: 20px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.realBlack)};
`;

const SubHeaderInner = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const SubHeaderBtnUpperPart = styled.div<{ color?: string; hoverColor?: string }>`
  position: absolute;
  top: 0;
  left: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 80px;
  background-color: ${({ color }) => color};
  z-index: 1;
  &:hover {
    background-color: ${({ hoverColor }) => hoverColor};
  }
  cursor: inherit;
  text-align: center;
`;

const SubHeaderBtnLowerPart = styled.div<{ hoverColor?: string }>`
  position: absolute;
  top: 5px;
  left: 0;
  width: 200px;
  height: 80px;
  border: 1px solid ${({ color }) => color};
  &:hover {
    border: 1px solid ${({ hoverColor }) => hoverColor};
  }
  cursor: inherit;
`;

const SubHeaderBtnWrapper = styled.div`
  position: relative;
  width: 200px;
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
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.realBlack)};
  margin-right: 20px;
`;

const ContactsList = styled.div`
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 4px;
  }
  ::-webkit-scrollbar-track {
    background-color: transparent;
    border-radius: 2px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: ${smColors.darkGray};
    outline: 1px solid ${smColors.darkGray};
    border-radius: 2px;
  }
`;

const ContactRow = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 0;
  margin-right: 10px;
  border-bottom: 1px solid ${smColors.disabledGray};
`;

const ContactText = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.grey100Alpha)};
  :nth-child(3) {
    justify-content: center;
  }
  :last-child {
    justify-content: center;
  }
`;

const TextCursorPointer = styled.div`
  cursor: pointer;
`;

const ContactHeader = styled(ContactText)`
  flex: 1;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
  :nth-child(2) {
    flex: unset;
    width: 420px;
    justify-content: center;
  }
  :nth-child(3) {
    justify-content: center;
  }
  :last-child {
    justify-content: flex-end;
  }
`;

const DeleteText = styled.div`
  display: flex;
  justify-content: flex-end;
  flex: 1;
  font-size: 14px;
  line-height: 20px;
  color: ${smColors.orange};
  text-decoration: underline;
`;

const SortingElement = styled.div<{ isInDropDown?: boolean }>`
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

const ExplorerIcon = styled.img`
  width: 31px;
  height: 28px;
  cursor: pointer;
`;

const CopyIcon = styled.img`
  align-self: flex-end;
  height: 15px;
  margin-left: 6px;
  cursor: pointer;
  &:hover {
    opacity: 0.5;
  }
  &:active {
    transform: translate3d(2px, 2px, 0);
  }
`;

const ClockImg = styled.img`
  position: absolute;
  top: 4px;
  left: 4px;
  height: 16px;
`;

const sortOptions = [
  { id: 1, label: 'Sort by A-Z' },
  { id: 2, label: 'Sort by Z-A' }
];

const Contacts = ({ history }: RouteComponentProps) => {
  let newContactCreatedTimeOut: ReturnType<typeof setInterval>;

  const [addressToAdd, setAddressToAdd] = useState('');
  const [tmpSearchTerm, setTmpSearchTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateNewContactModal, setShowCreateNewContactModal] = useState(false);
  const [selectedSorting, setSelectedSorting] = useState(0);
  const [isNewContactCreated, setIsNewContactCreated] = useState(false);
  const [shouldShowPasswordModal, setShouldShowPasswordModal] = useState(false);
  const [contactForDelete, setContactForDelete] = useState({ address: '', nickname: '' });
  const dispatch = useDispatch();

  const contacts = useSelector((state: RootState) => state.wallet.contacts);
  const lastUsedContacts = useSelector((state: RootState) => state.wallet.lastUsedContacts);
  const explorerUrl = useSelector((state: RootState) => state.network.explorerUrl);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  useEffect(() => {
    return () => {
      if (newContactCreatedTimeOut) {
        clearTimeout(newContactCreatedTimeOut);
      }
    };
  });

  const contactFilter = (contact: Contact) => {
    const nicknameMatch = contact.nickname && contact.nickname.toLowerCase().includes(searchTerm);
    const addressMatch = contact.address && contact.address.toLowerCase().includes(searchTerm);
    return nicknameMatch || addressMatch;
  };

  const sortContacts = (c1: Contact, c2: Contact) => {
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

  const openAddNewContactModal = (e: any, contact: Contact) => {
    e.stopPropagation();
    setAddressToAdd(contact.address);
    setShowCreateNewContactModal(true);
  };

  const createdNewContact = () => {
    setAddressToAdd('');
    setShowCreateNewContactModal(false);
    setIsNewContactCreated(false);
    newContactCreatedTimeOut = setTimeout(() => {
      setIsNewContactCreated(false);
    }, 10000);
  };

  const cancelCreateNewContact = () => {
    setAddressToAdd('');
    setShowCreateNewContactModal(false);
    setIsNewContactCreated(false);
  };

  const navigateToSendCoins = ({ contact }: { contact: Contact }) => {
    history.push('/main/wallet/send-coins', { contact });
  };

  const handleDeleteButton = (contact: Contact) => {
    setContactForDelete(contact);
    setShouldShowPasswordModal(true);
  };

  const deleteContact = async ({ password }: { password: string }) => {
    await dispatch(removeFromContacts({ password, contact: contactForDelete }));
    setShouldShowPasswordModal(false);
  };

  const copyAddress = async (e: React.MouseEvent, address: string) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(address);
  };

  const openExplorerLink = (address: string) => window.open(`${explorerUrl}accounts/${address}${isDarkMode ? '?dark' : ''}`);

  const renderLastUsedContacts = () => {
    if (lastUsedContacts && lastUsedContacts.length) {
      // @ts-ignore
      return lastUsedContacts.map((contact: Contact) => (
        <SubHeaderBtnWrapper color={smColors.realBlack} onClick={() => navigateToSendCoins({ contact })} key={contact.address}>
          <SubHeaderBtnUpperPart color={smColors.black} hoverColor={smColors.realBlack}>
            <ClockImg src={clock} />
            <LastUsedNickname>{contact.nickname || 'UNKNOWN ADDRESS'}</LastUsedNickname>
            <LastUsedAddress>{getAbbreviatedText(contact.address)}</LastUsedAddress>
            {!contact.nickname && <LastUsedAddContact onClick={(e: React.MouseEvent) => openAddNewContactModal(e, contact)}>+</LastUsedAddContact>}
          </SubHeaderBtnUpperPart>
          <SubHeaderBtnLowerPart color={smColors.black} hoverColor={smColors.realBlack} />
        </SubHeaderBtnWrapper>
      ));
    }
    return null;
  };

  const renderSubHeader = () => {
    if (showCreateNewContactModal) {
      return <CreateNewContact initialAddress={addressToAdd} onCompleteAction={createdNewContact} onCancel={cancelCreateNewContact} />;
    }
    if (isNewContactCreated) {
      return <CreatedNewContact contact={contacts[0]} action={() => navigateToSendCoins({ contact: contacts[0] })} />;
    }
    return (
      <SubHeader>
        <SubHeaderText>
          Recent
          <br />
          --
        </SubHeaderText>
        <SubHeaderInner>
          <SubHeaderBtnWrapper onClick={() => setShowCreateNewContactModal(true)} color={smColors.darkerPurple}>
            <SubHeaderBtnUpperPart color={smColors.purple} hoverColor={smColors.darkerPurple}>
              <CreateNewContactText>
                CREATE NEW
                <br />
                CONTACT
              </CreateNewContactText>
            </SubHeaderBtnUpperPart>
            <SubHeaderBtnLowerPart color={smColors.purple} hoverColor={smColors.darkerPurple} />
          </SubHeaderBtnWrapper>
          {renderLastUsedContacts()}
        </SubHeaderInner>
      </SubHeader>
    );
  };

  const renderSortElementElement = ({ label, isMain }: { label: string; isMain: boolean }) => (
    <SortingElement key={label} isInDropDown={!isMain}>
      {label}
    </SortingElement>
  );

  const renderContacts = () => {
    const filteredContacts = contacts.filter(contactFilter);
    if (filteredContacts.length === 0) {
      return <ContactText>{`No contacts matching criteria "${searchTerm}" found`}</ContactText>;
    }
    const sortedContacts = filteredContacts.sort(sortContacts);
    return (
      <>
        <ContactRow>
          <ContactHeader>NAME</ContactHeader>
          <ContactHeader>ADDRESS</ContactHeader>
          <ContactHeader>EXPLORER</ContactHeader>
          <ContactHeader>ACTION</ContactHeader>
        </ContactRow>
        <ContactsList>
          {sortedContacts.map((contact: Contact) => (
            <ContactRow key={`${contact.nickname}_${contact.address}`}>
              <ContactText onClick={() => navigateToSendCoins({ contact })}>
                <TextCursorPointer>{contact.nickname || 'UNKNOWN ADDRESS'}</TextCursorPointer>
              </ContactText>
              <ContactText>
                {contact.address}
                <CopyIcon src={isDarkMode ? copyWhite : copyBlack} onClick={(e: React.MouseEvent) => copyAddress(e, contact.address)} />
              </ContactText>
              <ContactText onClick={() => openExplorerLink(contact.address)}>
                <ExplorerIcon src={explorer} />
              </ContactText>
              <DeleteText onClick={() => handleDeleteButton(contact)}>
                <TextCursorPointer>DELETE</TextCursorPointer>
              </DeleteText>
              {!contact.nickname && <CreateNewContactImg onClick={(e: React.MouseEvent) => openAddNewContactModal(e, contact)} src={addContact} />}
            </ContactRow>
          ))}
        </ContactsList>
      </>
    );
  };

  return (
    <WrapperWith2SideBars width={1000} height={500} header="CONTACTS" isDarkMode={isDarkMode}>
      <SearchWrapper>
        <SearchIcon src={searchIcon} />
        <Input
          value={tmpSearchTerm}
          type="text"
          placeholder="Search contacts"
          onChange={({ value }) => {
            setTmpSearchTerm(value);
          }}
          onChangeDebounced={({ value }) => {
            setSearchTerm(value.toString());
          }}
          style={{ border: '1px solid transparent' }}
          autofocus
        />
      </SearchWrapper>
      {renderSubHeader()}
      <ContactsSubHeader>
        <ContactsSubHeaderText>All Contacts</ContactsSubHeaderText>
        <DropDown
          data={sortOptions}
          onClick={({ index }) => setSelectedSorting(index)}
          DdElement={renderSortElementElement}
          selectedItemIndex={selectedSorting}
          style={{ flex: '0 0 150px', borderBottom: '1px solid' }}
          bgColor={smColors.white}
        />
      </ContactsSubHeader>
      {contacts && contacts.length ? renderContacts() : <ContactText>{searchTerm ? 'No contacts matching criteria' : 'No contacts added yet'}</ContactText>}
      {shouldShowPasswordModal && <EnterPasswordModal submitAction={deleteContact} closeModal={() => setShouldShowPasswordModal(false)} />}
    </WrapperWith2SideBars>
  );
};

export default Contacts;
