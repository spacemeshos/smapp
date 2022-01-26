import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { MemoryRouter as Router, Route, Switch, Redirect, useHistory } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import routes from './routes';
import GlobalStyle from './globalStyle';
import { RootState } from './types';
import { setOsTheme } from './redux/ui/actions';
import ErrorBoundary from './ErrorBoundary';
import CloseAppModal from './components/common/CloseAppModal';
import { ipcConsts } from './vars';

const EventRouter = () => {
  const history = useHistory();
  useEffect(() => {
    ipcRenderer.on(ipcConsts.REQUEST_SWITCH_NETWORK, (_, { isWalletOnly }) => {
      setImmediate(() => {
        history.push('/auth/switch-network', { redirect: history.location.pathname, isWalletOnly });
      });
    });
  }, [history]);
  return <></>;
};

const StyledApp = () => {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const isClosingApp = useSelector((state: RootState) => state.ui.isClosingApp);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setOsTheme());
  }, [dispatch]);

  return (
    <ThemeProvider theme={{ isDarkMode }}>
      <GlobalStyle />
      <ErrorBoundary>
        {isClosingApp && <CloseAppModal isDarkMode={isDarkMode} />}
        <Router>
          <EventRouter />
          <Switch>
            {routes.app.map((route) => (
              <Route key={route.path} path={route.path} component={route.component} />
            ))}
            <Redirect to="/auth" />
          </Switch>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default StyledApp;
