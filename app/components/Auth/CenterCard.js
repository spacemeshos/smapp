// @flow
import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { smColors, smFonts } from '/vars';
import SmButton from '/baseComponents/SmButton/Smbutton';
import SmCarousel from '/baseComponents/SmCarousel/SmCarousel';
import SmInput from '/baseComponents/SmInput/SmInput';
import { steam, smcCoin, onboardingLogo, miner, welcomeBack } from '/assets/images';

export type WelcomeActions = {
  type: 'create' | 'login' | 'to login page' | 'next' | 'setup full node' | 'later' | 'restore',
  payload?: ?string
};

type CarouselItemProps = {
  /* eslint react/no-unused-prop-types: off */
  id: number,
  source: any,
  text: string
};

type Props = {
  page: 1 | 2 | 3 | 4,
  onPress: (action: WelcomeActions) => void
};

type State = {
  password: ?string,
  verifyPassword: ?string
};

const HEADER_HEIGHT = 132;

const carouselItems: CarouselItemProps[] = [
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

const StyledAction = css`
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.6;
  }
`;

const StyledHeaderTextBase = styled.span`
  font-family: ${smFonts.fontNormal24.fontFamily};
  font-size: ${smFonts.fontNormal24.fontSize}px;
  font-weight: ${smFonts.fontNormal24.fontWeight};
  user-select: none;
`;

const StyledCardRoot = styled.div`
  width: 100%;
  height: 100%;
  opacity: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const StyledCard = styled.div`
  background-color: ${smColors.white};
  height: 600px;
  width: 400px;
  display: flex;
  flex-direction: column;
  align-self: center;
  position: relative;
  box-shadow: 0 3px 6px rgba(${smColors.blackRgb}, 0.16);
`;

const StyledHeader = styled.div`
  min-height: ${HEADER_HEIGHT}px;
  height: ${HEADER_HEIGHT}px;
  background-color: ${smColors.green};
  padding-left: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const StyledLogo = styled.img`
  width: 136px;
  height: 24px;
`;

const StyledBody = styled.div`
  max-height: calc(100% - ${HEADER_HEIGHT}px);
  height: calc(100% - ${HEADER_HEIGHT}px);
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: space-between;
  padding: 30px;
`;

const StyledHeaderText = styled(StyledHeaderTextBase)`
  color: ${smColors.white};
`;

const StyledButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledButtonWrapper = styled.div`
  margin-top: 20px;
`;

const StyledCBodyContent = styled.div`
  height: inherit;
  width: inherit;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const StyledCarouselItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;
  height: 100%;
`;

const StyledBodyLogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
`;

// $FlowStyledIssue
const StyledBodyLogo = styled.img`
  width: ${({ width }) => width || 82}px;
  height: ${({ height }) => height || 82}px;
`;

const StyledBodyTextWrapper = styled.div``;

const StyledEncryptTextWrapper = styled.div`
  text-align: left;
`;

const StyledBodyTextBase = styled.span`
  font-family: ${smFonts.fontNormal16.fontFamily};
  font-size: ${smFonts.fontNormal16.fontSize}px;
  font-weight: ${smFonts.fontNormal16.fontWeight};
  color: ${smColors.black};
  user-select: none;
`;

const StyledBodyText = styled(StyledBodyTextBase)`
  color: ${smColors.black};
`;

const StyledBodyTextEncrypt = styled(StyledBodyTextBase)`
  color: ${smColors.textGray};
`;

const StyledSubHeaderText = styled(StyledHeaderTextBase)`
  color: ${smColors.black};
`;

const StyledLink = styled(StyledBodyTextEncrypt)`
  color: ${smColors.green};
  cursor: pointer;
  ${StyledAction}
`;

const StyledSmallLink = styled.span`
  font-family: ${smFonts.fontNormal14.fontFamily};
  font-size: ${smFonts.fontNormal14.fontSize}px;
  font-weight: ${smFonts.fontNormal14.fontWeight};
  user-select: none;
  color: ${smColors.green};
  cursor: pointer;
  ${StyledAction}
`;

const StyledLinksWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const CarouselItem = (props: CarouselItemProps) => {
  const { source, text } = props;
  return (
    <StyledCarouselItem>
      <StyledBodyLogoWrapper>
        <StyledBodyLogo src={source} />
      </StyledBodyLogoWrapper>
      <StyledBodyTextWrapper>
        <StyledBodyText>{text}</StyledBodyText>
      </StyledBodyTextWrapper>
    </StyledCarouselItem>
  );
};

class CenterCard extends Component<Props, State> {
  props: Props;

  state = {
    password: null,
    verifyPassword: null
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

  render() {
    const { page } = this.props;
    return (
      <StyledCardRoot>
        <StyledCard>
          <StyledHeader>
            <StyledLogo src={onboardingLogo} />
            <StyledHeaderText>{`${page === 4 ? 'Welcome Back' : 'Welome to Spacemesh'}`}</StyledHeaderText>
          </StyledHeader>
          {this.renderCardBody(page)}
        </StyledCard>
      </StyledCardRoot>
    );
  }

  renderPage1 = () => {
    const { onPress } = this.props;
    return (
      <StyledBody>
        <StyledCBodyContent>
          <SmCarousel>
            {carouselItems.map((item) => (
              <CarouselItem key={item.id} {...item} />
            ))}
          </SmCarousel>
        </StyledCBodyContent>
        <StyledButtonsContainer>
          <StyledButtonWrapper>
            <SmButton title="Create Wallet" theme="orange" onPress={() => onPress({ type: 'create' })} />
          </StyledButtonWrapper>
          <StyledButtonWrapper>
            <SmButton title="Login to Wallet" theme="green" onPress={() => onPress({ type: 'to login page' })} />
          </StyledButtonWrapper>
        </StyledButtonsContainer>
      </StyledBody>
    );
  };

  renderPage2 = () => {
    const { onPress } = this.props;
    const { password, verifyPassword } = this.state;
    const hasError = password !== verifyPassword || (!!password && password.length < 8);
    const canEncrypt = !!password && !hasError;

    return (
      <StyledBody>
        <StyledCBodyContent>
          <StyledCarouselItem>
            <StyledEncryptTextWrapper>
              <StyledSubHeaderText>Encrypt your Wallet</StyledSubHeaderText>
            </StyledEncryptTextWrapper>
            <StyledEncryptTextWrapper>
              <StyledBodyTextEncrypt>Must be at least 8 characters</StyledBodyTextEncrypt>
            </StyledEncryptTextWrapper>
            <SmInput type="password" placeholder="Type password" hasError={hasError} onChange={this.handlePasswordTyping} />
            <SmInput type="password" placeholder="Verify password" hasError={hasError} onChange={this.handlePasswordVerifyTyping} />
            <StyledEncryptTextWrapper>
              <StyledBodyTextEncrypt>
                Your Wallet file is encrypted and saved on your computer. <StyledLink>Show me the file</StyledLink>
              </StyledBodyTextEncrypt>
            </StyledEncryptTextWrapper>
          </StyledCarouselItem>
        </StyledCBodyContent>
        <StyledButtonsContainer>
          <StyledButtonWrapper>
            <SmButton title="Next" disabled={!canEncrypt} theme="orange" onPress={() => onPress({ type: 'next', payload: password })} />
          </StyledButtonWrapper>
        </StyledButtonsContainer>
      </StyledBody>
    );
  };

  renderPage3 = () => {
    const { onPress } = this.props;
    return (
      <StyledBody>
        <StyledCBodyContent>
          <StyledCarouselItem>
            <StyledBodyTextWrapper>
              <StyledSubHeaderText>Setup a Spacemesh Full Node and start earning Spacemesh Coins?</StyledSubHeaderText>
            </StyledBodyTextWrapper>
            <StyledBodyLogoWrapper>
              <StyledBodyLogo src={miner} width={104} height={74} />
            </StyledBodyLogoWrapper>
            <StyledLink>Learn more about Spacemesh full nodes.</StyledLink>
          </StyledCarouselItem>
        </StyledCBodyContent>
        <StyledButtonsContainer>
          <StyledButtonWrapper>
            <SmButton title="Yes, Setup Full Node" theme="orange" onPress={() => onPress({ type: 'setup full node' })} />
          </StyledButtonWrapper>
          <StyledButtonWrapper>
            <SmButton title="Maybe Later" theme="green" onPress={() => onPress({ type: 'later' })} />
          </StyledButtonWrapper>
        </StyledButtonsContainer>
      </StyledBody>
    );
  };

  renderPage4 = () => {
    const { onPress } = this.props;
    const { password } = this.state;
    const hasError = !!password && password.length < 8;
    return (
      <StyledBody>
        <StyledCBodyContent>
          <StyledCarouselItem>
            <StyledBodyLogoWrapper>
              <StyledBodyLogo src={welcomeBack} width={76} height={92} />
            </StyledBodyLogoWrapper>
            <StyledBodyTextWrapper>
              <StyledSubHeaderText>Enter PIN to access wallet</StyledSubHeaderText>
            </StyledBodyTextWrapper>
            <SmInput type="password" placeholder="Type PIN" hasError={hasError} onChange={this.handlePasswordTyping} />
          </StyledCarouselItem>
        </StyledCBodyContent>
        <StyledButtonsContainer>
          <StyledButtonWrapper>
            <SmButton title="Login" disabled={!password || hasError} theme="orange" onPress={() => onPress({ type: 'login', payload: password })} />
          </StyledButtonWrapper>
          <StyledButtonWrapper>
            <StyledLinksWrapper>
              <StyledSmallLink onClick={() => onPress({ type: 'create' })}>Create a new wallet</StyledSmallLink>
              <StyledSmallLink onClick={() => onPress({ type: 'restore' })}>Restore wallet</StyledSmallLink>
            </StyledLinksWrapper>
          </StyledButtonWrapper>
        </StyledButtonsContainer>
      </StyledBody>
    );
  };

  renderCardBody = (page: number) => {
    switch (page) {
      case 1:
        return this.renderPage1();
      case 2:
        return this.renderPage2();
      case 3:
        return this.renderPage3();
      case 4:
        return this.renderPage4();
      default:
        return null;
    }
  };
}

export default CenterCard;
