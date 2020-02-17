// @flow
import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { getBalance, setCurrentAccount } from '/redux/wallet/actions';
import routes from '/routes';
import { AccountsOverview } from '/components/wallet';
import { ScreenErrorBoundary } from '/components/errorHandler';
import { CorneredWrapper, SmallHorizontalPanel } from '/basicComponents';
import { localStorageService } from '/infra/storageService';
import smColors from '/vars/colors';
import { backup, leftSideTIcon } from '/assets/images';
import type { Account, Action } from '/types';
import type { RouterHistory } from 'react-router-dom';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
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
  width: 100%;
  height: 50px;
  margin-top: 10px;
  padding-left: 25px;
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
  displayName: string,
  accounts: Account[],
  currentAccountIndex: number,
  getBalance: Action,
  setCurrentAccount: Action,
  status: Object,
  history: RouterHistory
};

type State = {
  shouldShowReceiveCoinsModal: boolean,
  address?: string,
  shouldShowAddContactModal: boolean,
  isCopied: boolean
};

class Wallet extends Component<Props, State> {
  getBalanceInterval: IntervalID;

  render() {
    const { status, displayName, accounts, currentAccountIndex, setCurrentAccount } = this.props;
    const hasBackup = !!localStorageService.get('hasBackup');
    return (
      <Wrapper>
        <LeftSection>
          <AccountsOverview status={status} walletName={displayName} accounts={accounts} currentAccountIndex={currentAccountIndex} switchAccount={setCurrentAccount} />
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

  async componentDidMount() {
    const { status, getBalance } = this.props;
    if (status) {
      try {
        await getBalance();
        this.getBalanceInterval = setInterval(async () => {
          await getBalance();
        }, 30000);
      } catch (error) {
        this.setState(() => {
          throw error;
        });
      }
    }
  }

  componentWillUnmount() {
    this.getBalanceInterval && clearInterval(this.getBalanceInterval);
  }

  navigateToBackup = () => {
    const { history } = this.props;
    history.push('/main/backup');
  };
}

const mapStateToProps = (state) => ({
  status: state.node.status,
  displayName: state.wallet.meta.displayName,
  accounts: state.wallet.accounts,
  currentAccountIndex: state.wallet.currentAccountIndex
});

const mapDispatchToProps = {
  getBalance,
  setCurrentAccount
};

Wallet = connect(mapStateToProps, mapDispatchToProps)(Wallet);

Wallet = ScreenErrorBoundary(Wallet);
export default Wallet;
