import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import routes from './routes';
import GlobalStyle from './globalStyle';
import type { Store } from './redux/types';

const App = ({ store }: { store: Store }) => (
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

export default App;
