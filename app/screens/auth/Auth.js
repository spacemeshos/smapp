// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { readWalletFiles } from '/redux/wallet/actions';
import { StepsContainer } from '/components/auth';
import { Loader } from '/basicComponents';
import { background1, background2, background3 } from '/assets/images';
import { smColors, authModes } from '/vars';
import type { Action } from '/types';

// $FlowStyledIssue
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  ${({ backgroundImage }) => `background-image: url(${backgroundImage});`}
  transition: all 1s ease-in-out;
  background-position: center;
  background-size: cover;
`;

const InnerWrapper = styled.div`
  height: 100%;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${smColors.green30alpha};
`;

type Props = {
  history: { push: (string) => void },
  readWalletFiles: Action,
  walletFiles: Array<string>
};

type State = {
  mode: number,
  isRestoreWith12WordsMode: boolean
};

class Auth extends Component<Props, State> {
  state = {
    mode: -1,
    isRestoreWith12WordsMode: false
  };

  render() {
    const { walletFiles } = this.props;
    return (
      <Wrapper backgroundImage={this.getBackgroundImage()}>
        <InnerWrapper>{walletFiles ? this.renderBody() : <Loader size={Loader.sizes.BIG} />}</InnerWrapper>
      </Wrapper>
    );
  }

  static getDerivedStateFromProps(props, prevState) {
    if (props.walletFiles && prevState.mode === -1) {
      return { mode: props.walletFiles.length ? authModes.UNLOCK : authModes.WELCOME };
    }
    return null;
  }

  componentDidMount(): void {
    const { readWalletFiles } = this.props;
    readWalletFiles();
  }

  renderBody = () => {
    const { mode, isRestoreWith12WordsMode } = this.state;
    return isRestoreWith12WordsMode ? (
      <div />
    ) : (
      <StepsContainer
        mode={mode}
        setCreationMode={this.setCreationMode}
        setUnlockMode={this.setUnlockMode}
        setRestoreMode={this.setRestoreMode}
        navigateToLocalNodeSetup={this.navigateToLocalNodeSetup}
        navigateToWallet={this.navigateToWallet}
      />
    );
  };

  getBackgroundImage = () => {
    const { mode } = this.state;
    switch (mode) {
      case authModes.WELCOME:
        return background1;
      case authModes.UNLOCK:
        return background2;
      case authModes.CREATE:
        return background3;
      case authModes.RESTORE:
        return background3;
      default:
        return background1;
    }
  };

  setCreationMode = () => this.setState({ mode: authModes.CREATE });

  setUnlockMode = () => this.setState({ mode: authModes.UNLOCK });

  setRestoreMode = () => this.setState({ mode: authModes.RESTORE });

  navigateToLocalNodeSetup = () => {
    const { history } = this.props;
    history.push('/main/local-node');
  };

  navigateToWallet = () => {
    const { history } = this.props;
    history.push('/main/wallet');
  };

  navigateToRestoreWith12Words = () => {
    const { history } = this.props;
    history.push('/main/wallet');
  };
}

const mapStateToProps = (state) => ({
  walletFiles: state.wallet.walletFiles
});

const mapDispatchToProps = {
  readWalletFiles
};

Auth = connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth);

export default Auth;
