// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import TransactionsSumProgress from './TransactionsSumProgress';

const Text = styled.span`
  font-size: 16px;
  line-height: 22px;
`;

const BoldText = styled.span`
  font-family: SourceCodeProBold;
  margin-bottom: 18px;
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
  filterName: string,
  mined: number,
  sent: number,
  received: number,
  totalMined: number,
  totalSent: number,
  totalReceived: number
};

class TransactionsMeta extends PureComponent<Props> {
  render() {
    const { mined, sent, received, totalMined, totalSent, totalReceived, filterName } = this.props;
    const totalFilteredCoins = mined + sent + received;
    const coinsMeta = [{ title: 'MINED', coins: mined }, { title: 'SENT', coins: sent }, { title: 'RECEIVED', coins: received }];
    const totalCoinsMeta = [{ title: 'TOTAL MINED', coins: totalMined }, { title: 'TOTAL SENT', coins: totalSent }, { title: 'TOTAL RECEIVED', coins: totalReceived }];

    return (
      <React.Fragment>
        <BoldText>traffic</BoldText>
        <BoldText>--</BoldText>
        <Text style={{ marginBottom: 27 }}>{`${filterName.replace(/^\w/, (c) => c.toUpperCase())} coins: ${totalFilteredCoins}`}</Text>
        {coinsMeta.map((coinMeta) => (
          <TransactionsSumProgress key={coinMeta.title} title={coinMeta.title} coins={coinMeta.coins} total={totalFilteredCoins} />
        ))}
        <BoldText>total</BoldText>
        <BoldText>--</BoldText>
        {totalCoinsMeta.map((totalMeta) => (
          <TextRow key={totalMeta.title}>
            <Text>{totalMeta.title}</Text>
            <Dots>...................</Dots>
            <Text>{`${totalMeta.coins} SMC`}</Text>
          </TextRow>
        ))}
      </React.Fragment>
    );
  }
}

export default TransactionsMeta;
