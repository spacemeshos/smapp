import React, { PureComponent } from 'react';
import styled from 'styled-components';
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

const Wrapper = styled.div`
  min-width: 350px;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 30px;
  border: 1px solid ${smColors.borderGray};
`;

const ImageWrapper = styled.div`
  width: 100%;
  max-height: 270px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 50px;
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const Header = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: ${smColors.darkGray};
  line-height: 19px;
  margin-bottom: 35px;
`;

const SettingModeListItem = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 30px;
`;

const ItemImageWrapper = styled.div`
  width: 45px;
  height: 45px;
  display: flex;
  flex: 0 0 45px;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
`;

const ItemText = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${smColors.lighterBlack};
`;

const Text = styled.div`
  font-size: 16px;
  line-height: 28px;
  color: ${smColors.lighterBlack};
  margin-bottom: 35px;
`;

const ActionLink = styled.div`
  font-size: 16px;
  line-height: 30px;
  color: ${smColors.darkGreen};
  cursor: pointer;
  margin-bottom: 15px;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.6;
  }
`;

type Props = {
  mode: number
};

class RightPane extends PureComponent<Props> {
  render() {
    const { mode } = this.props;
    return (
      <Wrapper>
        {this.renderTopImage(mode)}
        <Header>{this.getHeaderText(mode)}</Header>
        {this.renderCenterContent(mode)}
        {this.generateLinks().map((setupLink) => (
          <ActionLink key={setupLink.text} onClick={setupLink.onClick}>
            {setupLink.text}
          </ActionLink>
        ))}
      </Wrapper>
    );
  }

  renderTopImage = (mode: number) => {
    switch (mode) {
      case localNodeModes.PROGRESS: {
        return (
          <ImageWrapper>
            <Image src={thinking} />
          </ImageWrapper>
        );
      }
      case localNodeModes.OVERVIEW: {
        return (
          <ImageWrapper>
            <Image src={miner} />
          </ImageWrapper>
        );
      }
      default:
        return null;
    }
  };

  renderSetupItems = () =>
    items.map((setupListItem) => (
      <SettingModeListItem key={setupListItem.text}>
        <ItemImageWrapper>
          <Image src={setupListItem.iconSrc} />
        </ItemImageWrapper>
        <ItemText>{setupListItem.text}</ItemText>
      </SettingModeListItem>
    ));

  renderCenterContent = (mode: number) => {
    switch (mode) {
      case localNodeModes.SETUP:
        return this.renderSetupItems();
      case localNodeModes.PROGRESS: {
        return <Text>Full node setup may take up to 48 hours. you can leave it running and continue using your device as usual, just don&#96;t turn it off.</Text>;
      }
      case localNodeModes.OVERVIEW: {
        return <Text>To run Spacemesh p2p network and get awarded for your contribution, you need to keep your computer running 24/7.</Text>;
      }
      default:
        return null;
    }
  };

  getHeaderText = (mode: number): string => {
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

  navigateToExplanation = () => {};

  changeLocalNodeRewardAddress = () => {};

  showComputationEffort = () => {};

  changeLocalNodeSettings = () => {};

  generateLinks = () => {
    const { mode } = this.props;
    const links = [
      { text: 'Learn more about Spacemesh Local Node', onClick: this.navigateToExplanation },
      { text: 'Show computation effort', onClick: this.showComputationEffort }
    ];
    if (mode === localNodeModes.SETUP) {
      links.push({ text: 'Change your awards Local Node address', onCLick: this.changeLocalNodeRewardAddress });
    } else if (mode === localNodeModes.OVERVIEW) {
      links.push({ text: 'Change Local Node Settings', onCLick: this.changeLocalNodeSettings });
    }
    return links;
  };
}

export default RightPane;
