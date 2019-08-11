// @flow
import { shell } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
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
  history: RouterHistory
};

type State = {
  shouldShowReceiveCoinsModal: boolean,
  address?: string,
  shouldShowAddContactModal: boolean,
  isCopied: boolean
};

class Overview extends Component<Props, State> {
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
          <Link onClick={this.navigateToWalletGuide} text="WALLET GUIDE" />
        </MiddleSection>
        <LatestTransactions transactions={latestTransactions} navigateToAllTransactions={this.navigateToAllTransactions} />
      </Wrapper>
    );
  }

  navigateToSendCoins = () => {
    const { history } = this.props;
    history.push('/main/wallet/sendCoins');
  };

  navigateToRequestCoins = () => {
    const { history, account } = this.props;
    history.push('/main/wallet/requestCoins', { account });
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

Overview = connect<any, any, _, _, _, _>(mapStateToProps)(Overview);
export default Overview;
