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

// 7be017a967db77fd10ac7c891b3d6d946dea7e3e14756e2f0f9e09b9663f0d9c
// 81c90dd832e18d1cf9758254327cb3135961af6688ac9c2a8c5d71f73acc5ce57be017a967db77fd10ac7c891b3d6d946dea7e3e14756e2f0f9e09b9663f0d9c
