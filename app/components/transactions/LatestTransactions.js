// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Transaction } from '/components/transactions';
import { Button } from '/basicComponents';
import { smColors } from '/vars';
import type { TxList } from '/types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 250px;
  height: 100%;
  padding: 20px 15px;
  background-color: ${smColors.black02Alpha};
`;

const Header = styled.div`
  font-family: SourceCodeProBold;
  font-size: 16px;
  line-height: 20px;
  color: ${smColors.black};
  margin-bottom: 10px;
`;

type Props = {
  transactions: TxList,
  addToContacts: ({ address: string }) => void,
  navigateToAllTransactions: () => void
};

class LatestTransactions extends PureComponent<Props> {
  render() {
    const { transactions, addToContacts, navigateToAllTransactions } = this.props;
    return (
      <Wrapper>
        <Header>
          transactions
          <br />
          --
        </Header>
        <div>
          {transactions.map((tx, index) => (
            <Transaction key={index} transaction={tx} addToContacts={addToContacts} />
          ))}
        </div>
        <Button onClick={navigateToAllTransactions} text="ALL TRANSACTIONS" width={175} style={{ marginTop: 'auto ' }} />
      </Wrapper>
    );
  }
}

export default LatestTransactions;
