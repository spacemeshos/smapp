// @flow
import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';
import routes from '/routes';

type LocalNodeProps = {
  wallet: any,
  localNode: any
};

type LocalNodeState = {};

const Container = styled.div`
  padding: 58px 90px;
  width: 100%;
  height: inherit;
`;

class LocalNode extends Component<LocalNodeProps, LocalNodeState> {
  render() {
    const { wallet, localNode } = this.props;
    // TODO: set local node statup status
    const mode: 'setup' | 'ready' = 'ready';
    const initialPath = `/root/local-node/local-node${mode === 'setup' ? '-setup' : '-ready'}`;
    // eslint-disable-next-line no-console
    console.log('mode', mode, 'initial', initialPath, 'wallet', wallet, 'localNode', localNode);
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
  localNode: state.localNode
});

LocalNode = connect(mapStateToProps)(LocalNode);

export default LocalNode;
