// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { setAuthenticated } from '/redux/auth/actions';
import { CenterCard } from '/components/auth';
import { walletStorageService } from '/infra/localStorageService';
import { background1, background2, background3 } from '/assets/images';
import { smColors } from '/vars';
import type { Wallet } from '/vars/globalTypes';

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

// TODO: remove stub
const wallet: Wallet = {
  displayName: 'Default Wallet',
  created: 'unix-epoch-timestamp',
  displayColor: 'rgb-value',
  path: 'm/44/[netId]/0/0/',
  crypto: {
    cipher: 'AES-128-CTR',
    cipherText: '8662bcdb82f8a38f2d4c3a1b6d848fbb19f03d02388aca9442d5e4cc7b5c70aff02c452b',
    cipherIv: '106c11fa110e99fdcbc5b4a29ddbff7d',
    mac: '7c5df1ef3bde5e2642931298a9b00fe4375e8722f32e879a155e0d031dd39cf1'
  },
  kd: {
    n: 262144,
    r: 8,
    p: 1,
    saltLen: 16,
    dkLen: 32,
    salt: '48464c24034c1e706c82336172b67156'
  }
};

type Props = {
  history: any,
  setAuthenticated: (payload?: { wallet: any, setupFullNode: boolean }) => void
};

type State = {
  card: number
};

class Auth extends Component<Props, State> {
  state = {
    card: 1
  };

  render() {
    const { card } = this.state;
    return (
      <Wrapper showImage backgroundImage={this.getBackgroundImage()}>
        <InnerWrapper>
          <CenterCard
            card={card}
            setCreationMode={this.setCreationMode}
            setLoginMode={this.setLoginMode}
            handleWalletCreation={this.handleWalletCreation}
            navigateToFullNodeSetup={this.navigateToFullNodeSetup}
            navigateToWallet={this.navigateToWallet}
          />
        </InnerWrapper>
      </Wrapper>
    );
  }

  componentDidMount() {
    const wallet = walletStorageService.getWallet();
    if (wallet) {
      this.setState({ card: 4 });
    }
  }

  getBackgroundImage = () => {
    const { card } = this.state;
    switch (card) {
      case 1:
        return background1;
      case 2:
        return background2;
      case 3:
      case 4:
        return background3;
      default:
        return background1;
    }
  };

  setCreationMode = () => this.setState({ card: 2 });

  setLoginMode = () => this.setState({ card: 4 });

  handleWalletCreation = () => {
    this.setState({ card: 3 });
  };

  navigateToFullNodeSetup = () => {
    const { history, setAuthenticated } = this.props;
    walletStorageService.saveWallet(wallet);
    setAuthenticated({ wallet, setupFullNode: true });
    history.push('/root');
  };

  navigateToWallet = () => {
    const { history, setAuthenticated } = this.props;
    walletStorageService.saveWallet(wallet);
    setAuthenticated({ wallet, setupFullNode: true });
    history.push('/root');
  };
}

const mapStateToProps = (state) => ({
  wallet: state.wallet
});

const mapDispatchToProps = {
  setAuthenticated
};

Auth = connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth);

export default Auth;
