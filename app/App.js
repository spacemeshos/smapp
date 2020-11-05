// @flow
import { hot, setConfig } from 'react-hot-loader';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { logout } from '/redux/auth/actions';
// import { eventsService } from '/infra/eventsService';
import routes from './routes';
import GlobalStyle from './globalStyle';
import type { Store } from '/types';
import { configureStore } from './redux/configureStore';
import { OnQuitModal, CustomThemeProvider } from '/components/common';

const logger = require('electron-log');

logger.transports.console.level = false;

const store: Store = configureStore();

const configOptions: $Shape<Object> = {
  showReactDomPatchNotification: false
};

setConfig(configOptions);

class App extends React.Component<{}> {
  // updateCheckInterval: IntervalID; // eslint-disable-line react/sort-comp

  render() {
    return (
      <>
        <Provider store={store}>
          <CustomThemeProvider>
            <GlobalStyle />
            <Router>
              <Switch>
                {routes.app.map((route) => (
                  <Route key={route.path} path={route.path} component={route.component} />
                ))}
                <Redirect to="/pre" />
              </Switch>
            </Router>
            <OnQuitModal />
          </CustomThemeProvider>
        </Provider>
      </>
    );
  }

  // TODO: auto update is temporary disabled
  // componentDidMount() {
  //   eventsService.checkForUpdates();
  //   this.updateCheckInterval = setInterval(() => {
  //     eventsService.checkForUpdates();
  //   }, 86400000);
  // }

  componentWillUnmount(): void {
    // this.updateCheckInterval && clearInterval(this.updateCheckInterval);
    store.dispatch(logout());
  }
}

App = process.env.NODE_ENV === 'development' ? hot(module)(App) : App;

export default App;
