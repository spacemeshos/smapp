// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { StepsContainer } from '/components/auth';
import { Loader } from '/basicComponents';
import { background1, background2, background3 } from '/assets/images';
import { smColors, authModes } from '/vars';

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
  history: Object,
  walletFiles: Array<string>
};

type State = {
  mode: number
};

class Auth extends Component<Props, State> {
  constructor(props) {
    super(props);
    const { walletFiles } = props;
    this.state = {
      mode: walletFiles && walletFiles.length ? authModes.UNLOCK : authModes.WELCOME
    };
  }

  render() {
    const { walletFiles } = this.props;
    const { mode } = this.state;
    return (
      <Wrapper backgroundImage={this.getBackgroundImage()}>
        <InnerWrapper>
          {walletFiles ? (
            <StepsContainer
              mode={mode}
              setCreationMode={this.setCreationMode}
              setUnlockMode={this.setUnlockMode}
              navigateToLocalNodeSetup={this.navigateToLocalNodeSetup}
              navigateToWallet={this.navigateToWallet}
            />
          ) : (
            <Loader size={Loader.sizes.BIG} />
          )}
        </InnerWrapper>
      </Wrapper>
    );
  }

  static getDerivedStateFromProps(props) {
    if (props.walletFiles && props.walletFiles.length) {
      return { mode: authModes.UNLOCK };
    }
    return null;
  }

  getBackgroundImage = () => {
    const { mode } = this.state;
    switch (mode) {
      case authModes.WELCOME:
        return background1;
      case authModes.UNLOCK:
        return background2;
      case authModes.CREATE:
        return background3;
      default:
        return background1;
    }
  };

  setCreationMode = () => this.setState({ mode: authModes.CREATE });

  setUnlockMode = () => this.setState({ mode: authModes.UNLOCK });

  navigateToLocalNodeSetup = () => {
    const { history } = this.props;
    history.push('/main');
  };

  navigateToWallet = () => {
    const { history } = this.props;
    history.push('/main');
  };
}

const mapStateToProps = (state) => ({
  walletFiles: state.auth.walletFiles
});

Auth = connect(mapStateToProps)(Auth);

export default Auth;
