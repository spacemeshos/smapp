// @flow
import { shell } from 'electron';
import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { readWalletFiles } from '/redux/wallet/actions';
import { ScreenErrorBoundary } from '/components/errorHandler';
import { QuitDialog } from '/components/common';
import { Loader } from '/basicComponents';
import routes from '/routes';
import { smColors } from '/vars';
import { logo, sideBar } from '/assets/images';
import type { Action } from '/types';
import type { RouterHistory } from 'react-router-dom';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
  padding: 30px 25px;
  background-color: ${smColors.white};
`;

const Logo = styled.img`
  display: block;
  position: absolute;
  top: 5px;
  left: 15px;
  width: 130px;
  height: 40px;
  cursor: pointer;
`;

const SideBar = styled.img`
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 100%;
`;

const InnerWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: ${smColors.white};
`;

type Props = {
  history: RouterHistory,
  readWalletFiles: Action,
  walletFiles: Array<string>,
  location: { state?: { presetMode: number } }
};

class Auth extends Component<Props> {
  render() {
    const { walletFiles } = this.props;
    return (
      <Wrapper>
        <QuitDialog />
        <Logo src={logo} onClick={() => shell.openExternal('https://spacemesh.io')} />
        <SideBar src={sideBar} />
        <InnerWrapper>
          {walletFiles ? (
            <Switch>
              {routes.auth.map((route) => (
                <Route exact key={route.path} path={route.path} component={route.component} />
              ))}
              <Redirect to="/auth/welcome" />
            </Switch>
          ) : (
            <Loader size={Loader.sizes.BIG} />
          )}
        </InnerWrapper>
      </Wrapper>
    );
  }

  async componentDidMount() {
    const { readWalletFiles, history } = this.props;
    const files = await readWalletFiles();
    if (files.length) {
      history.push('/auth/unlock');
    }
  }
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

Auth = ScreenErrorBoundary(Auth);
export default Auth;
