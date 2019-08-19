// @flow
import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import type { RouterHistory } from 'react-router-dom';
import routes from '/routes';
import styled from 'styled-components';
import { SecondaryButton } from '/basicComponents';
import { chevronLeftWhite } from '/assets/images';

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
        <SecondaryButton onClick={history.goBack} img={chevronLeftWhite} imgWidth={7} imgHeight={10} style={{ position: 'absolute', left: -35, bottom: 0 }} />
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

export default Backup;
