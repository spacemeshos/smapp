// @flow
import React from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';
import type { Contact } from '/types';

const Wrapper = styled.div`
  margin-bottom: 25px;
`;

const Title = styled.div`
  height: 32px;
  border-bottom: 1px solid ${smColors.borderGray};
  font-size: 14px;
  font-weight: bold;
  line-height: 19px;
  color: ${smColors.darkGray};
`;

const AddressRow = styled.div`
  height: 76px;
  border-bottom: 1px solid ${smColors.borderGray};
  padding-bottom: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px 0;
  cursor: ${({ isSelectable }) => (isSelectable ? 'pointer' : 'default')};
`;

const Text = styled.span`
  font-size: 16px;
  font-weight: normal;
  line-height: 22px;
  cursor: inherit;
`;

const BoldText = styled(Text)`
  font-weight: bold;
  margin-bottom: 5px;
  cursor: inherit;
`;

const ActionLink = styled(Text)`
  color: ${smColors.orange};
  padding-left: 12px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.6;
  }
`;

type Props = {
  title: string,
  searchTerm?: string,
  emptyText: string,
  list: Contact[],
  addContact?: ({ address: string }) => void,
  selectContact?: ({ contact: { address: string, nickname: string, email?: string } }) => void
};

const ContactsList = ({ searchTerm, list, title, emptyText, addContact, selectContact }: Props) => {
  const isMatchingSearch = (contact: Contact) => {
    const nicknameMatch = contact.nickname && contact.nickname.toLowerCase().includes(searchTerm);
    const addressMatch = contact.address && contact.address.toLowerCase().includes(searchTerm);
    const emailMatch = contact.email && contact.email.includes(searchTerm);
    return nicknameMatch || addressMatch || emailMatch;
  };
  let hasMatches = false;
  return (
    <Wrapper>
      <Title>{title}</Title>
      <div>
        {list.map((contact) => {
          const hasMatch = !!contact && isMatchingSearch(contact);
          hasMatches = hasMatches || hasMatch;
          return hasMatch ? (
            <AddressRow key={`${contact.nickname}_${contact.address}`} onClick={() => selectContact && selectContact({ contact })} isSelectable={!!selectContact}>
              <BoldText>
                {contact.nickname || 'Unknown'}
                {!contact.nickname && addContact && <ActionLink onClick={() => addContact({ address: contact.address })}>Save to contacts</ActionLink>}
              </BoldText>
              <Text>{contact.address}</Text>
            </AddressRow>
          ) : null;
        })}
        {!hasMatches && <Text>{emptyText}</Text>}
      </div>
    </Wrapper>
  );
};

export default ContactsList;
