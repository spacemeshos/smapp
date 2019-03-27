// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { getBalance } from '/redux/wallet/actions';
import { AccountCard, BackupReminder, InitialLeftPane, ReceiveCoins } from '/components/wallet';
import { SendReceiveButton } from '/basicComponents';
import get from 'lodash.get';
import type { Account, Action } from '/types';

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
  getBalance: Action,
  fiatRate: number,
  history: { push: (string, Object) => void }
};

type State = {
  currentAccountIndex: number,
  shouldShowModal: boolean
};

class Overview extends Component<Props, State> {
  state = {
    currentAccountIndex: 0,
    shouldShowModal: false
  };

  render() {
    const { accounts, transactions, fiatRate } = this.props;
    const { currentAccountIndex, shouldShowModal } = this.state;
    return [
      <Wrapper key="main">
        <LeftSection>
          {accounts && <AccountCard account={accounts[currentAccountIndex]} fiatRate={fiatRate} style={{ marginBottom: 20 }} />}
          <BackupReminder style={{ marginBottom: 20 }} />
          <ButtonsWrapper>
            <SendReceiveButton title={SendReceiveButton.titles.SEND} onPress={this.navigateToSendCoins} />
            <ButtonsSeparator />
            <SendReceiveButton title={SendReceiveButton.titles.RECEIVE} onPress={() => this.setState({ shouldShowModal: true })} />
          </ButtonsWrapper>
        </LeftSection>
        <RightSection>{transactions.length > 0 ? <div>transactions list</div> : <InitialLeftPane />}</RightSection>
      </Wrapper>,
      shouldShowModal && <ReceiveCoins key="modal" address={accounts[currentAccountIndex].pk} closeModal={() => this.setState({ shouldShowModal: false })} />
    ];
  }

  componentDidMount(): void {
    // this.getBalance();
  }

  getBalance = async () => {
    const { accounts, getBalance } = this.props;
    const { currentAccountIndex } = this.state;
    await getBalance({ address: accounts[currentAccountIndex].pk, accountIndex: currentAccountIndex });
  };

  navigateToSendCoins = () => {
    const { history, accounts } = this.props;
    const { currentAccountIndex } = this.state;
    history.push('/main/wallet/sendCoins', { account: accounts[currentAccountIndex] });
  };
}

const mapStateToProps = (state) => ({
  accounts: get(state.wallet.wallet, 'crypto.cipherText.accounts', null),
  transactions: state.wallet.transactions,
  fiatRate: state.wallet.fiatRate
});

const mapDispatchToProps = {
  getBalance
};

Overview = connect(
  mapStateToProps,
  mapDispatchToProps
)(Overview);

export default Overview;
