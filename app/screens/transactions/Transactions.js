// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import type { RouterHistory } from 'react-router-dom';
import { TransactionRow, TransactionsMeta } from '/components/transactions';
import { Link, WrapperWith2SideBars, SecondaryButton } from '/basicComponents';
import type { TxList } from '/types';
import { ScreenErrorBoundary } from '/components/errorHandler';
import { chevronLeftWhite } from '/assets/images';

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

type Props = {
  transactions: TxList,
  history: RouterHistory
};

class Transactions extends PureComponent<Props> {
  render() {
    const { transactions, history } = this.props;
    return (
      <Wrapper>
        <SecondaryButton onClick={history.goBack} img={chevronLeftWhite} imgWidth={7} imgHeight={10} style={{ position: 'absolute', left: -35, bottom: 0 }} />
        <WrapperWith2SideBars width={680} height={480} header="TRANSACTION LOG" style={{ marginRight: 10 }}>
          <BoldText>Latest transactions</BoldText>
          <Link onClick={this.navigateToContacts} text="MY CONTACTS" style={{ position: 'absolute', top: 30, left: 500 }} />
          <TransactionsListWrapper>
            {transactions ? transactions.map((tx, index) => <TransactionRow key={index} transaction={tx} />) : <Text>No transactions executed yet</Text>}
          </TransactionsListWrapper>
        </WrapperWith2SideBars>
        <TransactionsMeta transactions={transactions} />
      </Wrapper>
    );
  }

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
