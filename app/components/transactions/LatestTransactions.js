// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Transaction } from '/components/transactions';
import { menu3 } from '/assets/images';
import { smColors } from '/vars';
import type { TxList } from '/types';

const Wrapper = styled.div`
  height: 50%;
  display: flex;
  flex-direction: column;
  padding-top: 10px;
  margin-bottom: 30px;
  border-top: 1px solid ${smColors.borderGray};
`;

const Header = styled.div`
  font-size: 14px;
  font-weight: bold;
  line-height: 19px;
  color: ${smColors.darkGray};
  padding-left: 20px;
  margin-bottom: 15px;
`;

const SeeAllBtnWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 15px;
`;

const SeeAllBtn = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
`;

const SeeAllText = styled.div`
  font-size: 14px;
  line-height: 19px;
  color: ${smColors.darkGreen};
  margin-right: 10px;
  cursor: inherit;
`;

const SeeAllIcon = styled.img`
  width: 20px;
  height: 16px;
  cursor: inherit;
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
        <Header>Latest Transactions</Header>
        <div>
          {transactions.map((tx, index) => (
            <Transaction key={index} transaction={tx} addToContacts={addToContacts} />
          ))}
        </div>
        <SeeAllBtnWrapper>
          <SeeAllBtn onClick={navigateToAllTransactions}>
            <SeeAllText>See all transactions history</SeeAllText>
            <SeeAllIcon src={menu3} />
          </SeeAllBtn>
        </SeeAllBtnWrapper>
      </Wrapper>
    );
  }
}

export default LatestTransactions;
