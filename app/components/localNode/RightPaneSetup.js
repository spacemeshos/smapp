import React from 'react';
import styled from 'styled-components';
import { RightHeaderText, BaseImage, RightPaneInner, ActionLink, ItemTextWrapper, LinkTextWrapper, ItemText } from './LocalNodeCommonComponents';

type Props = {
  itemsList: {
    id: number,
    iconSrc: any,
    text: string
  }[],
  linksList: {
    id: string,
    text: string
  },
  handleLinkClick: Function
};

const SettingModeListItem = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex: 1;
  min-width: 260px;
`;

const ItemImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: 12px;
`;

const RightPaneSetup = (props: Props) => {
  const { itemsList, linksList, handleLinkClick } = props;
  return (
    <RightPaneInner>
      <RightHeaderText>Local Node Setup Instructions</RightHeaderText>
      {itemsList.map((setupListItem) => (
        <SettingModeListItem key={setupListItem.id}>
          <ItemImageWrapper>
            <BaseImage src={setupListItem.iconSrc} width={42} height={42} />
          </ItemImageWrapper>
          <ItemTextWrapper>
            <ItemText>{setupListItem.text}</ItemText>
          </ItemTextWrapper>
        </SettingModeListItem>
      ))}
      {linksList.map((setupLink) => (
        <LinkTextWrapper key={setupLink.id} onClick={() => handleLinkClick(setupLink.id)}>
          <ActionLink>{setupLink.text}</ActionLink>
        </LinkTextWrapper>
      ))}
    </RightPaneInner>
  );
};

export default RightPaneSetup;
