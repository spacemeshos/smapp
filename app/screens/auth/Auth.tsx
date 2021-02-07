import React, { useEffect } from 'react';
import { Redirect, Route, Switch, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { getNodeSettings } from '../../redux/node/actions';
import { readWalletFiles } from '../../redux/wallet/actions';
import { ScreenErrorBoundary } from '../../components/errorHandler';
import { Logo } from '../../components/common';
import routes from '../../routes';
import { rightDecoration, rightDecorationWhite } from '../../assets/images';
import { RootState } from '../../types';

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

interface Props extends RouteComponentProps {
  location: {
    hash: string;
    pathname: string;
    search: string;
    state: unknown;
  };
}

const Auth = ({ history, location }: Props) => {
  // render() {
  //   const { walletFiles, isDarkMode } = this.props;
  //
  // }

  // async componentDidMount() {
  //   const { getNodeSettings, readWalletFiles, history, location } = this.props;
  //   // @ts-ignore

  // }
type Props = {
  getNodeStatus: CustomAction;
  getMiningStatus: CustomAction;
  getNodeSettings: CustomAction;
  readWalletFiles: CustomAction;
  isDarkMode: boolean;
  history: RouteComponentProps;
  location: { pathname: string; state?: { presetMode: number } };
};

  const walletFiles = useSelector((state: RootState) => state.wallet.walletFiles);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const dispatch = useDispatch();

  useEffect(() => {
    const initialSetup = async () => {
      const files = dispatch(await readWalletFiles());
      if (files.length && location.pathname !== '/auth/restore') {
        history.push('/auth/unlock');
      }
      dispatch(getNodeSettings());
    };
    initialSetup();
  });

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
  return (
    <Wrapper>
      <Logo isDarkMode={isDarkMode} />
      <InnerWrapper>
        {walletFiles.length > 0 ? (
          <Switch>
            {routes.auth.map((route) => (
              <Route exact key={route.path} path={route.path} component={route.component} />
            ))}
            <Redirect to="/auth/welcome" />
          </Switch>
        ) : (
          <Loader size={Loader.sizes.BIG} isDarkMode={isDarkMode} />
        )}
      </InnerWrapper>
      <RightDecoration src={isDarkMode ? rightDecorationWhite : rightDecoration} />
    </Wrapper>
  );
};

export default ScreenErrorBoundary(Auth);
