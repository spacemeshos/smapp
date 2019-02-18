import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { routes } from './vars';
import HomePage from './screens/HomePage';
import CounterPage from './screens/CounterPage';

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path={routes.COUNTER} component={CounterPage} />
          <Route path={routes.HOME} component={HomePage} />
        </Switch>
      </Router>
    );
  }
}

export default App;
