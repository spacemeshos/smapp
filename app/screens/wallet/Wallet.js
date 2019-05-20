// @flow
import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import routes from '/routes';

type Props = {};

class Wallet extends Component<Props> {
  render() {
    return (
      <Switch>
        {routes.wallet.map((route) => (
          <Route exact key={route.path} path={route.path} component={route.component} />
        ))}
        <Redirect to="/main/wallet/overview" />
      </Switch>
    );
  }
}

export default Wallet;

// asfasdfadgsdgsdgsdg
