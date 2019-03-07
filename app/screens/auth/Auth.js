// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { setAuthenticated } from '/redux/auth/actions';
import { CenterCard } from '/components/auth';
import type { WelcomeActions } from '/components/auth';
import { walletStorageService } from '/infra/localStorageService';
import { background1, background2, background3 } from '/assets/images';
import { smColors } from '/vars';
import type { Wallet } from '/vars/globalTypes';

type AuthProps = {
  history: any,
  setAuthenticated: (payload?: { wallet: any, setupFullNode: boolean }) => void
};

type AuthState = {
  page: 1 | 2 | 3 | 4
};

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

class Auth extends Component<AuthProps, AuthState> {
  state = {
    page: 1
  };

  render() {
    const { page } = this.state;
    return (
      <Wrapper showImage backgroundImage={this.getBackgroundImage()}>
        <InnerWrapper>
          <CenterCard page={page} onPress={this.handleCardAction} />
        </InnerWrapper>
      </Wrapper>
    );
  }

  componentDidMount() {
    const wallet = walletStorageService.getWallet();
    if (wallet) {
      this.setState({ page: 4 });
    }
  }

  getBackgroundImage = () => {
    const { page } = this.state;
    switch (page) {
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

  handleCardAction = (action: WelcomeActions) => {
    const { history, setAuthenticated } = this.props;

    // TEST
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

    switch (action.type) {
      case 'create':
        this.setState({ page: 2 });
        break;
      case 'to login page':
        this.setState({ page: 4 });
        break;
      case 'next':
        this.setState({ page: 3 });
        break;
      case 'setup full node':
        walletStorageService.saveWallet(wallet);
        setAuthenticated({ wallet, setupFullNode: true });
        history.push('/root');
        break;
      case 'login':
      case 'later':
        walletStorageService.saveWallet(wallet);
        setAuthenticated({ wallet, setupFullNode: false });
        history.push('/root');
        break;
      default:
        break;
    }
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
