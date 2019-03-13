// @flow
import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { setLogout } from '/redux/wallet/actions';
import routes from '/routes';
import { SideMenu } from '/basicComponents';
import type { SideMenuItem } from '/basicComponents';
import { menu1, menu2, menu3, menu4, menu5, menu6 } from '/assets/images';

type Props = {
  history: any,
  wallet: { wallet: any, setupFullNode: boolean }
};

type State = {
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
    path: '/root/full-node',
    icon: menu1
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
    loadingItemIndex: -1
  };

  render() {
    const { loadingItemIndex } = this.state;

    return (
      <div style={styles.container}>
        <SideMenu items={sideMenuItems} initialItemIndex={-1} onMenuItemPress={this.handleSideMenuPress} loadingItemIndex={loadingItemIndex} />
        <div style={styles.mainContent}>
          <Switch>
            {routes.main.map((route) => (
              <Route key={route.path} path={route.path} component={route.component} />
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
    !!this.timer && clearTimeout(this.timer);
  }

  handleSideMenuPress = ({ index }: { index: number }) => {
    const { history } = this.props;
    const newPath = sideMenuItems[index].path;
    const isSameLocation = !!newPath && window.location.hash.endsWith(newPath);
    if (!isSameLocation && newPath) {
      history.push(newPath);
    }
  };
}

const mapStateToProps = (state) => ({
  wallet: state.wallet
});

const mapDispatchToProps = {
  setLogout
};

Root = connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);

export default Root;
