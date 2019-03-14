// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { smColors, authModes } from '/vars';
import { onboardingLogo } from '/assets/images';
import Welcome from './Welcome';
import CreateWallet from './CreateWallet';
import UnlockWallet from './UnlockWallet';

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
  mode: number,
  setCreationMode: Function,
  setUnlockMode: Function,
  navigateToLocalNodeSetup: Function,
  navigateToWallet: Function
};

class StepsContainer extends PureComponent<Props> {
  render() {
    const { mode } = this.props;
    const header = mode === authModes.UNLOCK ? 'Welcome Back' : 'Welcome to Spacemesh';
    return (
      <Wrapper>
        <Header>
          <Logo src={onboardingLogo} />
          <HeaderText>{header}</HeaderText>
        </Header>
        {this.renderMode(mode)}
      </Wrapper>
    );
  }

  renderMode = (mode: number) => {
    const { setCreationMode, setUnlockMode, navigateToWallet, navigateToLocalNodeSetup } = this.props;
    switch (mode) {
      case authModes.WELCOME:
        return <Welcome setCreationMode={setCreationMode} setUnlockMode={setUnlockMode} />;
      case authModes.UNLOCK:
        return <UnlockWallet setCreationMode={setCreationMode} navigateToWallet={navigateToWallet} />;
      case authModes.CREATE:
        return <CreateWallet navigateToWallet={navigateToWallet} navigateToLocalNodeSetup={navigateToLocalNodeSetup} />;
      default:
        return null;
    }
  };
}

export default StepsContainer;
