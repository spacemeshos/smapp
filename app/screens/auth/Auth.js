// @flow
import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { checkNodeConnection, getMiningStatus } from '/redux/node/actions';
import { readWalletFiles } from '/redux/wallet/actions';
import { ScreenErrorBoundary } from '/components/errorHandler';
import { Logo, OnQuitModal } from '/components/common';
import { Loader } from '/basicComponents';
import { nodeService } from '/infra/nodeService';
import routes from '/routes';
import { rightDecoration } from '/assets/images';
import type { Action } from '/types';
import type { RouterHistory } from 'react-router-dom';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  flex: 1;
  width: 100%;
  height: 100%;
`;

const RightDecoration = styled.img`
  display: block;
  height: 100%;
`;

const InnerWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 30px 25px;
`;

const HEALTH_CHECK_INTERVAL = 360000;

type Props = {
  checkNodeConnection: Action,
  getMiningStatus: Action,
  readWalletFiles: Action,
  walletFiles: Array<string>,
  history: RouterHistory,
  location: { pathname: string, state?: { presetMode: number } }
};

class Auth extends Component<Props> {
  // eslint-disable-next-line react/sort-comp
  startNodeInterval: IntervalID;

  healthCheckInterval: IntervalID;

  checkConnectionTimer: TimeoutID;

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
        <RightDecoration src={rightDecoration} />
        <OnQuitModal />
      </Wrapper>
    );
  }

  async componentDidMount() {
    const { checkNodeConnection, readWalletFiles, history, location } = this.props;
    const files = await readWalletFiles();
    if (files.length && location.pathname !== '/auth/restore') {
      history.push('/auth/unlock');
    }
    const isConnectedToNode = await checkNodeConnection();
    if (!isConnectedToNode) {
      await this.attemptToStartFullNode();
      this.healthCheckFlow();
    } else {
      this.healthCheckFlow();
    }
  }

  componentWillUnmount(): void {
    this.healthCheckInterval && clearInterval(this.healthCheckInterval);
    this.startNodeInterval && clearInterval(this.startNodeInterval);
    this.checkConnectionTimer && clearTimeout(this.checkConnectionTimer);
  }

  attemptToStartFullNode = () => {
    const { checkNodeConnection } = this.props;
    const intervalTime = 5000; // ms
    let attemptsRemaining = 5;
    return new Promise<string, Error>((resolve: Function, reject: Function) => {
      this.startNodeInterval = setInterval(async () => {
        if (!attemptsRemaining) {
          clearInterval(this.startNodeInterval);
          reject();
        } else {
          const isConnectedToNode = await checkNodeConnection();
          attemptsRemaining -= 1;
          if (!isConnectedToNode) {
            try {
              await nodeService.startNode();
            } catch {
              // Ignoring this error since we still want to check connection if node is already running.
            }
            this.checkConnectionTimer = setTimeout(async () => {
              const isConnectedToNode = await checkNodeConnection();
              clearInterval(this.startNodeInterval);
              isConnectedToNode && resolve();
            }, 1000);
          } else {
            clearInterval(this.startNodeInterval);
            resolve();
          }
        }
      }, intervalTime);
    });
  };

  healthCheckFlow = async () => {
    const { checkNodeConnection, getMiningStatus } = this.props;
    await getMiningStatus();
    this.healthCheckInterval = setInterval(async () => {
      await checkNodeConnection();
    }, HEALTH_CHECK_INTERVAL);
  };
}

const mapStateToProps = (state) => ({
  isConnected: state.node.isConnected,
  walletFiles: state.wallet.walletFiles
});

const mapDispatchToProps = {
  checkNodeConnection,
  getMiningStatus,
  readWalletFiles
};

Auth = connect(mapStateToProps, mapDispatchToProps)(Auth);

Auth = ScreenErrorBoundary(Auth);
export default Auth;
