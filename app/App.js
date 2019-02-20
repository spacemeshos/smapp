import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import routes from './routes';

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          {Object.keys(routes).map(routeKey => <Route exact key={routeKey} path={routes[routeKey].path} component={routes[routeKey].component}/>)}
        </Switch>
      </Router>
    );
  }
}

export default App;
