import React from 'react';
import styled, { css } from 'styled-components';
import { time, coin, noLaptop, miner, thinking } from '/assets/images';
import { smColors } from '/vars';

const navigateToExplanation = () => {};

const changeLocalNodeRewardAddress = () => {};

const showComputationEffort = () => {};

const changeLocalNodeSettings = () => {};

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

const progressLinks = [
  {
    text: 'Learn more about Spacemesh Local Node',
    onClick: navigateToExplanation
  },
  {
    text: 'Show computer effort',
    onClick: showComputationEffort
  }
];

const setupLinks = [
  ...progressLinks,
  {
    text: 'Change your awards Local Node address',
    onCLick: changeLocalNodeRewardAddress
  }
];

const overviewLinks = [
  ...progressLinks,
  {
    text: 'Change Local Node Settings',
    onCLick: changeLocalNodeSettings
  }
];

const links = {
  setup: setupLinks,
  progress: progressLinks,
  overview: overviewLinks
};

const getHeader = (mode: Mode): string => {
  switch (mode) {
    case 'setup':
      return 'Full Node Setup instructions';
    case 'progress':
      return 'Full Node Setup information';
    case 'overview':
      return 'Spacemesh Tips and Information';
    default:
      return '';
  }
};

export const BaseText = styled.span`
  font-size: 16px;
  font-weight: normal;
`;

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

const Actionable = css`
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.6;
  }
`;

// $FlowStyledIssue
export const BaseImage = styled.img`
  height: ${({ height }) => (height ? `${height}px` : '100%')};
  width: ${({ width }) => (width ? `${width}px` : '100%')};
`;

// $FlowStyledIssue
export const ImageWrapper = styled.div`
  ${({ maxHeight }) =>
    maxHeight &&
    `
  max-height: ${maxHeight}px;

  `}
  ${({ maxWidth }) =>
    maxWidth &&
    `
  max-width: ${maxWidth}px;

  `}
  display: flex;
  flex-direction: row;
  align-self: center;
  flex: 1;
  padding: 12px;
`;

export const ItemTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
`;

export const RightPaneInner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

export const RightHeaderText = styled.span`
  font-size: 14px;
  font-weight: bold;
  padding: 0 12px 12px 12px;
`;

export const ItemText = styled(BaseText)`
  color: ${smColors.black};
`;

export const LinkTextWrapper = styled.div`
  padding: 10px;
`;

export const ActionLink = styled(BaseText)`
  user-select: none;
  color: ${smColors.green};
  cursor: pointer;
  ${Actionable}
`;

type Mode = 'setup' | 'progress' | 'overview';

type Props = {
  mode: Mode
};

const renderSetupItems = () => (
  <React.Fragment>
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
  </React.Fragment>
);

const renderTopImage = (mode: Mode) => {
  switch (mode) {
    case 'progress':
      return (
        <ImageWrapper maxHeight={264}>
          <BaseImage src={thinking} />
        </ImageWrapper>
      );
    case 'overview':
      return (
        <ImageWrapper maxHeight={270}>
          <BaseImage src={miner} />
        </ImageWrapper>
      );
    default:
      return null;
  }
};

const renderCenterContent = (mode: Mode) => {
  switch (mode) {
    case 'setup':
      return renderSetupItems();
    case 'progress': {
      const progressCenterText = "Full node setup may take up to 48 hours. you can leave it running and continue using your device as usual, just don't turn it off.";
      return <BaseText>{progressCenterText}</BaseText>;
    }
    case 'overview': {
      const overviewCenterText = 'To run Spacemesh p2p network and get awarded for your contribution, you need to keep your computer running 24/7.';
      return <BaseText>{overviewCenterText}</BaseText>;
    }
    default:
      return null;
  }
};

const RightPane = (props: Props) => {
  const { mode } = props;
  return (
    <RightPaneInner>
      {renderTopImage(mode)}
      <RightHeaderText>{getHeader(mode)}</RightHeaderText>
      {renderCenterContent(mode)}
      {links[mode].map((setupLink) => (
        <LinkTextWrapper key={setupLink.text} onClick={setupLink.onClick}>
          <ActionLink>{setupLink.text}</ActionLink>
        </LinkTextWrapper>
      ))}
    </RightPaneInner>
  );
};

export default RightPane;
