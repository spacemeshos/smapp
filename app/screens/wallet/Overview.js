// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { AccountCard, BackupReminder, InitialLeftPane, ReceiveCoins } from '/components/wallet';
import { SendReceiveButton } from '/basicComponents';
import get from 'lodash.get';
import type { Account } from '/types';

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
  margin-right: 100px;
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
`;

type Props = {
  accounts: Account[],
  transactions: [],
  fiatRate: number,
  history: { push: (string, Object) => void }
};

type State = {
  currentAccount: number,
  shouldShowModal: boolean
};

class Overview extends Component<Props, State> {
  state = {
    currentAccount: 0,
    shouldShowModal: false
  };

  render() {
    const { accounts, transactions, fiatRate } = this.props;
    const { currentAccount, shouldShowModal } = this.state;
    return [
      <Wrapper key="main">
        <LeftSection>
          {accounts && <AccountCard account={accounts[currentAccount]} fiatRate={fiatRate} style={{ marginBottom: 20 }} />}
          <BackupReminder style={{ marginBottom: 20 }} />
          <ButtonsWrapper>
            <SendReceiveButton title={SendReceiveButton.titles.SEND} onPress={this.navigateToSendCoins} />
            <ButtonsSeparator />
            <SendReceiveButton title={SendReceiveButton.titles.RECEIVE} onPress={() => this.setState({ shouldShowModal: true })} />
          </ButtonsWrapper>
        </LeftSection>
        <RightSection>{transactions.length > 0 ? <div>transactions list</div> : <InitialLeftPane />}</RightSection>
      </Wrapper>,
      shouldShowModal && <ReceiveCoins key="modal" address={accounts[currentAccount].pk} closeModal={() => this.setState({ shouldShowModal: false })} />
    ];
  }

  navigateToSendCoins = () => {
    const { history, accounts } = this.props;
    const { currentAccount } = this.state;
    history.push('/main/wallet/sendCoins', { account: accounts[currentAccount] });
  };

  openReceiveCoinsModal = () => this.setState({ shouldShowModal: true });
}

const mapStateToProps = (state) => ({
  accounts: get(state.wallet.wallet, 'crypto.cipherText.accounts', null),
  transactions: state.wallet.transactions,
  fiatRate: state.wallet.fiatRate
});

Overview = connect(mapStateToProps)(Overview);

export default Overview;
