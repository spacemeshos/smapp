// @flow
import { hot, setConfig } from 'react-hot-loader';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { logout } from '/redux/auth/actions';
import routes from './routes';
import GlobalStyle from './globalStyle';
import type { Store } from '/types';

const configOptions: $Shape<Object> = {
  showReactDomPatchNotification: false
};

setConfig(configOptions);

type Props = {
  store: Store
};

class App extends React.Component<Props> {
  render() {
    const { store } = this.props;
    return (
      <React.Fragment>
        <GlobalStyle />
        <Provider store={store}>
          <Router>
            <Switch>
              {routes.app.map((route) => (
                <Route key={route.path} path={route.path} component={route.component} />
              ))}
              <Redirect to="/auth" />
            </Switch>
          </Router>
        </Provider>
      </React.Fragment>
    );
  }

  componentWillUnmount(): void {
    const { store } = this.props;
    store.dispatch(logout());
  }
}

const ExportedApp = process.env.NODE_ENV === 'development' ? hot(module)(App) : App;

export default ExportedApp;
