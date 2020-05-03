// @flow
import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import type { RouterHistory } from 'react-router-dom';
import routes from '/routes';
import styled from 'styled-components';
import { ScreenErrorBoundary } from '/components/errorHandler';
import { BackButton } from '/components/common';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
`;

type Props = {
  history: RouterHistory
};

class Backup extends Component<Props> {
  render() {
    const { history } = this.props;
    return (
      <Wrapper>
        <BackButton action={history.goBack} width={7} height={10} />
        <Switch>
          {routes.backup.map((route) => (
            <Route exact key={route.path} path={route.path} component={route.component} />
          ))}
          <Redirect to="/main/backup/backup-root" />
        </Switch>
      </Wrapper>
    );
  }
}

Backup = ScreenErrorBoundary(Backup);
export default Backup;
