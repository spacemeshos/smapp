import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import {
  CreateNewContact,
  CreatedNewContact,
  EditContact,
} from '../../components/contacts';
import {
  WrapperWith2SideBars,
  Input,
  DropDown,
  BoldText,
} from '../../basicComponents';
import { smColors } from '../../vars';
import { getAbbreviatedAddress } from '../../infra/utils';
import { searchIcon, addContact, clock } from '../../assets/images';
import { RootState } from '../../types';
import { EnterPasswordModal } from '../../components/settings';
import { removeFromContacts } from '../../redux/wallet/actions';
import { Contact } from '../../../shared/types';
import Address from '../../components/common/Address';
import { WalletPath } from '../../routerPaths';

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

const SubHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 45px;
`;

const SubHeaderBtnUpperPart = styled.div<{
  color?: string;
  hoverColor?: string;
}>`
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
  ${({
    theme: {
      button: {
        secondary: { boxRadius },
      },
    },
  }) => `border-radius: ${boxRadius}px`}
`;

const SubHeaderBtnLowerPart = styled.div<{ hoverColor?: string }>`
  position: absolute;
  top: 5px;
  left: 0;
  width: 200px;
  height: 80px;
  border: 1px solid
    ${({ theme: { themeName }, color }) =>
      themeName === 'modern' ? 'transparent' : color};
  &:hover {
    border: 1px solid
      ${({ theme: { themeName }, hoverColor }) =>
        themeName === 'modern' ? 'transparent' : hoverColor};
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
    border: 1px solid
      ${({ theme: { themeName }, color }) =>
        themeName === 'modern' ? 'transparent' : color};
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

const ContactsSubHeaderText = styled(BoldText)`
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => theme.color.contrast};
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
  color: ${({ theme }) =>
    theme.isDarkMode ? smColors.white : smColors.grey100Alpha};
  :nth-child(3) {
    justify-content: center;
  }
  :last-child {
    justify-content: flex-end;
    gap: 16px;
  }
`;

const TextCursorPointer = styled.div`
  cursor: pointer;
`;

const ContactHeader = styled(ContactText)`
  flex: 1;
  color: ${({ theme: { color } }) => color.primary};
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

const EditText = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 14px;
  line-height: 20px;
  color: ${smColors.purple};
  text-decoration: underline;
`;

const DeleteText = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 14px;
  line-height: 20px;
  color: ${smColors.orange};
  text-decoration: underline;
`;

const CreateNewContactImg = styled.img`
  position: absolute;
  top: 6px;
  right: 0;
  width: 31px;
  height: 28px;
  cursor: pointer;
`;

const ClockImg = styled.img`
  position: absolute;
  top: 4px;
  left: 4px;
  height: 16px;
`;

const sortOptions = [{ label: 'Sort by A-Z' }, { label: 'Sort by Z-A' }];
const Contacts = ({ history }: RouteComponentProps) => {
  let newContactCreatedTimeOut: ReturnType<typeof setInterval>;
  const [addressToAdd, setAddressToAdd] = useState('');
  const [tmpSearchTerm, setTmpSearchTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateNewContactModal, setShowCreateNewContactModal] = useState(
    false
  );
  const [selectedSorting, setSelectedSorting] = useState(0);
  const [isNewContactCreated, setIsNewContactCreated] = useState(false);
  const [contactEditing, setContactEditing] = useState<Contact | null>(null);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  const dispatch = useDispatch();

  const contacts = useSelector((state: RootState) => state.wallet.contacts);
  const lastUsedContacts = useSelector(
    (state: RootState) => state.wallet.lastUsedContacts
  );

  useEffect(() => {
    return () => {
      if (newContactCreatedTimeOut) {
        clearTimeout(newContactCreatedTimeOut);
      }
    };
  });

  const contactFilter = (contact: Contact) => {
    const nicknameMatch =
      contact.nickname && contact.nickname.toLowerCase().includes(searchTerm);
    const addressMatch =
      contact.address && contact.address.toLowerCase().includes(searchTerm);
    return nicknameMatch || addressMatch;
  };

  const sortContacts = (c1: Contact, c2: Contact) => {
    if (c1.address.toLowerCase() > c2.address.toLowerCase()) {
      return selectedSorting === 0 ? 1 : -1;
    }
    if (c1.address.toLowerCase() < c2.address.toLowerCase()) {
      return selectedSorting === 0 ? -1 : 1;
    }
    if (c1.nickname.toLowerCase() > c2.nickname.toLowerCase()) {
      return selectedSorting === 0 ? 1 : -1;
    }
    if (c1.nickname.toLowerCase() < c2.nickname.toLowerCase()) {
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
    history.push(WalletPath.SendCoins, { contact });
  };

  const handleEditButton = (contact: Contact) => {
    setContactEditing(contact);
  };

  const deleteContact = async ({
    password,
    contact,
  }: {
    password: string;
    contact: Contact;
  }) => {
    await dispatch(removeFromContacts({ password, contact }));
    setContactToDelete(null);
  };

  const renderLastUsedContacts = () => {
    if (lastUsedContacts && lastUsedContacts.length) {
      // @ts-ignore
      return lastUsedContacts.map((contact: Contact) => (
        <SubHeaderBtnWrapper
          color={smColors.realBlack}
          onClick={() => navigateToSendCoins({ contact })}
          key={contact.address}
        >
          <SubHeaderBtnUpperPart
            color={smColors.black}
            hoverColor={smColors.realBlack}
          >
            <ClockImg src={clock} />
            <LastUsedNickname>
              {contact.nickname || 'UNKNOWN ADDRESS'}
            </LastUsedNickname>
            <LastUsedAddress>
              {getAbbreviatedAddress(contact.address)}
            </LastUsedAddress>
            {!contact.nickname && (
              <LastUsedAddContact
                onClick={(e: React.MouseEvent) =>
                  openAddNewContactModal(e, contact)
                }
              >
                +
              </LastUsedAddContact>
            )}
          </SubHeaderBtnUpperPart>
          <SubHeaderBtnLowerPart
            color={smColors.black}
            hoverColor={smColors.realBlack}
          />
        </SubHeaderBtnWrapper>
      ));
    }
    return null;
  };

  const renderSubHeader = () => {
    if (showCreateNewContactModal) {
      return (
        <CreateNewContact
          initialAddress={addressToAdd}
          onCompleteAction={createdNewContact}
          onCancel={cancelCreateNewContact}
        />
      );
    }
    if (isNewContactCreated) {
      return (
        <CreatedNewContact
          contact={contacts[0]}
          action={() => navigateToSendCoins({ contact: contacts[0] })}
        />
      );
    }
    return (
      <SubHeader>
        <SubHeaderBtnWrapper
          onClick={() => setShowCreateNewContactModal(true)}
          color={smColors.darkerPurple}
        >
          <SubHeaderBtnUpperPart
            color={smColors.purple}
            hoverColor={smColors.darkerPurple}
          >
            <CreateNewContactText>
              CREATE NEW
              <br />
              CONTACT
            </CreateNewContactText>
          </SubHeaderBtnUpperPart>
          <SubHeaderBtnLowerPart
            color={smColors.purple}
            hoverColor={smColors.darkerPurple}
          />
        </SubHeaderBtnWrapper>
        {renderLastUsedContacts()}
      </SubHeader>
    );
  };

  const renderContacts = () => {
    const filteredContacts = contacts.filter(contactFilter);
    if (filteredContacts.length === 0) {
      return (
        <ContactText>{`No contacts matching criteria "${searchTerm}" found`}</ContactText>
      );
    }
    const sortedContacts = filteredContacts.sort(sortContacts);
    return (
      <>
        <ContactRow>
          <ContactHeader>NAME</ContactHeader>
          <ContactHeader>ADDRESS</ContactHeader>
          <ContactHeader>ACTION</ContactHeader>
        </ContactRow>
        <ContactsList>
          {sortedContacts.map((contact: Contact) =>
            contactEditing?.address === contact.address ? (
              <EditContact
                key={`${contact.nickname}_${contact.address}`}
                oldAddress={contact.address}
                oldNickname={contact.nickname}
                onCancel={() => setContactEditing(null)}
                onCompleteAction={() => setContactEditing(null)}
              />
            ) : (
              <ContactRow key={`${contact.nickname}_${contact.address}`}>
                <ContactText onClick={() => navigateToSendCoins({ contact })}>
                  <TextCursorPointer>
                    {contact.nickname || 'UNKNOWN ADDRESS'}
                  </TextCursorPointer>
                </ContactText>
                <ContactText>
                  <Address full address={contact.address} />
                </ContactText>

                <ContactText>
                  <EditText onClick={() => handleEditButton(contact)}>
                    <TextCursorPointer>EDIT</TextCursorPointer>
                  </EditText>

                  <DeleteText onClick={() => setContactToDelete(contact)}>
                    <TextCursorPointer>DELETE</TextCursorPointer>
                  </DeleteText>
                </ContactText>

                {!contact.nickname && (
                  <CreateNewContactImg
                    onClick={(e: React.MouseEvent) =>
                      openAddNewContactModal(e, contact)
                    }
                    src={addContact}
                  />
                )}
              </ContactRow>
            )
          )}
        </ContactsList>
      </>
    );
  };

  return (
    <WrapperWith2SideBars width={1000} height={520} header="CONTACTS">
      <SearchWrapper>
        {/* <SearchIcon src={searchIcon} /> */}
        <Input
          iconLeft={searchIcon}
          value={tmpSearchTerm}
          type="text"
          placeholder="Search contacts"
          onChange={({ value }) => {
            setTmpSearchTerm(value);
          }}
          onChangeDebounced={({ value }) => {
            setSearchTerm(value.toString());
          }}
          // style={{ border: '1px solid transparent' }}
          autofocus
        />
      </SearchWrapper>
      {renderSubHeader()}
      <ContactsSubHeader>
        <ContactsSubHeaderText>All Contacts</ContactsSubHeaderText>
        <DropDown
          data={sortOptions}
          onClick={({ index }) => setSelectedSorting(index)}
          selectedItemIndex={selectedSorting}
        />
      </ContactsSubHeader>
      {contacts && contacts.length ? (
        renderContacts()
      ) : (
        <ContactText>
          {searchTerm
            ? 'No contacts matching criteria'
            : 'No contacts added yet'}
        </ContactText>
      )}
      {contactToDelete && (
        <EnterPasswordModal
          submitAction={({ password }) =>
            contactToDelete &&
            deleteContact({ contact: contactToDelete, password })
          }
          closeModal={() => setContactToDelete(null)}
        />
      )}
    </WrapperWith2SideBars>
  );
};

export default Contacts;
