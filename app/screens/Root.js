// @flow
import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '/redux/wallet/actions';
import StoryBook from '/components/StoryBook';
import { Wallet } from '/screens';
import { SideMenu } from '/basicComponents';
import type { SideMenuItem } from '/basicComponents';
import { menu1, menu2, menu3, menu4, menu5, menu6 } from '/assets/images';

type Props = {
  history: any,
  logout: Function,
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

const sideMenuItems: SideMenuItem[] = [
  {
    text: 'Full Node',
    path: null,
    icon: menu1,
    disabled: true
  },
  {
    text: 'Wallet',
    path: '/root/wallet',
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
    path: '/root/story-book',
    icon: menu6
  }
];

class Root extends Component<Props, State> {
  timer: any;

  state: State = {
    selectedItemIndex: 2,
    loadingItemIndex: -1
  };

  render() {
    const { selectedItemIndex, loadingItemIndex } = this.state;

    return (
      <div style={styles.container}>
        <SideMenu items={sideMenuItems} selectedItemIndex={selectedItemIndex} onMenuItemPress={this.handleSideMenuPress} loadingItemIndex={loadingItemIndex} />
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
      this.setState({ loadingItemIndex: 1 }, () => {
        this.timer = setTimeout(() => {
          this.setState({
            loadingItemIndex: -1
          });
        }, 8000);
      });
    }
  }

  componentWillUnmount() {
    const { logout } = this.props;
    logout();
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

const mapStateToProps = (state) => ({
  wallet: state.wallet
});

const mapDispatchToProps = {
  logout
};

Root = connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);

export default Root;
