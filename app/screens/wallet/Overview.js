// @flow
import { clipboard, shell } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { getBalance, setCurrentAccount } from '/redux/wallet/actions';
import { AccountCards, BackupReminder, InitialLeftPane, ReceiveCoins } from '/components/wallet';
import { LatestTransactions } from '/components/transactions';
import { AddNewContactModal } from '/components/contacts';
import { SendReceiveButton } from '/basicComponents';
import { localStorageService } from '/infra/storageService';
import type { Account, Action } from '/types';
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
  accounts: Account[],
  currentAccountIndex: number,
  transactions: Object,
  getBalance: Action,
  setCurrentAccount: Action,
  fiatRate: number,
  hasBackup: boolean,
  history: RouterHistory
};

type State = {
  shouldShowReceiveCoinsModal: boolean,
  address?: string,
  shouldShowAddContactModal: boolean,
  isCopied: boolean
};

class Overview extends Component<Props, State> {
  copiedTimeout: any;

  state = {
    shouldShowReceiveCoinsModal: false,
    address: '',
    shouldShowAddContactModal: false,
    isCopied: false
  };

  render() {
    const { accounts, currentAccountIndex, transactions, fiatRate, hasBackup, setCurrentAccount } = this.props;
    const { shouldShowReceiveCoinsModal, shouldShowAddContactModal, address, isCopied } = this.state;
    const latestTransactions = transactions[currentAccountIndex] && transactions[currentAccountIndex].length > 0 ? transactions[currentAccountIndex].slice(0, 3) : null;
    return [
      <Wrapper key="main">
        <LeftSection>
          <AccountCards
            accounts={accounts}
            fiatRate={fiatRate}
            isCopied={isCopied}
            clickHandler={this.copyPublicAddress}
            currentAccountIndex={currentAccountIndex}
            switchAccount={setCurrentAccount}
          />
          <BackupReminder navigateToBackup={this.navigateToBackup} style={{ marginBottom: 20 }} hasBackup={hasBackup} />
          <ButtonsWrapper>
            <SendReceiveButton title={SendReceiveButton.titles.SEND} onPress={this.navigateToSendCoins} />
            <ButtonsSeparator />
            <SendReceiveButton title={SendReceiveButton.titles.RECEIVE} onPress={() => this.setState({ shouldShowReceiveCoinsModal: true })} />
          </ButtonsWrapper>
        </LeftSection>
        <RightSection>
          {latestTransactions ? (
            <LatestTransactions
              transactions={latestTransactions}
              addToContacts={({ address }) => this.setState({ address, shouldShowAddContactModal: true })}
              navigateToAllTransactions={this.navigateToAllTransactions}
            />
          ) : (
            <InitialLeftPane navigateToBackup={this.navigateToBackup} />
          )}
        </RightSection>
      </Wrapper>,
      shouldShowReceiveCoinsModal && (
        <ReceiveCoins
          key="receive_coins_modal"
          address={accounts[currentAccountIndex].pk}
          navigateToExplanation={this.navigateToReceiveCoinsExplanation}
          closeModal={() => this.setState({ shouldShowReceiveCoinsModal: false })}
        />
      ),
      shouldShowAddContactModal && (
        <AddNewContactModal
          key="add_contact_modal"
          addressToAdd={address}
          navigateToExplanation={this.navigateToContactsExplanation}
          onSave={() => this.setState({ address: '', shouldShowAddContactModal: false })}
          closeModal={() => this.setState({ shouldShowAddContactModal: false })}
        />
      )
    ];
  }

  componentDidMount() {
    // this.getBalance();
  }

  componentWillUnmount() {
    clearTimeout(this.copiedTimeout);
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

  copyPublicAddress = () => {
    const { accounts, currentAccountIndex } = this.props;
    clearTimeout(this.copiedTimeout);
    clipboard.writeText(accounts[currentAccountIndex].pk);
    this.copiedTimeout = setTimeout(() => this.setState({ isCopied: false }), 3000);
    this.setState({ isCopied: true });
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

  navigateToContactsExplanation = () => shell.openExternal('https://testnet.spacemesh.io'); // TODO: connect to actual link

  navigateToReceiveCoinsExplanation = () => shell.openExternal('https://testnet.spacemesh.io/#/get_coin');
}

const mapStateToProps = (state) => ({
  accounts: state.wallet.accounts,
  currentAccountIndex: state.wallet.currentAccountIndex,
  transactions: state.wallet.transactions,
  fiatRate: state.wallet.fiatRate,
  hasBackup: localStorageService.get('hasBackup')
});

const mapDispatchToProps = {
  getBalance,
  setCurrentAccount
};

Overview = connect(
  mapStateToProps,
  mapDispatchToProps
)(Overview);

export default Overview;
