// @flow
import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from './Home';

type HomeProps = {};

const routes = {
  WELCOME: {
    path: '/home',
    component: Home
  }
  // WELCOME: {
  //   path: '/login',
  //   component: Login
  // }
};

class HomeRoot extends Component<HomeProps> {
  render() {
    return (
      <Switch>
        {Object.keys(routes).map((routeKey) => (
          <Route exact key={routeKey} path={routes[routeKey].path} component={routes[routeKey].component} />
        ))}
        <Redirect to={routes.WELCOME.path} />
      </Switch>
    );
  }
}

export default HomeRoot;
