// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Button } from '/basicComponents';
import { chevronLeftBlack, chevronRightBlack } from '/assets/images';
import { getAbbreviatedText, getFormattedTimestamp, getAddress, formatSmidge } from '/infra/utils';
import { smColors } from '/vars';
import TX_STATUSES from '/vars/enums';
import type { TxList, Tx } from '/types';

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

const TxWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
`;

const Icon = styled.img`
  width: 10px;
  height: 20px;
  margin-right: 10px;
`;

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
`;

const Text = styled.div`
  font-size: 13px;
  line-height: 17px;
  color: ${smColors.darkGray};
`;

const NickName = styled(Text)`
  color: ${smColors.realBlack};
`;

const Amount = styled.div`
  color: ${({ color }) => color};
`;

type Props = {
  publicKey: string,
  transactions: TxList,
  navigateToAllTransactions: () => void
};

class LatestTransactions extends PureComponent<Props> {
  render() {
    const { transactions, navigateToAllTransactions } = this.props;
    const reversedTransactions = transactions.reverse();
    return (
      <Wrapper>
        <Header>
          Transactions
          <br />
          --
        </Header>
        <div>{reversedTransactions.map((tx, index) => this.renderTransaction({ tx, index }))}</div>
        <Button onClick={navigateToAllTransactions} text="ALL TRANSACTIONS" width={175} style={{ marginTop: 'auto ' }} />
      </Wrapper>
    );
  }

  renderTransaction = ({ tx, index }: { tx: Tx, index: number }) => {
    const { publicKey } = this.props;
    const { txId, status, amount, sender, timestamp, nickname } = tx;
    const isSent = sender === getAddress(publicKey);
    const color = this.getColor({ status, isSent });
    return (
      <TxWrapper key={index}>
        <Icon src={isSent ? chevronLeftBlack : chevronRightBlack} />
        <MainWrapper>
          <Section>
            <NickName>{txId === 'reward' ? 'Smeshing reward' : nickname || getAbbreviatedText(sender)}</NickName>
            {txId === 'reward' ? null : <Text>{getAddress(txId)}</Text>}
          </Section>
          <Section>
            <Text>{getFormattedTimestamp(timestamp)}</Text>
            <Amount color={color}>{formatSmidge(amount)}</Amount>
          </Section>
        </MainWrapper>
      </TxWrapper>
    );
  };

  getColor = ({ status, isSent }: { status: string, isSent: boolean }) => {
    if (status === TX_STATUSES.PENDING) {
      return smColors.orange;
    } else if (status === TX_STATUSES.REJECTED) {
      return smColors.orange;
    }
    return isSent ? smColors.blue : smColors.darkerGreen;
  };
}

export default LatestTransactions;
