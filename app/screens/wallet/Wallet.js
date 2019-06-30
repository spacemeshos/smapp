// @flow
import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import routes from '/routes';
import { ScreenErrorBoundary } from '/components/errorHandler';

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

Wallet = ScreenErrorBoundary(Wallet);
export default Wallet;
