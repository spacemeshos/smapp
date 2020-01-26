// @flow
import React, { Component } from 'react';
import { shell } from 'electron';
import styled from 'styled-components';
import { connect } from 'react-redux';
import type { RouterHistory } from 'react-router-dom';
import { TransactionRow, TransactionsMeta } from '/components/transactions';
import { CreateNewContact } from '/components/contacts';
import { Link, WrapperWith2SideBars, SecondaryButton, CorneredWrapper, DropDown } from '/basicComponents';
import type { TxList, Tx } from '/types';
import { ScreenErrorBoundary } from '/components/errorHandler';
import { chevronLeftWhite } from '/assets/images';
import { smColors } from '/vars';
import TX_STATUSES from '/vars/enums';
import { getAddress } from '../../infra/utils';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
`;

const Text = styled.span`
  font-size: 16px;
  line-height: 22px;
`;

const Header = styled.span`
  font-family: SourceCodeProBold;
  margin-bottom: 25px;
`;

const TransactionsListWrapper = styled.div`
  flex: 1;
  overflow-x: hidden;
  overflow-y: scroll;
  margin: 0 -10px 10px -10px;
  padding: 0 10px;
`;

const RightPaneWrapper = styled(CorneredWrapper)`
  background-color: ${smColors.black02Alpha};
  display: flex;
  flex-direction: column;
  width: 260px;
  padding: 20px 14px;
`;

const TimeSpanEntry = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 5px;
  cursor: pointer;
  text-align: left;
  ${({ isInDropDown }) => isInDropDown && 'opacity: 0.5;'}
  &:hover {
    opacity: 1;
    color: ${smColors.darkGray50Alpha};
  }
`;

const getNumOfCoinsFromTransactions = ({ publicKey, transactions }: { publicKey: string, transactions: TxList }) => {
  const coins = {
    mined: 0,
    sent: 0,
    received: 0
  };

  transactions.forEach(({ txId, status, sender, amount }: { txId: string, status: number, sender: string, amount: number }) => {
    const address = getAddress(publicKey);
    if (status !== TX_STATUSES.REJECTED) {
      if (txId === 'reward') {
        coins.mined += amount;
      } else if (sender === address) {
        coins.sent += amount;
      } else {
        coins.received += amount;
      }
    }
  });

  return coins;
};

const timeSpans = [{ label: 'daily' }, { label: 'monthly' }, { label: 'yearly' }];

type Props = {
  publicKey: string,
  transactions: { data: TxList },
  history: RouterHistory
};

type State = {
  selectedItemIndex: number,
  addressToAdd: string
};

class Transactions extends Component<Props, State> {
  state = {
    selectedItemIndex: 1,
    addressToAdd: ''
  };

  render() {
    const { history, publicKey, transactions } = this.props;
    const { selectedItemIndex, addressToAdd } = this.state;
    const filteredTransactions = this.filterTransactions({ index: selectedItemIndex, transactions });
    const { mined, sent, received, totalMined, totalSent, totalReceived } = this.getCoinStatistics({ filteredTransactions });
    return (
      <Wrapper>
        <SecondaryButton onClick={history.goBack} img={chevronLeftWhite} imgWidth={7} imgHeight={10} style={{ position: 'absolute', left: -35, bottom: 0 }} />
        <WrapperWith2SideBars width={680} height={480} header="TRANSACTION LOG" style={{ marginRight: 10 }}>
          <Header>Latest transactions</Header>
          <TransactionsListWrapper>
            {filteredTransactions && filteredTransactions.length ? (
              filteredTransactions.map((tx, index) => (
                <TransactionRow key={index} publicKey={publicKey} tx={tx} addAddressToContacts={({ address }) => this.setState({ addressToAdd: address })} />
              ))
            ) : (
              <Text>No transactions yet.</Text>
            )}
          </TransactionsListWrapper>
          <Link onClick={this.navigateToGuide} text="TRANSACTIONS GUIDE" />
        </WrapperWith2SideBars>
        {addressToAdd ? (
          <CreateNewContact isStandalone initialAddress={addressToAdd} onCompleteAction={this.handleCompleteAction} onCancel={this.cancelCreatingNewContact} />
        ) : (
          <RightPaneWrapper>
            <DropDown
              data={timeSpans}
              DdElement={({ label, isMain }) => <TimeSpanEntry isInDropDown={!isMain}>{label}</TimeSpanEntry>}
              onPress={this.handlePress}
              selectedItemIndex={selectedItemIndex}
              rowHeight={55}
              style={{ width: 120, position: 'absolute', right: 12, top: 0 }}
            />
            <TransactionsMeta
              mined={mined}
              sent={sent}
              received={received}
              totalMined={totalMined}
              totalSent={totalSent}
              totalReceived={totalReceived}
              filterName={timeSpans[selectedItemIndex].label}
            />
          </RightPaneWrapper>
        )}
      </Wrapper>
    );
  }

  getCoinStatistics = ({ filteredTransactions }: { filteredTransactions: TxList }) => {
    const { publicKey, transactions } = this.props;
    const coins = getNumOfCoinsFromTransactions({ publicKey, transactions: filteredTransactions });
    const totalCoins = getNumOfCoinsFromTransactions({ publicKey, transactions: transactions.data });
    return {
      ...coins,
      totalMined: totalCoins.mined,
      totalSent: totalCoins.sent,
      totalReceived: totalCoins.received
    };
  };

  handleCompleteAction = () => {
    this.setState({ addressToAdd: '' });
  };

  handlePress = ({ index }) => {
    this.setState({
      selectedItemIndex: index
    });
  };

  filterTransactions = ({ index, transactions }) => {
    const oneDayInMs = 86400000;
    const spanInDays = [1, 30, 365];
    return transactions.data.filter((transaction: Tx) => {
      const startDate = +new Date() - spanInDays[index] * oneDayInMs;
      return transaction.timestamp >= startDate;
    });
  };

  cancelCreatingNewContact = () => {
    this.setState({ addressToAdd: '' });
  };

  navigateToContacts = () => {
    const { history } = this.props;
    history.push('/main/contacts');
  };

  navigateToGuide = () => shell.openExternal('https://testnet.spacemesh.io/#/wallet');
}

const mapStateToProps = (state) => ({
  publicKey: state.wallet.accounts[state.wallet.currentAccountIndex].publicKey,
  transactions: state.wallet.transactions[state.wallet.currentAccountIndex]
});

Transactions = connect(mapStateToProps)(Transactions);

Transactions = ScreenErrorBoundary(Transactions);
export default Transactions;
