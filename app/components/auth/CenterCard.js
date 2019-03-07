// @flow
import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { smColors, smFonts } from '/vars';
import { SmButton, SmCarousel, SmInput } from '/basicComponents';
import { steam, smcCoin, onboardingLogo, miner, welcomeBack } from '/assets/images';
import Slide from './Slide';
import type { SlideProps } from './Slide';

export type WelcomeActions = {
  type: 'create' | 'login' | 'to login page' | 'next' | 'setup full node' | 'later' | 'restore',
  payload?: ?string
};

type Props = {
  page: 1 | 2 | 3 | 4,
  onPress: (action: WelcomeActions) => void
};

type State = {
  password: ?string,
  verifyPassword: ?string
};

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

const HeaderTextBase = styled.span`
  font-family: ${smFonts.fontNormal24.fontFamily};
  font-size: ${smFonts.fontNormal24.fontSize}px;
  font-weight: ${smFonts.fontNormal24.fontWeight};
  user-select: none;
`;

const HeaderText = styled(HeaderTextBase)`
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
  flex-direction: row;
  justify-content: center;
  width: 100%;
`;

// $FlowStyledIssue
const Image = styled.img`
  width: ${({ width }) => width || 82}px;
  height: ${({ height }) => height || 82}px;
`;

const GrayText = styled.span`
  font-family: ${smFonts.fontNormal16.fontFamily};
  font-size: ${smFonts.fontNormal16.fontSize}px;
  font-weight: ${smFonts.fontNormal16.fontWeight};
  color: ${smColors.black};
  text-align: left;
  color: ${smColors.textGray};
`;

const UpperPartHeader = styled(HeaderTextBase)`
  text-align: left;
  color: ${smColors.black};
`;

const StyledAction = css`
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.6;
  }
`;

const Link = styled(GrayText)`
  color: ${smColors.green};
  cursor: pointer;
  ${StyledAction}
`;

const SmallLink = styled.span`
  font-family: ${smFonts.fontNormal14.fontFamily};
  font-size: ${smFonts.fontNormal14.fontSize}px;
  font-weight: ${smFonts.fontNormal14.fontWeight};
  user-select: none;
  color: ${smColors.green};
  cursor: pointer;
  ${StyledAction}
`;

const LinksWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`;

class CenterCard extends Component<Props, State> {
  props: Props;

  state = {
    password: null,
    verifyPassword: null
  };

  render() {
    const { page } = this.props;
    return (
      <Wrapper>
        <Header>
          <Logo src={onboardingLogo} />
          <HeaderText>{`${page === 4 ? 'Welcome Back' : 'Welcome to Spacemesh'}`}</HeaderText>
        </Header>
        {this.renderCardBody(page)}
      </Wrapper>
    );
  }

  renderCardBody = (page: number) => {
    switch (page) {
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
    const { onPress } = this.props;
    return (
      <InnerWrapper>
        <SmCarousel disableAutoPlay>
          {carouselItems.map((item) => (
            <Slide key={item.id} {...item} />
          ))}
        </SmCarousel>
        <BottomPart>
          <SmButton title="Create Wallet" theme="orange" center onPress={() => onPress({ type: 'create' })} style={{ marginTop: 20 }} />
          <SmButton title="Login to Wallet" theme="green" center onPress={() => onPress({ type: 'to login page' })} style={{ marginTop: 20 }} />
        </BottomPart>
      </InnerWrapper>
    );
  };

  renderCard2 = () => {
    const { onPress } = this.props;
    const { password, verifyPassword } = this.state;
    const hasError = password !== verifyPassword || (!!password && password.length < 8);
    const canEncrypt = !!password && !hasError;

    return (
      <InnerWrapper>
        <UpperPart>
          <UpperPartHeader>Encrypt your Wallet</UpperPartHeader>
          <GrayText>Must be at least 8 characters</GrayText>
          <SmInput type="password" placeholder="Type password" hasError={hasError} onChange={this.handlePasswordTyping} />
          <SmInput type="password" placeholder="Verify password" hasError={hasError} onChange={this.handlePasswordVerifyTyping} />
          <GrayText>
            Your Wallet file is encrypted and saved on your computer. <Link>Show me the file</Link>
          </GrayText>
        </UpperPart>
        <BottomPart>
          <SmButton title="Next" disabled={!canEncrypt} theme="orange" onPress={() => onPress({ type: 'next', payload: password })} style={{ marginTop: 20 }} />
        </BottomPart>
      </InnerWrapper>
    );
  };

  renderCard3 = () => {
    const { onPress } = this.props;
    return (
      <InnerWrapper>
        <UpperPart>
          <UpperPartHeader>Setup a Spacemesh Full Node and start earning Spacemesh Coins?</UpperPartHeader>
          <ImageWrapper>
            <Image src={miner} width={104} height={74} />
          </ImageWrapper>
          <Link>Learn more about Spacemesh full nodes.</Link>
        </UpperPart>
        <BottomPart>
          <SmButton title="Yes, Setup Full Node" theme="orange" onPress={() => onPress({ type: 'setup full node' })} style={{ marginTop: 20 }} />
          <SmButton title="Maybe Later" theme="green" onPress={() => onPress({ type: 'later' })} style={{ marginTop: 20 }} />
        </BottomPart>
      </InnerWrapper>
    );
  };

  renderCard4 = () => {
    const { onPress } = this.props;
    const { password } = this.state;
    const hasError = !!password && password.length < 8;
    return (
      <InnerWrapper>
        <UpperPart>
          <ImageWrapper>
            <Image src={welcomeBack} width={76} height={92} />
          </ImageWrapper>
          <UpperPartHeader>Enter PIN to access wallet</UpperPartHeader>
          <SmInput type="password" placeholder="Type PIN" hasError={hasError} onChange={this.handlePasswordTyping} />
        </UpperPart>
        <BottomPart>
          <SmButton title="Login" disabled={!password || hasError} theme="orange" onPress={() => onPress({ type: 'login', payload: password })} style={{ marginTop: 20 }} />
          <LinksWrapper>
            <SmallLink onClick={() => onPress({ type: 'create' })}>Create a new wallet</SmallLink>
            <SmallLink onClick={() => onPress({ type: 'restore' })}>Restore wallet</SmallLink>
          </LinksWrapper>
        </BottomPart>
      </InnerWrapper>
    );
  };

  handlePasswordTyping = (e: any) => {
    if (e.target instanceof HTMLInputElement) {
      this.setState({ password: e.target.value });
    }
  };

  handlePasswordVerifyTyping = (e: any) => {
    if (e.target instanceof HTMLInputElement) {
      this.setState({ verifyPassword: e.target.value });
    }
  };
}

export default CenterCard;
