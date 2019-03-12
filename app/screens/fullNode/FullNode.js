// @flow
import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';
import FullNodeSetupPage from '/components/fullNode/FullNodeSetupPage';
import FullNodeLoadingPage from '/components/fullNode/FullNodeLoadingPage';
import FullNodePage from '/components/fullNode/FullNodePage';

type FullNodeProps = {
  wallet: any,
  fullNode: any
};

type FullNodeState = {};

const Container = styled.div`
  padding: 58px 90px;
  width: 100%;
  height: inherit;
`;

const routes = {
  fullNode: {
    SETUP: {
      path: '/root/full-node/full-node-setup',
      component: FullNodeSetupPage
    },
    LOADING: {
      path: '/root/full-node/full-node-loading',
      component: FullNodeLoadingPage
    },
    READY: {
      path: '/root/full-node/full-node-ready',
      component: FullNodePage
    }
  }
};

class FullNode extends Component<FullNodeProps, FullNodeState> {
  render() {
    const { wallet, fullNode } = this.props;
    // TODO: set full node statup status
    const mode: 'setup' | 'ready' = 'setup';
    const initialPath = `/root/full-node/full-node${mode === 'setup' ? '-setup' : '-ready'}`;
    // eslint-disable-next-line no-console
    console.log('mode', mode, 'initial', initialPath, 'wallet', wallet, 'fullNode', fullNode);
    return (
      <Container>
        <Switch>
          {Object.keys(routes.fullNode).map((routeKey) => (
            <Route key={routeKey} path={routes.fullNode[routeKey].path} component={routes.fullNode[routeKey].component} />
          ))}
          <Redirect to={initialPath} />
        </Switch>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  wallet: state.wallet,
  fullNode: state.fullNode
});

FullNode = connect(mapStateToProps)(FullNode);

export default FullNode;
