// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { setAuthenticated, logout } from '/redux/auth/actions';
import { CenterCard } from '/components/auth';
import { background1, background2, background3 } from '/assets/images';
import { smColors } from '/vars';

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
  history: any,
  logout: Function
  // setAuthenticated: (payload?: { wallet: any, setupFullNode: boolean }) => void
};

type State = {
  step: number
};

class Auth extends Component<Props, State> {
  state = {
    step: 1
  };

  render() {
    const { step } = this.state;
    return (
      <Wrapper backgroundImage={this.getBackgroundImage()}>
        <InnerWrapper>
          <CenterCard
            step={step}
            setCreationMode={this.setCreationMode}
            setLoginMode={this.setLoginMode}
            navigateToLocalNodeSetup={this.navigateToLocalNodeSetup}
            navigateToWallet={this.navigateToWallet}
          />
        </InnerWrapper>
      </Wrapper>
    );
  }

  componentWillUnmount(): void {
    const { logout } = this.props;
    logout();
  }

  getBackgroundImage = () => {
    const { step } = this.state;
    switch (step) {
      case 1:
        return background1;
      case 2:
        return background2;
      case 3:
        return background3;
      default:
        return background1;
    }
  };

  setCreationMode = () => this.setState({ step: 2 });

  setLoginMode = () => this.setState({ step: 3 });

  navigateToLocalNodeSetup = () => {
    const { history } = this.props;
    history.push('/main');
  };

  navigateToWallet = () => {
    const { history } = this.props;
    history.push('/main/wallet');
  };
}

const mapStateToProps = (state) => ({
  wallet: state.wallet
});

const mapDispatchToProps = {
  logout,
  setAuthenticated
};

Auth = connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth);

export default Auth;
