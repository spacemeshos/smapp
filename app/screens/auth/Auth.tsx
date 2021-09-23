import React, { useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { readWalletFiles } from '../../redux/wallet/actions';
import { Logo } from '../../components/common';
import { Loader, SmallHorizontalPanel } from '../../basicComponents';
import routes from '../../routes';
import { rightDecoration, rightDecorationWhite } from '../../assets/images';
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

const RelativeContainer = styled.div`
  position: relative;
`;

const renderHorizontalPane = (path, isDarkMode) => {
  const DO_NOT_SHOW_ON = ['/auth/welcome', '/auth/leaving'];
  return DO_NOT_SHOW_ON.includes(path) ? null : <SmallHorizontalPanel isDarkMode={isDarkMode} />;
};

const Auth = ({ history, location }: AuthRouterParams) => {
  const walletFiles = useSelector((state: RootState) => state.wallet.walletFiles);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const dispatch = useDispatch();

  useEffect(() => {
    const initialSetup = async () => {
      const files = await dispatch(readWalletFiles());
      if (files.length && location.pathname !== '/auth/restore') {
        history.push('/auth/unlock');
      }
    };
    initialSetup();
  }, [dispatch, history, location.pathname]);

  return (
    <Wrapper>
      <Logo isDarkMode={isDarkMode} />
      <InnerWrapper>
        {walletFiles ? (
          <RelativeContainer>
            {renderHorizontalPane(location.pathname, isDarkMode)}
            <Switch>
              {routes.auth.map((route) => (
                <Route exact key={route.path} path={route.path} component={route.component} />
              ))}
              <Redirect to="/auth/welcome" />
            </Switch>
          </RelativeContainer>
        ) : (
          <Loader size={Loader.sizes.BIG} isDarkMode={isDarkMode} />
        )}
      </InnerWrapper>
      <Version />
      <RightDecoration src={isDarkMode ? rightDecorationWhite : rightDecoration} />
    </Wrapper>
  );
};

export default Auth;
