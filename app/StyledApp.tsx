import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { Router, Route, Switch, Redirect, matchPath } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import { init, reactRouterV5Instrumentation } from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { createBrowserHistory } from 'history';
import routes from './routes';
import GlobalStyle from './globalStyle';
import { RootState } from './types';
import { setOsTheme } from './redux/ui/actions';
import ErrorBoundary from './ErrorBoundary';
import CloseAppModal from './components/common/CloseAppModal';
import { ipcConsts } from './vars';
import { goToSwitchAPI, goToSwitchNetwork } from './routeUtils';
import { getThemeById } from './theme';

const history = createBrowserHistory();

init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.SENTRY_ENV || process.env.NODE_ENV,
  enabled: process.env.NODE_ENV !== 'development',
  integrations: [
    new BrowserTracing({
      routingInstrumentation: reactRouterV5Instrumentation(
        history,
        Object.values(routes).reduce((prev, next) => [...prev, ...next], []),
        matchPath
      ),
    }),
  ],
  tracesSampleRate: 1.0,
  debug: process.env.SENTRY_LOG_LEVEL === 'debug',
  maxValueLength: 20000,
  attachStacktrace: true,
});

const EventRouter = () => {
  const onSwitchNet = (_, { isWalletOnly }) =>
    goToSwitchNetwork(history, isWalletOnly);
  const onSwitchApi = (_, { isWalletOnly }) =>
    goToSwitchAPI(history, isWalletOnly);

  useEffect(() => {
    ipcRenderer.send('BROWSER_READY');

    ipcRenderer.on(ipcConsts.REQUEST_SWITCH_NETWORK, onSwitchNet);
    ipcRenderer.on(ipcConsts.REQUEST_SWITCH_API, onSwitchApi);
    return () => {
      ipcRenderer.off(ipcConsts.REQUEST_SWITCH_NETWORK, onSwitchNet);
      ipcRenderer.off(ipcConsts.REQUEST_SWITCH_API, onSwitchApi);
    };
  });

  return <></>;
};

const StyledApp = () => {
  const skinId = useSelector((state: RootState) => state.ui.skinId);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const isClosingApp = useSelector((state: RootState) => state.ui.isClosingApp);
  const dispatch = useDispatch();
  const theme = getThemeById(skinId, isDarkMode);
  useEffect(() => {
    dispatch(setOsTheme());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <ErrorBoundary>
        {isClosingApp && <CloseAppModal />}
        <Router history={history}>
          <EventRouter />
          <Switch>
            {routes.app.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                component={route.component}
              />
            ))}
            <Redirect to="/auth" />
          </Switch>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default StyledApp;
