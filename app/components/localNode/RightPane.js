import React, { PureComponent } from 'react';
import styled, { css } from 'styled-components';
import { time, coin, noLaptop, miner, thinking } from '/assets/images';
import { smColors, localNodeModes } from '/vars';

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

const getHeader = (mode: number): string => {
  switch (mode) {
    case localNodeModes.SETUP:
      return 'Full Node Setup instructions';
    case localNodeModes.PROGRESS:
      return 'Full Node Setup information';
    case localNodeModes.OVERVIEW:
      return 'Spacemesh Tips and Information';
    default:
      return '';
  }
};

const BaseText = styled.span`
  font-size: 16px;
  font-weight: normal;
  line-height: 22px;
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
const BaseImage = styled.img`
  height: ${({ height }) => (height ? `${height}px` : '100%')};
  width: ${({ width }) => (width ? `${width}px` : '100%')};
`;

// $FlowStyledIssue
const ImageWrapper = styled.div`
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

const ItemTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
`;

const RightPaneInner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  flex: 1;
  padding: 30px;
  border: 1px solid ${smColors.borderGray};
  min-width: 388px;
`;

const RightHeaderText = styled.span`
  font-size: 14px;
  font-weight: bold;
  padding: 0 12px 12px 12px;
  line-height: 22px;
`;

const ItemText = styled(BaseText)`
  color: ${smColors.black};
`;

const LinkTextWrapper = styled.div`
  padding: 10px;
`;

const ActionLink = styled(BaseText)`
  user-select: none;
  color: ${smColors.green};
  cursor: pointer;
  ${Actionable}
`;

const LinksWrapper = styled.div`
  max-height: 126px;
`;

type Props = {
  mode: number
};

class RightPane extends PureComponent<Props> {
  render() {
    const { mode } = this.props;
    return (
      <RightPaneInner>
        {this.renderTopImage(mode)}
        <RightHeaderText>{getHeader(mode)}</RightHeaderText>
        {this.renderCenterContent(mode)}
        <LinksWrapper>
          {this.generateLinks(mode).map((setupLink) => (
            <LinkTextWrapper key={setupLink.text} onClick={setupLink.onClick}>
              <ActionLink>{setupLink.text}</ActionLink>
            </LinkTextWrapper>
          ))}
        </LinksWrapper>
      </RightPaneInner>
    );
  }

  renderTopImage = (mode: number) => {
    switch (mode) {
      case localNodeModes.PROGRESS:
        return (
          <ImageWrapper maxHeight={264}>
            <BaseImage src={thinking} />
          </ImageWrapper>
        );
      case localNodeModes.OVERVIEW:
        return (
          <ImageWrapper maxHeight={270}>
            <BaseImage src={miner} />
          </ImageWrapper>
        );
      default:
        return null;
    }
  };

  renderSetupItems = () =>
    items.map((setupListItem) => (
      <SettingModeListItem key={setupListItem.text}>
        <ItemImageWrapper>
          <BaseImage src={setupListItem.iconSrc} width={42} height={42} />
        </ItemImageWrapper>
        <ItemTextWrapper>
          <ItemText>{setupListItem.text}</ItemText>
        </ItemTextWrapper>
      </SettingModeListItem>
    ));

  renderCenterContent = (mode: number) => {
    switch (mode) {
      case localNodeModes.SETUP:
        return this.renderSetupItems();
      case localNodeModes.PROGRESS: {
        const progressCenterText = "Full node setup may take up to 48 hours. you can leave it running and continue using your device as usual, just don't turn it off.";
        return <BaseText>{progressCenterText}</BaseText>;
      }
      case localNodeModes.OVERVIEW: {
        const overviewCenterText = 'To run Spacemesh p2p network and get awarded for your contribution, you need to keep your computer running 24/7.';
        return <BaseText>{overviewCenterText}</BaseText>;
      }
      default:
        return null;
    }
  };

  navigateToExplanation = () => {};

  changeLocalNodeRewardAddress = () => {};

  showComputationEffort = () => {};

  changeLocalNodeSettings = () => {};

  generateLinks = (mode: number) => {
    switch (mode) {
      case localNodeModes.SETUP:
        return [
          {
            text: 'Learn more about Spacemesh Local Node',
            onClick: this.navigateToExplanation
          },
          {
            text: 'Show computer effort',
            onClick: this.showComputationEffort
          },
          {
            text: 'Change your awards Local Node address',
            onCLick: this.changeLocalNodeRewardAddress
          }
        ];
      case localNodeModes.PROGRESS: {
        return [
          {
            text: 'Learn more about Spacemesh Local Node',
            onClick: this.navigateToExplanation
          },
          {
            text: 'Show computer effort',
            onClick: this.showComputationEffort
          }
        ];
      }
      case localNodeModes.OVERVIEW: {
        return [
          {
            text: 'Learn more about Spacemesh Local Node',
            onClick: this.navigateToExplanation
          },
          {
            text: 'Show computer effort',
            onClick: this.showComputationEffort
          },
          {
            text: 'Change Local Node Settings',
            onCLick: this.changeLocalNodeSettings
          }
        ];
      }
      default:
        return [];
    }
  };
}

export default RightPane;
