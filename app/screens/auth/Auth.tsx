import React, { Component } from 'react';
import { Redirect, Route, Switch, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { getNodeStatus, getMiningStatus, getNodeSettings } from '../../redux/node/actions';
import { readWalletFiles } from '../../redux/wallet/actions';
import { ScreenErrorBoundary } from '../../components/errorHandler';
import { Logo } from '../../components/common';
import routes from '../../routes';
import { rightDecoration, rightDecorationWhite } from '../../assets/images';
import { nodeConsts } from '../../vars';
import { CustomAction, RootState } from '../../types';

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

const SetupSpan = styled.span`
  color: #a14736;
  text-transform: uppercase;
  top: 17px;
  left: 145px;
  right: 0;
  position: absolute;
  width: 130px;
  height: 40px;
  cursor: pointer;
  font-size: 15px;
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
  getNodeStatus: CustomAction;
  getMiningStatus: CustomAction;
  getNodeSettings: CustomAction;
  readWalletFiles: CustomAction;
  isDarkMode: boolean;
  history: RouteComponentProps;
  location: { pathname: string; state?: { presetMode: number } };
};

class Auth extends Component<Props> {
  getNodeStatusInterval: ReturnType<typeof setInterval> | null = null; // eslint-disable-line react/sort-comp

  getMiningStatusInterval: ReturnType<typeof setInterval> | null = null; // eslint-disable-line react/sort-comp

  render() {
    const { isDarkMode, location } = this.props;
    const isWelcomeScreen = location.pathname.includes('/auth/welcome');
    return (
      <Wrapper>
        <Logo isDarkMode={isDarkMode} />
        {isWelcomeScreen && <SetupSpan>Setup</SetupSpan>}
        <InnerWrapper>
          <Switch>
            {routes.auth.map((route) => (
              <Route exact key={route.path} path={route.path} component={route.component} />
            ))}
            <Redirect to="/auth/welcome" />
          </Switch>
        </InnerWrapper>
        <RightDecoration src={isDarkMode ? rightDecorationWhite : rightDecoration} />
      </Wrapper>
    );
  }

  async componentDidMount() {
    const { getNodeStatus, getMiningStatus, getNodeSettings, readWalletFiles, history, location } = this.props;
    // @ts-ignore
    const files = await readWalletFiles();
    if (files.length && location.pathname !== '/auth/restore') {
      // @ts-ignore
      history.push('/auth/unlock');
    }
    // @ts-ignore
    await getNodeStatus();
    this.getNodeStatusInterval = setInterval(async () => {
      // @ts-ignore
      await getNodeStatus();
    }, 20000);
    // @ts-ignore
    const status = await getMiningStatus();
    if (status === nodeConsts.MINING_UNSET) {
      this.getMiningStatusInterval = setInterval(async () => {
        // @ts-ignore
        const status = await getMiningStatus();
        if (status !== nodeConsts.MINING_UNSET && this.getMiningStatusInterval) {
          clearInterval(this.getMiningStatusInterval);
        }
      }, 1000);
    }
    // @ts-ignore
    await getNodeSettings();
  }

  componentWillUnmount() {
    if (this.getMiningStatusInterval) {
      clearInterval(this.getMiningStatusInterval);
    }
    if (this.getNodeStatusInterval) {
      clearInterval(this.getNodeStatusInterval);
    }
  }
}

const mapStateToProps = (state: RootState) => ({
  isDarkMode: state.ui.isDarkMode
});

const mapDispatchToProps = {
  getNodeStatus,
  getMiningStatus,
  getNodeSettings,
  readWalletFiles
};

// @ts-ignore
Auth = connect(mapStateToProps, mapDispatchToProps)(Auth);

export default ScreenErrorBoundary(Auth);
