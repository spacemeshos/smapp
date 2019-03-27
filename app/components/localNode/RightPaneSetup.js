import React from 'react';
import styled from 'styled-components';
import { RightHeaderText, BaseImage, RightPaneInner, ActionLink, ItemTextWrapper, LinkTextWrapper, ItemText } from './LocalNodeCommonComponents';
import { time, coin, noLaptop } from '/assets/images';

const items = [
  {
    iconSrc: coin,
    text: 'Join the Spacemesh p2p network and get awarded'
  },
  {
    iconSrc: time,
    text: 'Leave your desktop computer on 24/7'
  },
  {
    iconSrc: noLaptop,
    text: 'Do not use a laptop. Only desktop'
  },
  {
    iconSrc: time,
    text: 'On the Spacemesh network, storage replaces "Proof of Work"'
  }
];

type Props = {
  links: {
    text: string,
    onClick: () => void
  }
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
  margin-right: 20px;
`;

const RightPaneSetup = (props: Props) => {
  const { links } = props;
  return (
    <RightPaneInner>
      <RightHeaderText>Local Node Setup Instructions</RightHeaderText>
      {items.map((setupListItem) => (
        <SettingModeListItem key={setupListItem.text}>
          <ItemImageWrapper>
            <BaseImage src={setupListItem.iconSrc} width={42} height={42} />
          </ItemImageWrapper>
          <ItemTextWrapper>
            <ItemText>{setupListItem.text}</ItemText>
          </ItemTextWrapper>
        </SettingModeListItem>
      ))}
      {links.map((setupLink) => (
        <LinkTextWrapper key={setupLink.label} onClick={setupLink.onClick}>
          <ActionLink>{setupLink.text}</ActionLink>
        </LinkTextWrapper>
      ))}
    </RightPaneInner>
  );
};

export default RightPaneSetup;
