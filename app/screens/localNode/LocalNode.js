// @flow
import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import routes from '/routes';

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 60px 90px;
`;

class LocalNode extends Component<{}> {
  render() {
    // TODO: set local node startup status
    const mode: 'setup' | 'ready' = 'setup';
    const initialPath = `/main/local-node/local-node${mode === 'setup' ? '-setup' : '-ready'}`;
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

export default LocalNode;
