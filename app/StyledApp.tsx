import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import { createMemoryHistory } from 'history';
import routes from './routes';
import GlobalStyle, { fontsCss } from './globalStyle';
import { RootState } from './types';
import { setOsTheme } from './redux/ui/actions';
import ErrorBoundary from './ErrorBoundary';
import CloseAppModal from './components/common/CloseAppModal';
import { ipcConsts } from './vars';
import { goToSwitchAPI, goToSwitchNetwork } from './routeUtils';
import { getThemeById } from './theme';
import { init } from './sentry';
import WriteFilePermissionError from './screens/modal/WriteFilePermissionError';
import NoInternetConnection from './screens/modal/NoInternetConnection';
import PoSProvingOptsUpdateWarningModal from './screens/modal/PoSProvingOptsUpdateWarningModal';
import AutoLaunchErrorModal from './screens/modal/AutoLaunchErrorModal';
import ImportFileWarningModal from './screens/modal/ImportFileWarningModal';

const history = createMemoryHistory();

init(history);

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
  const dispatch = useDispatch();
  const theme = getThemeById(skinId, isDarkMode);

  useEffect(() => {
    dispatch(setOsTheme());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <style>{fontsCss}</style>
      <GlobalStyle />
      <ErrorBoundary>
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
          <WriteFilePermissionError />
          <NoInternetConnection />
          <CloseAppModal />
          <PoSProvingOptsUpdateWarningModal />
          <AutoLaunchErrorModal />
          <ImportFileWarningModal />
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default StyledApp;
