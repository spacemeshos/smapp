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
`;

const BackButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

type Props = {
  history: RouterHistory
};

class Backup extends Component<Props> {
  render() {
    const { history } = this.props;
    return (
      <Wrapper>
        <BackButtonWrapper>
          <SecondaryButton onClick={history.goBack} imgName={chevronLeftWhite} imgWidth={7} imgHeight={10} style={{ marginRight: 10 }} />
        </BackButtonWrapper>
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
