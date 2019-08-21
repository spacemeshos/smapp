// @flow
import React, { Component } from 'react';
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

const getNumOfCoinsFromTransactions = ({ transactions, isSent }: { transactions: TxList, isSent: boolean }): number => {
  const coins: number = transactions.reduce((sumCoins, transaction: Tx) => {
    return transaction.isSent === isSent && !transaction.isPending && !transaction.isRejected ? sumCoins + transaction.amount : sumCoins;
  }, 0);
  return parseInt(coins);
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
`;

const Text = styled.span`
  font-size: 16px;
  line-height: 22px;
`;

const BoldText = styled.span`
  font-family: SourceCodeProBold;
  margin-bottom: 24px;
`;

const TransactionsListWrapper = styled.div`
  flex: 1;
  overflow-x: hidden;
  overflow-y: scroll;
`;

const RightPaneWrapper = styled(CorneredWrapper)`
  background-color: ${smColors.black02Alpha};
  display: flex;
  flex-direction: column;
  width: 260px;
  padding: 20px 14px;
`;

// $FlowStyledIssue
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

const timeSpans = [
  {
    id: 0,
    label: 'daily'
  },
  {
    id: 1,
    label: 'monthly'
  },
  {
    id: 2,
    label: 'yearly'
  }
];

type Props = {
  transactions: TxList,
  history: RouterHistory
};

type State = {
  selectedItemIndex: number,
  filteredTransactions: TxList,
  mined: number,
  sent: number,
  received: number,
  totalMined: number,
  totalSent: number,
  totalReceived: number,
  addressToAdd: string
};

class Transactions extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const filteredTransactions = this.filterTransactions({ index: 1, transactions: props.transactions });
    this.state = {
      selectedItemIndex: 1,
      filteredTransactions,
      mined: 0,
      sent: getNumOfCoinsFromTransactions({ transactions: filteredTransactions, isSent: true }),
      received: getNumOfCoinsFromTransactions({ transactions: filteredTransactions, isSent: false }),
      totalMined: 0,
      totalSent: getNumOfCoinsFromTransactions({ transactions: props.transactions, isSent: true }),
      totalReceived: getNumOfCoinsFromTransactions({ transactions: props.transactions, isSent: false }),
      addressToAdd: ''
    };
  }

  render() {
    const { history } = this.props;
    const { selectedItemIndex, filteredTransactions, mined, sent, received, totalMined, totalSent, totalReceived, addressToAdd } = this.state;
    return (
      <Wrapper>
        <SecondaryButton onClick={history.goBack} img={chevronLeftWhite} imgWidth={7} imgHeight={10} style={{ position: 'absolute', left: -35, bottom: 0 }} />
        <WrapperWith2SideBars width={680} height={480} header="TRANSACTION LOG" style={{ marginRight: 10 }}>
          <BoldText>Latest transactions</BoldText>
          <Link onClick={this.navigateToContacts} text="MY CONTACTS" style={{ position: 'absolute', top: 30, left: 550 }} />
          <TransactionsListWrapper>
            {filteredTransactions && filteredTransactions.length ? (
              filteredTransactions.map((tx, index) => (
                <TransactionRow key={index} transaction={tx} addAddressToContacts={({ address }) => this.setState({ addressToAdd: address })} />
              ))
            ) : (
              <Text>No transactions executed yet</Text>
            )}
          </TransactionsListWrapper>
        </WrapperWith2SideBars>
        <RightPaneWrapper>
          {addressToAdd ? (
            <CreateNewContact isStandalone initialAddress={addressToAdd} onCompleteAction={() => {}} />
          ) : (
            <React.Fragment>
              <DropDown
                data={timeSpans}
                DdElement={this.renderDdElement}
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
            </React.Fragment>
          )}
        </RightPaneWrapper>
      </Wrapper>
    );
  }

  renderDdElement = ({ label, isMain }) => {
    return <TimeSpanEntry isInDropDown={!isMain}>{label}</TimeSpanEntry>;
  };

  handlePress = ({ index }) => {
    const { transactions } = this.props;
    const filteredTransactions = this.filterTransactions({ index, transactions });
    this.setState({
      selectedItemIndex: index,
      filteredTransactions: [...filteredTransactions],
      mined: 0,
      sent: getNumOfCoinsFromTransactions({ transactions: filteredTransactions, isSent: true }),
      received: getNumOfCoinsFromTransactions({ transactions: filteredTransactions, isSent: false }),
      totalMined: 0,
      totalSent: getNumOfCoinsFromTransactions({ transactions, isSent: true }),
      totalReceived: getNumOfCoinsFromTransactions({ transactions, isSent: false })
    });
  };

  filterTransactions = ({ index, transactions }) => {
    const oneDayInMs = 86400000;
    const spanInDays = [1, 30, 365];
    return transactions.filter((transaction: Tx) => {
      const startDate = +new Date() - spanInDays[index] * oneDayInMs;
      return transaction.date >= startDate;
    });
  };

  navigateToContacts = () => {
    const { history } = this.props;
    history.push('/main/contacts');
  };
}

const mapStateToProps = (state) => ({
  transactions: state.wallet.transactions[state.wallet.currentAccountIndex]
});

Transactions = connect(mapStateToProps)(Transactions);

Transactions = ScreenErrorBoundary(Transactions);
export default Transactions;
