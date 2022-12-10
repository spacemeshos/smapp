import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import {
  Router,
  Route,
  Switch,
  Redirect /* , matchPath */,
} from 'react-router-dom';
import { createBrowserHistory } from 'history';
// import { init } from '@sentry/electron/renderer';
// import { init as reactInit, reactRouterV5Instrumentation } from '@sentry/react';
// import { captureException } from '@sentry/electron';
// import { BrowserTracing } from '@sentry/tracing';
// import { Integration } from '@sentry/types';
import sentry, { captureException } from '../sentry/renderer';
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
/*

init(
  {
    dsn: process.env.SENTRY_DSN,
    environment: 'dev',
    enabled: true,
    release: '0.2.9',
    integrations: [
      new BrowserTracing({
        routingInstrumentation: reactRouterV5Instrumentation(
          history,
          Object.values(routes).reduce((prev, next) => [...prev, ...next], []),
          matchPath
        ),
      }) as Integration,
    ],
    tracesSampleRate: 1.0,
    debug: true,
    maxValueLength: 20000,
    attachStacktrace: true,
  },
  reactInit
);
*/

const EventRouter = () => {
  const onSwitchNet = (_, { isWalletOnly }) =>
    goToSwitchNetwork(history, isWalletOnly);
  const onSwitchApi = (_, { isWalletOnly }) =>
    goToSwitchAPI(history, isWalletOnly);

  useEffect(() => {
    window.electron.ipcRenderer.send('BROWSER_READY');

    const requestSwitchNetworkOff = window.electron.ipcRenderer.on(ipcConsts.REQUEST_SWITCH_NETWORK, onSwitchNet);
    const onSwitchApiOff = window.electron.ipcRenderer.on(ipcConsts.REQUEST_SWITCH_API, onSwitchApi);
    return () => {
      requestSwitchNetworkOff && requestSwitchNetworkOff()
      onSwitchApiOff && onSwitchApiOff()
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

  try {
    const result = captureException(new Error('React error'));
    console.log({ result });
  } catch (e) {
    console.log({ e });
  }

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
