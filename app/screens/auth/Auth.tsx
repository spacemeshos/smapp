import React, { useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { readWalletFiles } from '../../redux/wallet/actions';
import { Logo } from '../../components/common';
import { Loader, SmallHorizontalPanel } from '../../basicComponents';
import routes from '../../routes';
import { AuthPath } from '../../routerPaths';
import { RootState } from '../../types';
import Version from '../../components/common/Version';
import { AuthRouterParams } from './routerParams';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  flex: 1;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
`;

const RightDecoration = styled.img.attrs((props) => ({
  src: props.theme.icons.pageLeftSideBar,
}))`
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

const RelativeContainer = styled.div`
  position: relative;
`;

const renderHorizontalPane = (path, isDarkMode) => {
  const DO_NOT_SHOW_ON = [AuthPath.Welcome, AuthPath.Leaving];
  return DO_NOT_SHOW_ON.includes(path) ? null : (
    <SmallHorizontalPanel isDarkMode={isDarkMode} />
  );
};

const Auth = ({ history, location }: AuthRouterParams) => {
  const walletFiles = useSelector(
    (state: RootState) => state.wallet.walletFiles
  );
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      location.pathname === AuthPath.ConnectToAPI ||
      location.pathname === AuthPath.SwitchNetwork
    )
      return;
    const initialSetup = async () => {
      const files = await dispatch(readWalletFiles());
      if (files.length && location.pathname === AuthPath.Auth) {
        history.push(AuthPath.Unlock, location.state);
      }
    };
    initialSetup();
  }, [dispatch, history, location.pathname, location.state]);

  return (
    <Wrapper>
      <Logo isDarkMode={isDarkMode} />
      <InnerWrapper>
        {walletFiles ? (
          <RelativeContainer>
            {renderHorizontalPane(location.pathname, isDarkMode)}
            <Switch>
              {routes.auth.map((route) => (
                <Route
                  exact
                  key={route.path}
                  path={route.path}
                  component={route.component}
                />
              ))}
              <Redirect to="/auth/welcome" />
            </Switch>
          </RelativeContainer>
        ) : (
          <Loader size={Loader.sizes.BIG} isDarkMode={isDarkMode} />
        )}
      </InnerWrapper>
      <Version />
      <RightDecoration />
    </Wrapper>
  );
};

export default Auth;
