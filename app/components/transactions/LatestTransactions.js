// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Button } from '/basicComponents';
import { chevronLeftBlack, chevronRightBlack } from '/assets/images';
import { getAbbreviatedText, smgToSmesh } from '/infra/utils';
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
    return (
      <Wrapper>
        <Header>
          transactions
          <br />
          --
        </Header>
        <div>{transactions.map((tx, index) => this.renderTransaction({ tx, index }))}</div>
        <Button onClick={navigateToAllTransactions} text="ALL TRANSACTIONS" width={175} style={{ marginTop: 'auto ' }} />
      </Wrapper>
    );
  }

  renderTransaction = ({ tx, index }: { tx: Tx, index: number }) => {
    const { publicKey } = this.props;
    const { txId, status, amount, sender, timestamp, nickname } = tx;
    const isSent = sender === publicKey;
    const isPending = status === TX_STATUSES.PENDING;
    const isRejected = status === TX_STATUSES.REJECTED;
    const color = this.getColor({ isSent, isPending, isRejected });
    return (
      <TxWrapper key={index}>
        <Icon src={isSent ? chevronLeftBlack : chevronRightBlack} />
        <MainWrapper>
          <Section>
            <NickName>{nickname || getAbbreviatedText(sender)}</NickName>
            <Text>{getAbbreviatedText(txId)}</Text>
          </Section>
          <Section>
            <Text>{this.getDateText(timestamp)}</Text>
            <Amount color={color}>{parseFloat(smgToSmesh(amount).toFixed(4))}</Amount>
          </Section>
        </MainWrapper>
      </TxWrapper>
    );
  };

  getColor = ({ isSent, isPending, isRejected }: { isSent: boolean, isPending: boolean, isRejected: boolean }) => {
    if (isPending) {
      return smColors.orange;
    } else if (isRejected) {
      return smColors.orange;
    }
    return isSent ? smColors.blue : smColors.darkerGreen;
  };

  getDateText = (date: string) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const dateObj = new Date(date);
    return `${dateObj.toLocaleDateString('en-US', options)} ${dateObj.getHours()}:${dateObj.getMinutes()}:${dateObj.getSeconds()}`;
  };
}

export default LatestTransactions;
