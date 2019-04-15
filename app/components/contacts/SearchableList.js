import React from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';
import type { Contact } from '/types';

const Wrapper = styled.div`
  margin-bottom: 24px;
`;

const TitleWrapper = styled.div`
  height: 32px;
  border-bottom: 1px solid ${smColors.borderGray};
`;

const ItemsContainer = styled.div`
  max-height: 240px;
  overflow-y: scroll;
`;

const Text = styled.span`
  font-size: 16px;
  font-weight: normal;
  line-height: 22px;
`;

const BoldText = styled(Text)`
  font-weight: bold;
`;

const Title = styled.span`
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
  searchPhrase: string,
  list: Contact[],
  onSave: (entry: Contact) => {}
};

const SearchableList = (props: Props) => {
  const { searchPhrase, list, title, onSave } = props;
  const filteredList = list.filter((listItem: Contact) => {
    const nicknameMatch = listItem.nickname && listItem.nickname.toLowerCase().includes(searchPhrase.toLowerCase());
    const addressMatch = listItem.publicWalletAddress && listItem.publicWalletAddress.toLowerCase().includes(searchPhrase.toLowerCase());
    const emailMatch = listItem.email && listItem.email.includes(searchPhrase);
    return nicknameMatch || addressMatch || emailMatch;
  });

  return (
    <Wrapper>
      <TitleWrapper>
        <Title>{title}</Title>
      </TitleWrapper>
      <ItemsContainer>
        {filteredList.map((listItem) => (
          <AddressRow key={`${listItem.nickname}_${listItem.publicWalletAddress}`}>
            <BoldText>
              {listItem.nickname || 'Unknown'}
              {!listItem.nickname && (
                <ActionLink onClick={() => onSave({ publicWalletAddress: listItem.publicWalletAddress, nickname: listItem.nickname, email: listItem.email })}>
                  Save to contacts
                </ActionLink>
              )}
            </BoldText>
            <Text>{listItem.publicWalletAddress}</Text>
          </AddressRow>
        ))}
      </ItemsContainer>
    </Wrapper>
  );
};

export default SearchableList;
