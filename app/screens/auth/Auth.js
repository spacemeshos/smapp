// @flow
import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { getNodeStatus, getNodeSettings } from '/redux/node/actions';
import { getSmesherSettings, getPostStatus, isSmeshing } from '/redux/smesher/actions';
import { readWalletFiles } from '/redux/wallet/actions';
import { ScreenErrorBoundary } from '/components/errorHandler';
import { Logo } from '/components/common';
import { Loader } from '/basicComponents';
import routes from '/routes';
import { rightDecoration, rightDecorationWhite } from '/assets/images';
import type { Action } from '/types';
import type { RouterHistory } from 'react-router-dom';

const isDarkModeOn = localStorage.getItem('dmMode') === 'true';
const img = isDarkModeOn ? rightDecorationWhite : rightDecoration;

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
  getNodeSettings: Action,
  readWalletFiles: Action,
  getSmesherSettings: Action,
  getPostStatus: Action,
  isSmeshing: Action,
  walletFiles: Array<string>,
  history: RouterHistory
};

class Auth extends Component<Props> {
  getNodeStatusInterval: IntervalID; // eslint-disable-line react/sort-comp

  render() {
    const { walletFiles } = this.props;
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
            <Loader size={Loader.sizes.BIG} />
          )}
        </InnerWrapper>
        <RightDecoration src={img} />
      </Wrapper>
    );
  }

  async componentDidMount() {
    const { getNodeStatus, getNodeSettings, readWalletFiles, getSmesherSettings, getPostStatus, isSmeshing, history } = this.props;
    const files = await readWalletFiles();
    if (files.length) {
      history.push('/auth/unlock');
    }
    await getNodeStatus();
    this.getNodeStatusInterval = setInterval(getNodeStatus, 20000);
    await getPostStatus();
    await getNodeSettings();
    await getSmesherSettings();
    await isSmeshing();
  }

  componentWillUnmount(): void {
    this.getNodeStatusInterval && clearInterval(this.getNodeStatusInterval);
  }
}

const mapStateToProps = (state) => ({
  walletFiles: state.wallet.walletFiles
});

const mapDispatchToProps = {
  getNodeStatus,
  getNodeSettings,
  readWalletFiles,
  getSmesherSettings,
  getPostStatus,
  isSmeshing
};

Auth = connect(mapStateToProps, mapDispatchToProps)(Auth);

Auth = ScreenErrorBoundary(Auth);
export default Auth;
