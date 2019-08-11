// @flow
import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import routes from '/routes';
import { connect } from 'react-redux';
import { getBalance, setCurrentAccount } from '/redux/wallet/actions';
import { AccountCards } from '/components/wallet';
import { ScreenErrorBoundary } from '/components/errorHandler';
import { localStorageService } from '/infra/storageService';
import smColors from '/vars/colors';
import { backup, leftSideTIcon, bottomLeftCorner, bottomRightCorner, topLeftCorner, topRightCorner, smallHorizontalSideBar } from '/assets/images';
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
`;

const TopLeftCorner = styled.img`
  position: absolute;
  top: -5px;
  left: -5px;
  width: 8px;
  height: 8px;
`;

const TopRightCorner = styled.img`
  position: absolute;
  top: -5px;
  right: -5px;
  width: 8px;
  height: 8px;
`;

const BottomLeftCorner = styled.img`
  position: absolute;
  bottom: -5px;
  left: -5px;
  width: 8px;
  height: 8px;
`;

const BottomRightCorner = styled.img`
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 8px;
  height: 8px;
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
          <AccountCards accounts={accounts} currentAccountIndex={currentAccountIndex} switchAccount={setCurrentAccount} />
          {!hasBackup && (
            <BackupReminder onClick={this.navigateToBackup}>
              <FullCrossIcon src={leftSideTIcon} />
              <BackupImage src={backup} />
              <BackupText>BACKUP YOUR WALLET</BackupText>
            </BackupReminder>
          )}
        </LeftSection>
        <RightSection>
          <TopLeftCorner src={topLeftCorner} />
          <TopRightCorner src={topRightCorner} />
          <BottomLeftCorner src={bottomLeftCorner} />
          <BottomRightCorner src={bottomRightCorner} />
          <HorizontalBar src={smallHorizontalSideBar} />
          <Switch>
            {routes.wallet.map((route) => (
              <Route exact key={route.path} path={route.path} component={route.component} />
            ))}
            <Redirect to="/main/wallet/overview" />
          </Switch>
        </RightSection>
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
