import React from 'react';
import { Redirect, Route, Switch, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import routes from '../../routes';
import { BackButton } from '../../components/common';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
`;

const Backup = ({ history }: RouteComponentProps) => (
  <Wrapper>
    <BackButton action={history.goBack} width={7} height={10} />
    <Switch>
      {routes.backup.map((route) => (
        <Route exact key={route.path} path={route.path} component={route.component} />
      ))}
      <Redirect to="/main/backup/backup-options" />
    </Switch>
  </Wrapper>
);

export default Backup;
