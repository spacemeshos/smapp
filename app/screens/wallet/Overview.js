// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { getBalance, addToContacts } from '/redux/wallet/actions';
import { AccountCard, BackupReminder, InitialLeftPane, ReceiveCoins } from '/components/wallet';
import { LatestTransactions } from '/components/transactions';
import { SendReceiveButton } from '/basicComponents';
import type { Account, Action, TxList } from '/types';
import type { RouterHistory } from 'react-router-dom';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  padding: 50px;
`;

const LeftSection = styled.div`
  height: 100%;
  display: flex;
  flex: 2;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-right: 50px;
`;

const ButtonsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0 20px;
`;

const ButtonsSeparator = styled.div`
  height: 100%;
  width: 20px;
`;

const RightSection = styled.div`
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
`;

type Props = {
  currentAccount: Account,
  currentAccTransactions: TxList,
  getBalance: Action,
  addToContacts: Action,
  fiatRate: number,
  history: RouterHistory
};

type State = {
  shouldShowModal: boolean
};

class Overview extends Component<Props, State> {
  state = {
    shouldShowModal: false
  };

  render() {
    const { currentAccount, currentAccTransactions, fiatRate, addToContacts } = this.props;
    const { shouldShowModal } = this.state;
    const latestTransactions = currentAccTransactions && currentAccTransactions.length > 0 ? currentAccTransactions.slice(0, 3) : null;
    return [
      <Wrapper key="main">
        <LeftSection>
          {currentAccount && <AccountCard account={currentAccount} fiatRate={fiatRate} style={{ marginBottom: 20 }} />}
          <BackupReminder navigateToBackup={this.navigateToBackup} style={{ marginBottom: 20 }} />
          <ButtonsWrapper>
            <SendReceiveButton title={SendReceiveButton.titles.SEND} onPress={this.navigateToSendCoins} />
            <ButtonsSeparator />
            <SendReceiveButton title={SendReceiveButton.titles.RECEIVE} onPress={() => this.setState({ shouldShowModal: true })} />
          </ButtonsWrapper>
        </LeftSection>
        <RightSection>
          {latestTransactions ? (
            <LatestTransactions transactions={latestTransactions} addToContacts={addToContacts} navigateToAllTransactions={this.navigateToAllTransactions} />
          ) : (
            <InitialLeftPane navigateToBackup={this.navigateToBackup} />
          )}
        </RightSection>
      </Wrapper>,
      shouldShowModal && <ReceiveCoins key="modal" address={currentAccount.pk} closeModal={() => this.setState({ shouldShowModal: false })} />
    ];
  }

  componentDidMount(): void {
    // this.getBalance();
  }

  getBalance = async () => {
    const { getBalance } = this.props;
    await getBalance();
  };

  navigateToSendCoins = () => {
    const { history } = this.props;
    history.push('/main/wallet/sendCoins');
  };

  navigateToBackup = () => {
    const { history } = this.props;
    history.push('/main/wallet/backup');
  };

  navigateToAllTransactions = () => {
    const { history } = this.props;
    history.push('/main/transactions');
  };
}

const mapStateToProps = (state) => ({
  currentAccount: state.wallet.accounts[state.wallet.currentAccountIndex],
  currentAccTransactions: state.wallet.transactions[state.wallet.currentAccountIndex],
  fiatRate: state.wallet.fiatRate
});

const mapDispatchToProps = {
  getBalance,
  addToContacts
};

Overview = connect(
  mapStateToProps,
  mapDispatchToProps
)(Overview);

export default Overview;
