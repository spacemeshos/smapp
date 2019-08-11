// @flow
import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { readWalletFiles } from '/redux/wallet/actions';
import { ScreenErrorBoundary } from '/components/errorHandler';
import { BaseWrapper, Loader } from '/basicComponents';
import routes from '/routes';
import type { Action } from '/types';
import type { RouterHistory } from 'react-router-dom';

type Props = {
  history: RouterHistory,
  readWalletFiles: Action,
  walletFiles: Array<string>,
  location: { state?: { presetMode: number } }
};

class Auth extends Component<Props> {
  render() {
    const { walletFiles } = this.props;
    return (
      <BaseWrapper>
        {walletFiles ? (
          <Switch>
            {routes.auth.map((route) => (
              <Route exact key={route.path} path={route.path} component={route.component} />
            ))}
            <Redirect to="/auth/welcome" />
          </Switch>
        ) : (
          <Loader size={Loader.sizes.BIG} />
        )}
      </BaseWrapper>
    );
  }

  async componentDidMount() {
    const { readWalletFiles, history } = this.props;
    try {
      const files = await readWalletFiles();
      if (files.length) {
        history.push('/auth/unlock');
      }
    } catch (error) {
      this.setState(() => {
        throw error;
      });
    }
  }
}

const mapStateToProps = (state) => ({
  walletFiles: state.wallet.walletFiles
});

const mapDispatchToProps = {
  readWalletFiles
};

Auth = connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth);

Auth = ScreenErrorBoundary(Auth, true);
export default Auth;
