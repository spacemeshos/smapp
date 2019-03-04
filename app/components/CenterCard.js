// @flow
import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { smColors, smFonts } from '/vars';
import SmButton from '../baseComponents/SmButton/Smbutton';
import SmCarousel from '../baseComponents/SmCarousel/SmCarousel';
import SmInput from '../baseComponents/SmInput/SmInput';
import { steam, smcCoin, onboardingLogo } from '/assets/images';

export type WelcomeActions = {
  type: 'create' | 'restore' | 'next' | 'setup full node' | 'later',
  payload?: ?string
};

type Props = {
  page: 1 | 2 | 3,
  onPress: (action: WelcomeActions) => void
};

type State = {
  password: ?string,
  verifyPassword: ?string
};

const HEADER_HEIGHT = 132;

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
  justify-content: flex-end;
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
`;

const StyledCarouselItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 100%;
  height: 100%;
  margin;: 30px;
`;

const StyledBodyLogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
`;

const StyledBodyLogo = styled.img`
  width: 82px;
  height: 82px;
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

class CenterCard extends Component<Props, State> {
  props: Props;

  state = {
    password: undefined,
    verifyPassword: undefined
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
            <StyledHeaderText>Welcome to Spacemesh</StyledHeaderText>
          </StyledHeader>
          {this.renderCardBody(page)}
        </StyledCard>
      </StyledCardRoot>
    );
  }

  renderCardBody = (page: number) => {
    const { onPress } = this.props;
    const { password, verifyPassword } = this.state;
    const canEncrypt = !!password && password === verifyPassword;
    const hasError = password !== verifyPassword || (!!password && password.length < 8);

    switch (page) {
      case 1:
        return (
          <StyledBody>
            <StyledCBodyContent>
              <SmCarousel>
                <StyledCarouselItem>
                  <StyledBodyLogoWrapper>
                    <StyledBodyLogo src={smcCoin} />
                  </StyledBodyLogoWrapper>
                  <StyledBodyTextWrapper>
                    <StyledBodyText>Setup a full node on your computer and stard earning spacemesh coins</StyledBodyText>
                  </StyledBodyTextWrapper>
                </StyledCarouselItem>
                <StyledCarouselItem>
                  <StyledBodyLogoWrapper>
                    <StyledBodyLogo src={steam} />
                  </StyledBodyLogoWrapper>
                  <StyledBodyTextWrapper>
                    <StyledBodyText>Spacemesh Coins can be used to purchase Steam games and Steam game items</StyledBodyText>
                  </StyledBodyTextWrapper>
                </StyledCarouselItem>
                <StyledCarouselItem>
                  <StyledBodyLogoWrapper>
                    <StyledBodyLogo src={smcCoin} />
                  </StyledBodyLogoWrapper>
                  <StyledBodyTextWrapper>
                    <StyledBodyText>Use your wallet to send and receive Spacemesh Coins</StyledBodyText>
                  </StyledBodyTextWrapper>
                </StyledCarouselItem>
                <StyledCarouselItem>
                  <StyledBodyLogoWrapper>
                    <StyledBodyLogo src={smcCoin} />
                  </StyledBodyLogoWrapper>
                  <StyledBodyTextWrapper>
                    <StyledBodyText>Your wallet can hold multiple accounts</StyledBodyText>
                  </StyledBodyTextWrapper>
                </StyledCarouselItem>
              </SmCarousel>
            </StyledCBodyContent>
            <StyledButtonsContainer>
              <StyledButtonWrapper>
                <SmButton title="Create Wallet" theme="orange" onPress={() => onPress({ type: 'create' })} />
              </StyledButtonWrapper>
              <StyledButtonWrapper>
                <SmButton title="Restore Wallet" theme="green" onPress={() => onPress({ type: 'restore' })} />
              </StyledButtonWrapper>
            </StyledButtonsContainer>
          </StyledBody>
        );
      case 2:
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
      case 3:
        return (
          <StyledBody>
            <StyledCBodyContent>
              <StyledCarouselItem>
                <StyledBodyTextWrapper>
                  <StyledSubHeaderText>Test</StyledSubHeaderText>
                </StyledBodyTextWrapper>
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
      default:
        return null;
    }
  };
}

export default CenterCard;
