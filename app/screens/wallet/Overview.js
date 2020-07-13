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

const isDarkModeOn = localStorage.getItem('dmMode') === 'true';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const MiddleSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 450px;
  height: 100%;
  margin-right: 10px;
  padding: 25px 15px;
  background-color: ${isDarkModeOn ? smColors.dmBlack2 : smColors.black02Alpha};
`;

const MiddleSectionHeader = styled.div`
  margin-bottom: 10px;
  font-family: SourceCodeProBold;
  font-size: 16px;
  line-height: 20px;
  color: ${isDarkModeOn ? smColors.white : smColors.black};
`;

const MiddleSectionText = styled.div`
  flex: 1;
  font-size: 15px;
  line-height: 20px;
  color: ${isDarkModeOn ? smColors.white : smColors.black};
`;

type Props = {
  account: Account,
  history: RouterHistory,
  miningStatus: string
};

type State = {
  shouldShowReceiveCoinsModal: boolean,
  address?: string,
  shouldShowAddContactModal: boolean,
  isCopied: boolean
};

class Overview extends Component<Props, State> {
  render() {
    const { account } = this.props;
    return (
      <Wrapper>
        <MiddleSection>
          <MiddleSectionHeader>
            Send or Request
            <br />
            --
          </MiddleSectionHeader>
          <MiddleSectionText>Send SMH to anyone, or request to receive SMH.</MiddleSectionText>
          <Button onClick={this.navigateToSendCoins} text="SEND" isPrimary={false} width={225} img={sendIcon} imgPosition="after" style={{ marginBottom: 20 }} />
          <Button onClick={this.navigateToRequestCoins} text="REQUEST" isPrimary={false} img={requestIcon} imgPosition="after" width={225} style={{ marginBottom: 35 }} />
          <Link onClick={this.navigateToWalletGuide} text="WALLET GUIDE" style={{ marginRight: 'auto' }} />
        </MiddleSection>
        <LatestTransactions publicKey={account.publicKey} navigateToAllTransactions={this.navigateToAllTransactions} />
      </Wrapper>
    );
  }

  navigateToSendCoins = () => {
    const { history } = this.props;
    history.push('/main/wallet/send-coins');
  };

  navigateToRequestCoins = () => {
    const { history, account, miningStatus } = this.props;
    history.push('/main/wallet/request-coins', { account, miningStatus });
  };

  navigateToAllTransactions = () => {
    const { history } = this.props;
    history.push('/main/transactions');
  };

  navigateToWalletGuide = () => shell.openExternal('https://testnet.spacemesh.io/#/wallet');
}

const mapStateToProps = (state) => ({
  account: state.wallet.accounts[state.wallet.currentAccountIndex],
  miningStatus: state.node.miningStatus
});

Overview = connect<any, any, _, _, _, _>(mapStateToProps)(Overview);
export default Overview;
