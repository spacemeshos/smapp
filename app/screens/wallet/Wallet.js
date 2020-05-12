// @flow
import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import routes from '/routes';
import { AccountsOverview } from '/components/wallet';
import { ScreenErrorBoundary } from '/components/errorHandler';
import { CorneredWrapper, SmallHorizontalPanel } from '/basicComponents';
import { localStorageService } from '/infra/storageService';
import smColors from '/vars/colors';
import { backup, leftSideTIcon } from '/assets/images';
import type { RouterHistory } from 'react-router-dom';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 10px;
`;

const BackupReminder = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: flex-end;
  width: 230px;
  height: 50px;
  margin-top: 10px;
  padding: 0 15px;
  background-color: ${smColors.black02Alpha};
  cursor: pointer;
`;

const BackupImage = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 15px;
  cursor: inherit;
`;

const BackupText = styled.div`
  font-size: 15px;
  line-height: 20px;
  color: ${smColors.orange};
  cursor: inherit;
`;

const FullCrossIcon = styled.img`
  position: absolute;
  top: -11px;
  right: -13px;
  width: 12px;
  height: 12px;
`;

const RightSection = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  height: 100%;
`;

type Props = {
  history: RouterHistory
};

type State = {
  shouldShowReceiveCoinsModal: boolean,
  address?: string,
  shouldShowAddContactModal: boolean,
  isCopied: boolean
};

class Wallet extends Component<Props, State> {
  render() {
    const hasBackup = !!localStorageService.get('hasBackup');
    return (
      <Wrapper>
        <LeftSection>
          <AccountsOverview />
          {!hasBackup && (
            <BackupReminder onClick={this.navigateToBackup}>
              <FullCrossIcon src={leftSideTIcon} />
              <BackupImage src={backup} />
              <BackupText>BACKUP YOUR WALLET</BackupText>
            </BackupReminder>
          )}
        </LeftSection>
        <CorneredWrapper>
          <RightSection>
            <SmallHorizontalPanel />
            <Switch>
              {routes.wallet.map((route) => (
                <Route exact key={route.path} path={route.path} component={route.component} />
              ))}
              <Redirect to="/main/wallet/overview" />
            </Switch>
          </RightSection>
        </CorneredWrapper>
      </Wrapper>
    );
  }

  navigateToBackup = () => {
    const { history } = this.props;
    history.push('/main/backup');
  };
}

Wallet = ScreenErrorBoundary(Wallet);
export default Wallet;
