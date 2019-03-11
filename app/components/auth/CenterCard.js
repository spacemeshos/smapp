// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';
import { SmButton, SmCarousel } from '/basicComponents';
import { steam, smcCoin, onboardingLogo, miner } from '/assets/images';
import Slide from './Slide';
import type { SlideProps } from './Slide';
import EncryptWalletCard from './EncryptWalletCard';
import DecryptWalletCard from './DecryptWalletCard';

const carouselItems: SlideProps[] = [
  {
    id: 1,
    text: 'Setup a full node on your computer and stard earning spacemesh coins',
    source: smcCoin
  },
  {
    id: 2,
    text: 'Spacemesh Coins can be used to purchase Steam games and Steam game items',
    source: steam
  },
  {
    id: 3,
    text: 'Use your wallet to send and receive Spacemesh Coins',
    source: smcCoin
  },
  {
    id: 4,
    text: 'Your wallet can hold multiple accounts',
    source: smcCoin
  }
];

const Wrapper = styled.div`
  background-color: ${smColors.white};
  height: 600px;
  width: 400px;
  display: flex;
  flex-direction: column;
  align-self: center;
  position: relative;
  box-shadow: 0 3px 6px ${smColors.black20alpha};
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 130px;
  background-color: ${smColors.green};
  padding: 25px 30px;
`;

const Logo = styled.img`
  width: 136px;
  height: 24px;
`;

const HeaderText = styled.span`
  font-size: 24px;
  color: ${smColors.white};
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  padding: 30px;
`;

const UpperPart = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

const BottomPart = styled.div`
  display: flex;
  flex-direction: column;
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const UpperPartHeader = styled.span`
  font-size: 24px;
  text-align: left;
  color: ${smColors.black};
`;

const Link = styled.span`
  font-size: 16px;
  text-align: left;
  color: ${smColors.green};
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.6;
  }
`;

type Props = {
  step: number,
  setCreationMode: Function,
  setLoginMode: Function,
  proceedToStep3: Function,
  navigateToFullNodeSetup: Function,
  navigateToWallet: Function
};

class CenterCard extends PureComponent<Props> {
  render() {
    const { step } = this.props;
    return (
      <Wrapper>
        <Header>
          <Logo src={onboardingLogo} />
          <HeaderText>{`${step === 4 ? 'Welcome Back' : 'Welcome to Spacemesh'}`}</HeaderText>
        </Header>
        {this.renderCardBody(step)}
      </Wrapper>
    );
  }

  renderCardBody = (step: number) => {
    switch (step) {
      case 1:
        return this.renderCard1();
      case 2:
        return this.renderCard2();
      case 3:
        return this.renderCard3();
      case 4:
        return this.renderCard4();
      default:
        return null;
    }
  };

  renderCard1 = () => {
    const { setCreationMode, setLoginMode } = this.props;
    return (
      <InnerWrapper>
        <SmCarousel disableAutoPlay>
          {carouselItems.map((item) => (
            <Slide key={item.id} {...item} />
          ))}
        </SmCarousel>
        <BottomPart>
          <SmButton text="Create Wallet" theme="orange" center onPress={setCreationMode} style={{ marginTop: 20 }} />
          <SmButton text="Login to Wallet" theme="green" center onPress={setLoginMode} style={{ marginTop: 20 }} />
        </BottomPart>
      </InnerWrapper>
    );
  };

  renderCard2 = () => {
    const { proceedToStep3 } = this.props;
    return <EncryptWalletCard proceedToStep3={proceedToStep3} />;
  };

  renderCard3 = () => {
    const { navigateToFullNodeSetup, navigateToWallet } = this.props;
    return (
      <InnerWrapper>
        <UpperPart>
          <UpperPartHeader>Setup a Spacemesh Full Node and start earning Spacemesh Coins?</UpperPartHeader>
          <ImageWrapper>
            <Image src={miner} />
          </ImageWrapper>
          <Link>Learn more about Spacemesh full nodes.</Link>
        </UpperPart>
        <BottomPart>
          <SmButton text="Yes, Setup Full Node" theme="orange" onPress={navigateToFullNodeSetup} style={{ marginTop: 20 }} />
          <SmButton text="Maybe Later" theme="green" onPress={navigateToWallet} style={{ marginTop: 20 }} />
        </BottomPart>
      </InnerWrapper>
    );
  };

  renderCard4 = () => {
    const { setCreationMode, navigateToWallet } = this.props;
    return <DecryptWalletCard setCreationMode={setCreationMode} navigateToWallet={navigateToWallet} />;
  };
}

export default CenterCard;
