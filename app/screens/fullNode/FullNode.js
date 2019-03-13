// @flow
import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';
import routes from '/routes';

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
          {routes.localNode.map((route) => (
            <Route key={route.path} path={route.path} component={route.component} />
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
