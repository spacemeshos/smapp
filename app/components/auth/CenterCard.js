// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';
import { onboardingLogo } from '/assets/images';
import InitialCard from './InitialCard';
import CreateWallet from './CreateWallet';
import DecryptWalletCard from './DecryptWalletCard';

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

type Props = {
  step: number,
  setCreationMode: Function,
  setLoginMode: Function,
  navigateToLocalNodeSetup: Function,
  navigateToWallet: Function
};

class CenterCard extends PureComponent<Props> {
  render() {
    const { step } = this.props;
    return (
      <Wrapper>
        <Header>
          <Logo src={onboardingLogo} />
          <HeaderText>{`${step === 3 ? 'Welcome Back' : 'Welcome to Spacemesh'}`}</HeaderText>
        </Header>
        {this.renderCardBody(step)}
      </Wrapper>
    );
  }

  renderCardBody = (step: number) => {
    const { setCreationMode, setLoginMode, navigateToWallet, navigateToLocalNodeSetup } = this.props;
    switch (step) {
      case 1:
        return <InitialCard setCreationMode={setCreationMode} setLoginMode={setLoginMode} />;
      case 2:
        return <CreateWallet navigateToWallet={navigateToWallet} navigateToLocalNodeSetup={navigateToLocalNodeSetup} />;
      case 3:
        return <DecryptWalletCard setCreationMode={setCreationMode} navigateToWallet={navigateToWallet} />;
      default:
        return null;
    }
  };
}

export default CenterCard;
