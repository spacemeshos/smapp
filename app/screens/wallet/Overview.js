// @flow
import { shell } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { getBalance, setCurrentAccount, getTxList } from '/redux/wallet/actions';
import { AccountCards, BackupReminder, InitialLeftPane, ReceiveCoins } from '/components/wallet';
import { LatestTransactions } from '/components/transactions';
import { Button, Link } from '/basicComponents';
import { sendIcon, requestIcon } from '/assets/images';
import smColors from '/vars/colors';
import type { RouterHistory } from 'react-router-dom';
import type { Account } from '/types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const MiddleSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 350px;
  height: 100%;
  margin-right: 10px;
  padding: 25px 15px;
  background-color: ${smColors.black02Alpha};
`;

const MiddleSectionHeader = styled.div`
  margin-bottom: 10px;
  font-family: SourceCodeProBold;
  font-size: 16px;
  line-height: 20px;
  color: ${smColors.black};
`;

const MiddleSectionText = styled.div`
  flex: 1;
  font-size: 16px;
  line-height: 20px;
  color: ${smColors.black};
`;

type Props = {
  account: Account,
  currentAccountIndex: number,
  transactions: Object,
  getBalance: Action,
  setCurrentAccount: Action,
  getTxList: Action,
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
  txListInterval: any;

  copiedTimeout: any;

  state = {
    shouldShowReceiveCoinsModal: false,
    address: '',
    shouldShowAddContactModal: false,
    isCopied: false
  };

  render() {
    const { currentAccountIndex, transactions } = this.props;
    const latestTransactions = transactions[currentAccountIndex] && transactions[currentAccountIndex].length > 0 ? transactions[currentAccountIndex].slice(0, 3) : [];
    return (
      <Wrapper>
        <MiddleSection>
          <MiddleSectionHeader>
            send/request
            <br />
            --
          </MiddleSectionHeader>
          <MiddleSectionText>Send or request SMC to / from anyone in your contacts list or by using their address</MiddleSectionText>
          <Button onClick={this.navigateToSendCoins} text="SEND" isPrimary={false} width={225} img={sendIcon} imgPosition="after" style={{ marginBottom: 20 }} />
          <Button onClick={this.navigateToRequestCoins} text="REQUEST" isPrimary={false} img={requestIcon} imgPosition="after" width={225} style={{ marginBottom: 35 }} />
          <Link onClick={this.navigateToWalletGuide} text="WALLET GUIDE" style={{ marginRight: 'auto' }} />
        </MiddleSection>
        <LatestTransactions transactions={latestTransactions} navigateToAllTransactions={this.navigateToAllTransactions} />
      </Wrapper>
    );
    const { accounts, currentAccountIndex, transactions, fiatRate, hasBackup } = this.props;
    const { shouldShowReceiveCoinsModal, shouldShowAddContactModal, address, isCopied } = this.state;
    const latestTransactions = transactions[currentAccountIndex] && transactions[currentAccountIndex].data.length > 0 ? transactions[currentAccountIndex].data.slice(0, 3) : null;
    return [
      <Wrapper key="main">
        <LeftSection>
          <AccountCards
            accounts={accounts}
            fiatRate={fiatRate}
            isCopied={isCopied}
            clickHandler={this.copyPublicAddress}
            currentAccountIndex={currentAccountIndex}
            switchAccount={this.switchAccount}
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
    // const { getTxList } = this.props;
    // this.getBalance();
    // getTxList();
    // this.txListInterval = setInterval(getTxList, 50000);
  }

  componentWillUnmount() {
    clearTimeout(this.copiedTimeout);
    clearInterval(this.txListInterval);
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

  switchAccount = ({ index }: { index: number }) => {
    const { setCurrentAccount, getTxList } = this.props;
    clearInterval(this.txListInterval);
    setCurrentAccount({ index });
    getTxList();
    this.txListInterval = setInterval(getTxList, 50000);
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
    history.push('/main/wallet/send-coins');
  };

  navigateToRequestCoins = () => {
    const { history, account } = this.props;
    history.push('/main/wallet/request-coins', { account });
  };

  navigateToAllTransactions = () => {
    const { history } = this.props;
    history.push('/main/transactions');
  };

  navigateToWalletGuide = () => shell.openExternal('https://testnet.spacemesh.io/#/wallet');
}

const mapStateToProps = (state) => ({
  account: state.wallet.accounts[state.wallet.currentAccountIndex],
  currentAccountIndex: state.wallet.currentAccountIndex,
  transactions: state.wallet.transactions
});

const mapDispatchToProps = {
  getBalance,
  setCurrentAccount,
  getTxList
};

Overview = connect(
  mapStateToProps,
  mapDispatchToProps
)(Overview);

Overview = connect<any, any, _, _, _, _>(mapStateToProps)(Overview);
export default Overview;
