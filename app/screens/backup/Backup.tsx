import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import routes from '../../routes';
import { BackButton } from '../../components/common';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
`;

const Backup = () => {
  const history = useHistory();
  return (
    <Wrapper>
      <BackButton action={history.goBack} />
      <Switch>
        {routes.backup.map((route) => (
          <Route
            exact
            key={route.path}
            path={route.path}
            component={route.component}
          />
        ))}
        <Redirect to="/main/backup/backup-options" />
      </Switch>
    </Wrapper>
  );
};

export default Backup;
