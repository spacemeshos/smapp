// @flow
import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { getBalance, setCurrentAccount } from '/redux/wallet/actions';
import routes from '/routes';
import { AccountsOverview } from '/components/wallet';
import { ScreenErrorBoundary } from '/components/errorHandler';
import { CorneredWrapper } from '/basicComponents';
import { localStorageService } from '/infra/storageService';
import smColors from '/vars/colors';
import { backup, leftSideTIcon, smallHorizontalSideBar } from '/assets/images';
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
  right: -9px;
  width: 12px;
  height: 12px;
`;

const RightSection = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  height: 100%;
`;

const HorizontalBar = styled.img`
  position: absolute;
  top: -25px;
  right: 0;
  width: 70px;
  height: 15px;
`;

type Props = {
  accounts: Account[],
  currentAccountIndex: number,
  getBalance: Action,
  setCurrentAccount: Action,
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
    const { accounts, currentAccountIndex, setCurrentAccount } = this.props;
    const hasBackup = !!localStorageService.get('hasBackup');
    return (
      <Wrapper>
        <LeftSection>
          <AccountsOverview accounts={accounts} currentAccountIndex={currentAccountIndex} switchAccount={setCurrentAccount} />
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
            <HorizontalBar src={smallHorizontalSideBar} />
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

  componentDidMount() {
    // this.getBalance();
  }

  getBalance = async () => {
    const { getBalance } = this.props;
    try {
      await getBalance();
    } catch (error) {
      this.setState(() => {
        throw error;
      });
    }
  };

  navigateToBackup = () => {
    const { history } = this.props;
    history.push('/main/backup');
  };
}

const mapStateToProps = (state) => ({
  accounts: state.wallet.accounts,
  currentAccountIndex: state.wallet.currentAccountIndex
});

const mapDispatchToProps = {
  getBalance,
  setCurrentAccount
};

Wallet = connect(
  mapStateToProps,
  mapDispatchToProps
)(Wallet);

Wallet = ScreenErrorBoundary(Wallet);
export default Wallet;

// '7be017a967db77fd10ac7c891b3d6d946dea7e3e14756e2f0f9e09b9663f0d9c'
// '81c90dd832e18d1cf9758254327cb3135961af6688ac9c2a8c5d71f73acc5ce57be017a967db77fd10ac7c891b3d6d946dea7e3e14756e2f0f9e09b9663f0d9c'
