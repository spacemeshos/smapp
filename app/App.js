import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router';
import routes from './constants/routes';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';

export default () => (
  <BrowserRouter>
    <Switch>
      <Route path={routes.COUNTER} component={CounterPage} />
      <Route path={routes.HOME} component={HomePage} />
    </Switch>
  </BrowserRouter>
);
