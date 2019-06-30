// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { readWalletFiles } from '/redux/wallet/actions';
import { StepsContainer, WordsRestore } from '/components/auth';
import { Loader } from '/basicComponents';
import { background1, background2, background3 } from '/assets/images';
import { smColors, authModes } from '/vars';
import type { Action } from '/types';
import { fileSystemService } from '/infra/fileSystemService';
import { httpService } from '/infra/httpService';
import { ScreenErrorBoundary } from '/components/errorHandler';

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
  walletFiles: Array<string>,
  location: { state?: { presetMode: number } }
};

type State = {
  mode: number,
  isRestoreWith12WordsMode: boolean,
  mnemonic: string
};

class Auth extends Component<Props, State> {
  state = {
    mode: this.props.location.state ? this.props.location.state.presetMode : -1, // eslint-disable-line react/destructuring-assignment
    isRestoreWith12WordsMode: false,
    mnemonic: ''
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

  async componentDidMount() {
    const { readWalletFiles } = this.props;
    try {
      await readWalletFiles();
      await this.checkLocalNode();
    } catch (error) {
      this.setState(() => {
        throw error;
      });
    }
  }

  renderBody = () => {
    const { mode, isRestoreWith12WordsMode, mnemonic } = this.state;
    return isRestoreWith12WordsMode ? (
      <WordsRestore toggleRestoreWith12Words={this.toggleRestoreWith12Words} proceedWithRestore={this.proceedWithRestore} />
    ) : (
      <StepsContainer
        mode={mode}
        setCreationMode={this.setCreationMode}
        setUnlockMode={this.setUnlockMode}
        setRestoreMode={this.setRestoreMode}
        navigateToLocalNodeSetup={this.navigateToLocalNodeSetup}
        navigateToWallet={this.navigateToWallet}
        toggleRestoreWith12Words={this.toggleRestoreWith12Words}
        mnemonic={mnemonic}
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

  toggleRestoreWith12Words = () => {
    const { isRestoreWith12WordsMode } = this.state;
    this.setState({ isRestoreWith12WordsMode: !isRestoreWith12WordsMode });
  };

  proceedWithRestore = ({ mnemonic }) => {
    this.setState({ isRestoreWith12WordsMode: false, mode: authModes.CREATE, mnemonic });
  };

  checkLocalNode = async () => {
    try {
      await httpService.checkNetworkConnection();
    } catch (err) {
      // Ignore this error - local node not running. Will now run local node.
      this.runLocalNode();
    }
  };

  runLocalNode = async () => {
    try {
      await fileSystemService.runLocalNode();
    } catch (error) {
      throw error;
    }
  };
}

const mapStateToProps = (state) => ({
  walletFiles: state.wallet.walletFiles,
  isConnected: state.network.isConnected,
  isLocalNodeRunning: state.network.isLocalNodeRunning
});

const mapDispatchToProps = {
  readWalletFiles
};

Auth = connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth);

Auth = ScreenErrorBoundary(Auth, true);
export default Auth;
