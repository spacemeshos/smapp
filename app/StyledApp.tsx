import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { Router, Route, Switch, Redirect, useHistory, matchPath } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { createBrowserHistory } from 'history';
import routes from './routes';
import { AuthPath } from './routerPaths';
import GlobalStyle from './globalStyle';
import { RootState } from './types';
import { setOsTheme } from './redux/ui/actions';
import ErrorBoundary from './ErrorBoundary';
import CloseAppModal from './components/common/CloseAppModal';
import { ipcConsts } from './vars';
import { goToSwitchNetwork } from './routeUtils';

const history = createBrowserHistory();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === 'production',
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV5Instrumentation(
        history,
        Object.values(routes).reduce((prev, next) => [...prev, ...next], []),
        matchPath
      ),
    }),
  ],
  tracesSampleRate: 1.0,
  debug: process.env.SENTRY_LOG_LEVEL === 'debug',
});

const EventRouter = () => {
  const history = useHistory();

  useEffect(() => {
    ipcRenderer.on(ipcConsts.REQUEST_SWITCH_NETWORK, (_, { isWalletOnly }) => history.location.pathname !== AuthPath.SwitchNetwork && goToSwitchNetwork(history, isWalletOnly));
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
        <Router history={history}>
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
