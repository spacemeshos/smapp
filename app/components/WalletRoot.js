// @flow
import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import SideMenu from '../baseComponents/SideMenu/SideMenu';
import type { SideMenuEntry, LoadingEntry } from '../baseComponents/SideMenu/SideMenu';
import StoryBook from './StoryBook';
import Wallet from './Wallet/Wallet';

type WalletRootProps = {
  history: any,
  wallet: { wallet: any, setupFullNode: boolean }
};
type WalletRootState = {
  fullNodeLoading: boolean
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    width: '100%',
    height: '100%'
  }
};

const routes = {
  STORYBOOK: {
    path: '/root/story-book',
    component: StoryBook
  },
  WALLET: {
    path: '/root/wallet',
    component: Wallet
  }
};

export default class WalletRoot extends Component<WalletRootProps, WalletRootState> {
  props: WalletRootProps;

  timer: any;

  state: WalletRootState = {
    fullNodeLoading: false
  };

  render() {
    const { fullNodeLoading } = this.state;
    const loadingEntry: LoadingEntry = { id: 1, isLoading: fullNodeLoading };

    return (
      <div style={styles.container}>
        <SideMenu onInitSelectedId={2} onPress={this.handleSideMenuPress} loadingEntry={loadingEntry} />
        <div style={styles.mainContent}>
          <Switch>
            {Object.keys(routes).map((routeKey) => (
              <Route exact key={routeKey} path={routes[routeKey].path} component={routes[routeKey].component} />
            ))}
            <Redirect to="/root/wallet" />
          </Switch>
        </div>
      </div>
    );
  }

  componentDidMount() {
    const { wallet } = this.props;
    if (wallet.setupFullNode) {
      this.setState({ fullNodeLoading: true }, () => {
        this.timer = setTimeout(() => {
          this.setState({
            fullNodeLoading: false
          });
        }, 8000);
      });
    }
  }

  componentWillUnmount() {
    !!this.timer && clearTimeout(this.timer);
  }

  handleSideMenuPress = (selection: SideMenuEntry) => {
    const { history } = this.props;
    if (selection.path) {
      history.push(selection.path);
    }
  };
}
