// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { smColors, authModes } from '/vars';
import { smLogoWhite, xWhite } from '/assets/images';
import Welcome from './Welcome';
import CreateWallet from './CreateWallet';
import UnlockWallet from './UnlockWallet';
import RestoreWallet from './RestoreWallet';

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
  line-height: 33px;
`;

type Props = {
  mode: number,
  setCreationMode: () => void,
  setUnlockMode: () => void,
  setRestoreMode: () => void,
  navigateToLocalNodeSetup: () => void,
  navigateToWallet: () => void,
  toggleRestoreWith12Words: () => void
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
    return (
      <Wrapper>
        <Header>
          <TopRowContainer>
            <Logo src={smLogoWhite} />
            {isCloseBtnVisible && <XIcon onClick={navigateToLocalNodeSetup} src={xWhite} />}
          </TopRowContainer>
          <HeaderText>{this.getHeaderText({ mode })}</HeaderText>
        </Header>
        {this.renderMode(mode)}
      </Wrapper>
    );
  }

  renderMode = (mode: number) => {
    const { setCreationMode, setUnlockMode, setRestoreMode, navigateToWallet, navigateToLocalNodeSetup, toggleRestoreWith12Words } = this.props;
    switch (mode) {
      case authModes.WELCOME:
        return <Welcome setCreationMode={setCreationMode} setRestoreMode={setRestoreMode} setUnlockMode={setUnlockMode} />;
      case authModes.UNLOCK:
        return <UnlockWallet setCreationMode={setCreationMode} setRestoreMode={setRestoreMode} navigateToWallet={navigateToWallet} />;
      case authModes.CREATE:
        return <CreateWallet hideCloseBtn={this.hideCloseBtn} navigateToWallet={navigateToWallet} navigateToLocalNodeSetup={navigateToLocalNodeSetup} />;
      case authModes.RESTORE:
        return <RestoreWallet setUnlockMode={setUnlockMode} toggleRestoreWith12Words={toggleRestoreWith12Words} />;
      default:
        return null;
    }
  };

  getHeaderText = ({ mode }: { mode: number }) => {
    switch (mode) {
      case authModes.WELCOME:
      case authModes.CREATE: {
        return 'Welcome to Spacemesh';
      }
      case authModes.UNLOCK: {
        return 'Welcome Back';
      }
      case authModes.RESTORE: {
        return 'Restore Wallet';
      }
      default: {
        return '';
      }
    }
  };

  hideCloseBtn = () => this.setState({ isCloseBtnVisible: false });
}

export default StepsContainer;
