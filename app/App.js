import React from 'react';
import { Switch, Route } from 'react-router';
import { routes } from './vars';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';

export default () => (
  <Switch>
    <Route path={routes.COUNTER} component={CounterPage} />
    <Route path={routes.HOME} component={HomePage} />
  </Switch>
);
