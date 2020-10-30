// @flow
import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { getNodeStatus, getMiningStatus, getNodeSettings } from '/redux/node/actions';
import { readWalletFiles } from '/redux/wallet/actions';
import { ScreenErrorBoundary } from '/components/errorHandler';
import { Logo } from '/components/common';
import { Loader } from '/basicComponents';
import routes from '/routes';
import { rightDecoration, rightDecorationWhite } from '/assets/images';
import type { Action } from '/types';
import { nodeConsts } from '/vars';
import type { RouterHistory } from 'react-router-dom';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  flex: 1;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
`;

const RightDecoration = styled.img`
  display: block;
  height: 100%;
  margin-right: -1px;
`;

const InnerWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 30px 25px;
`;

type Props = {
  getNodeStatus: Action,
  getMiningStatus: Action,
  getNodeSettings: Action,
  readWalletFiles: Action,
  isDarkModeOn: boolean,
  walletFiles: Array<string>,
  history: RouterHistory,
  location: { pathname: string, state?: { presetMode: number } }
};

class Auth extends Component<Props> {
  getNodeStatusInterval: IntervalID; // eslint-disable-line react/sort-comp

  getMiningStatusInterval: IntervalID; // eslint-disable-line react/sort-comp

  render() {
    const { walletFiles, isDarkModeOn } = this.props;
    return (
      <Wrapper>
        <Logo />
        <InnerWrapper>
          {walletFiles ? (
            <Switch>
              {routes.auth.map((route) => (
                <Route exact key={route.path} path={route.path} component={route.component} />
              ))}
              <Redirect to="/auth/welcome" />
            </Switch>
          ) : (
            <Loader size={Loader.sizes.BIG} isDarkModeOn={isDarkModeOn} />
          )}
        </InnerWrapper>
        <RightDecoration src={isDarkModeOn ? rightDecorationWhite : rightDecoration} />
      </Wrapper>
    );
  }

  async componentDidMount() {
    const { getNodeStatus, getMiningStatus, getNodeSettings, readWalletFiles, history, location } = this.props;
    const files = await readWalletFiles();
    if (files.length && location.pathname !== '/auth/restore') {
      history.push('/auth/unlock');
    }
    await getNodeStatus();
    this.getNodeStatusInterval = setInterval(getNodeStatus, 20000);
    const status = await getMiningStatus();
    if (status === nodeConsts.MINING_UNSET) {
      this.getMiningStatusInterval = setInterval(async () => {
        const status = await getMiningStatus();
        if (status !== nodeConsts.MINING_UNSET) {
          this.getMiningStatusInterval && clearInterval(this.getMiningStatusInterval);
        }
      }, 1000);
    }
    await getNodeSettings();
  }

  componentWillUnmount(): void {
    this.getMiningStatusInterval && clearInterval(this.getMiningStatusInterval);
    this.getNodeStatusInterval && clearInterval(this.getNodeStatusInterval);
  }
}

const mapStateToProps = (state) => ({
  walletFiles: state.wallet.walletFiles,
  isDarkModeOn: state.ui.isDarkMode
});

const mapDispatchToProps = {
  getNodeStatus,
  getMiningStatus,
  getNodeSettings,
  readWalletFiles
};

Auth = connect(mapStateToProps, mapDispatchToProps)(Auth);

Auth = ScreenErrorBoundary(Auth);
export default Auth;
