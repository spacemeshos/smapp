// @flow
import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { logout } from '/redux/wallet/actions';
import StoryBook from '/components/StoryBook';
import { Wallet } from '/screens';
import { SideMenu } from '/basicComponents';
import type { SideMenuItem } from '/basicComponents';
import { menu1, menu2, menu3, menu4, menu5, menu6 } from '/assets/images';
import routes from '/routes';

type Props = {
  history: any,
  logout: Function,
  wallet: { wallet: any, setupFullNode: boolean }
};

type State = {
  selectedItemIndex: number,
  loadingItemIndex: number
};

const sideMenuItems: SideMenuItem[] = [
  {
    text: 'Local Node',
    path: '/main/local-node',
    icon: menu1
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

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex: 1;
  overflow: hidden;
`;

const MainContentWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;
    width: 100%;
    height: 100%;
    flex: 1;
    overflow: scroll;
`;

class Main extends Component<Props, State> {
  timer: any;

  state: State = {
    selectedItemIndex: 1,
    loadingItemIndex: -1
  };

  render() {
    const { selectedItemIndex, loadingItemIndex } = this.state;

    return (
      <Container>
        <SideMenu items={sideMenuItems} selectedItemIndex={selectedItemIndex} onMenuItemPress={this.handleSideMenuPress} loadingItemIndex={loadingItemIndex} />
        <MainContentWrapper>
          <Switch>
            {routes.main.map((route) => (
              <Route key={route.path} path={route.path} component={route.component} />
            ))}
            <Redirect to="/main/wallet" />
          </Switch>
        </MainContentWrapper>
      </Container>
    );
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

const mapDispatchToProps = {
  logout
};

Main = connect(
  null,
  mapDispatchToProps
)(Main);

export default Main;
