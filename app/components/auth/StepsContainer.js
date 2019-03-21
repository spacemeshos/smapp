// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { smColors, authModes } from '/vars';
import { onboardingLogo, xWhite } from '/assets/images';
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

const TopRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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

const XIcon = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
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

type State = {
  isCloseBtnVisible: boolean
};

class StepsContainer extends Component<Props, State> {
  state = {
    isCloseBtnVisible: true
  };

  render() {
    const { mode, navigateToLocalNodeSetup } = this.props;
    const { isCloseBtnVisible } = this.state;
    const header = mode === authModes.UNLOCK ? 'Welcome Back' : 'Welcome to Spacemesh';

    return (
      <Wrapper>
        <Header>
          <TopRowContainer>
            <Logo src={onboardingLogo} />
            {isCloseBtnVisible && <XIcon onClick={navigateToLocalNodeSetup} src={xWhite} />}
          </TopRowContainer>
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
        return <CreateWallet onSubModeChange={this.handleCloseButtonVisibility} navigateToWallet={navigateToWallet} navigateToLocalNodeSetup={navigateToLocalNodeSetup} />;
      default:
        return null;
    }
  };

  handleCloseButtonVisibility = (subMode: 1 | 2) => {
    this.setState({ isCloseBtnVisible: subMode === 1 });
  };
}

export default StepsContainer;
