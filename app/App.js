import React from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import routes from './routes';

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          {Object.keys(routes).map((routeKey) => (
            <Route key={routeKey} path={routes[routeKey].path} component={routes[routeKey].component} />
          ))}
          <Redirect to="/auth" />
        </Switch>
      </Router>
    );
  }
}

export default App;
