// @flow
import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Wallet, Overview } from '/screens';
import { SideMenu } from '/basicComponents';
import type { SideMenuItem } from '/basicComponents';
import routes from '/routes';
import { menu1, menu2, menu3, menu4, menu5, menu6 } from '/assets/images';

type Props = {
  history: any,
  wallet: { wallet: any, setupFullNode: boolean }
};

type State = {
  selectedItemIndex: number,
  loadingItemIndex: number
};

const styles = {
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flex: 1
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    width: '100%',
    height: '100%',
    flex: 1
  }
};

const sideMenuItems: SideMenuItem[] = [
  {
    text: 'Full Node',
    path: null,
    icon: menu1,
    disabled: true
  },
  {
    text: 'Wallet',
    path: '/main/wallet',
    icon: menu2
  },
  {
    text: 'Transaction',
    path: null,
    icon: menu3
  },
  {
    text: 'Contacts',
    path: null,
    icon: menu4
  },
  {
    text: 'Settings',
    path: null,
    icon: menu5,
    hasSeparator: true
  },
  {
    text: 'Network',
    path: '/main/story-book',
    icon: menu6
  }
];

class Main extends Component<Props, State> {
  timer: any;

  state: State = {
    selectedItemIndex: 1,
    loadingItemIndex: -1
  };

  render() {
    const { selectedItemIndex, loadingItemIndex } = this.state;

    return (
      <div style={styles.container}>
        <SideMenu items={sideMenuItems} selectedItemIndex={selectedItemIndex} onMenuItemPress={this.handleSideMenuPress} loadingItemIndex={loadingItemIndex} />
        <div style={styles.mainContent}>
          <Switch>
            {routes.main.map((route) => (
              <Route exact key={route.path} path={route.path} component={route.component} />
            ))}
            <Redirect to="/main/wallet" />
          </Switch>
        </div>
      </div>
    );
  }

  componentWillUnmount() {
    !!this.timer && clearTimeout(this.timer);
  }

  handleSideMenuPress = ({ index }: { index: number }) => {
    const { history } = this.props;
    const newPath = sideMenuItems[index].path;
    const isSameLocation = !!newPath && window.location.hash.endsWith(newPath);
    if (!isSameLocation && newPath) {
      this.setState({ selectedItemIndex: index });
      history.push(newPath);
    }
  };
}

export default Main;
