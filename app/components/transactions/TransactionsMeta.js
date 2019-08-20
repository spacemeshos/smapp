// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { CorneredWrapper } from '/basicComponents';
import TransactionsSumProgress from './TransactionsSumProgress';
import { smColors } from '/vars';
import type { TxList, Tx } from '/types';

const getNumOfCoinsFromTransactions = ({ transactions, isSent }: { transactions: TxList, isSent: boolean }): number => {
  const coins: number = transactions.reduce((sumCoins, transaction: Tx) => {
    return transaction.isSent === isSent && !transaction.isPending && !transaction.isRejected ? sumCoins + transaction.amount : sumCoins;
  }, 0);
  return parseInt(coins);
};

const Text = styled.span`
  font-size: 16px;
  line-height: 22px;
`;

const BoldText = styled.span`
  font-family: SourceCodeProBold;
  margin-bottom: 24px;
`;

const Wrapper = styled(CorneredWrapper)`
  background-color: ${smColors.black02Alpha};
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 20px 14px;
`;

const TextRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  overflow: hidden;
  white-space: nowrap;
  margin-bottom: 10px;
`;

const Dots = styled(Text)`
  flex-shrink: 1;
  overflow: hidden;
`;

type Props = {
  transactions: TxList
};

type State = {
  mined: number,
  sent: number,
  received: number
};

class TransactionsMeta extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      mined: 0,
      sent: getNumOfCoinsFromTransactions({ transactions: props.transactions, isSent: true }),
      received: getNumOfCoinsFromTransactions({ transactions: props.transactions, isSent: false })
    };
  }

  render() {
    // TODO: Implement daily / monthly / yearly filter and populate actual values under "total" below
    const { mined, sent, received } = this.state;
    const totalCoins = mined + sent + received;
    return (
      <Wrapper>
        <BoldText>traffic</BoldText>
        <BoldText>--</BoldText>
        <Text>Monthly coins: {totalCoins}</Text>
        <TransactionsSumProgress title="MINED" coins={mined} total={totalCoins} style={{}} />
        <TransactionsSumProgress title="SENT" coins={sent} total={totalCoins} />
        <TransactionsSumProgress title="RECEIVED" coins={received} total={totalCoins} />
        <BoldText>total</BoldText>
        <BoldText>--</BoldText>
        <TextRow>
          <Text>TOTAL MINED</Text>
          <Dots>...................</Dots>
          <Text>{`${mined} SMC`}</Text>
        </TextRow>
        <TextRow>
          <Text>TOTAL SENT</Text>
          <Dots>...................</Dots>
          <Text>{`${sent} SMC`}</Text>
        </TextRow>
        <TextRow>
          <Text>TOTAL RECEIVED</Text>
          <Dots>...................</Dots>
          <Text>{`${received} SMC`}</Text>
        </TextRow>
      </Wrapper>
    );
  }
}

export default TransactionsMeta;
