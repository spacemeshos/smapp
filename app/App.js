import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { readWalletFiles, logout } from '/redux/auth/actions';
import routes from './routes';
import GlobalStyle from './globalStyle';
import type { Store } from '/types';

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
              {Object.keys(routes).map((routeKey) => (
                <Route key={routeKey} path={routes[routeKey].path} component={routes[routeKey].component} />
              ))}
              <Redirect to="/auth" />
            </Switch>
          </Router>
        </Provider>
      </React.Fragment>
    );
  }

  componentDidMount(): void {
    const { store } = this.props;
    store.dispatch(readWalletFiles());
  }

  componentWillUnmount(): void {
    const { store } = this.props;
    store.dispatch(logout());
  }
}

export default App;
