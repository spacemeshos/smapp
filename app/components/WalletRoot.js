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
  isFullNodeLoading: boolean
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
    isFullNodeLoading: false
  };

  render() {
    const { isFullNodeLoading } = this.state;
    const loadingEntry: LoadingEntry = { id: 1, isLoading: isFullNodeLoading };

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
      this.setState({ isFullNodeLoading: true }, () => {
        this.timer = setTimeout(() => {
          this.setState({
            isFullNodeLoading: false
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
    const isSameLocation = selection.path && window.location.hash.endsWith(selection.path);
    if (!isSameLocation && selection.path) {
      history.push(selection.path);
    }
  };
}
