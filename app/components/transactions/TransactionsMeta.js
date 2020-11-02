// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { formatSmidge } from '/infra/utils';
import { smColors } from '/vars';

const Text = styled.span`
  font-size: 16px;
  line-height: 22px;
  color: ${({ theme }) => (theme.isDarkModeOn ? smColors.white : smColors.realBlack)};
`;

const BoldText = styled.span`
  font-family: SourceCodeProBold;
  margin-bottom: 18px;
  color: ${({ theme }) => (theme.isDarkModeOn ? smColors.white : smColors.realBlack)};
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

const ProgressBar = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 28px;
`;

const SmallText = styled.span`
  font-size: 13px;
  line-height: 17px;
  color: ${({ theme }) => (theme.isDarkModeOn ? smColors.white : smColors.darkGray)};
`;

const Bar = styled.div`
  width: 100%;
  height: 5px;
  color: ${({ theme }) => (theme.isDarkModeOn ? smColors.white : smColors.mediumGray)};
  position: relative;
`;

const Progress = styled.div`
  width: ${({ total, coins }) => (coins / total) * 100}%;
  height: inherit;
  background-color: ${smColors.green};
  position: absolute;
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
    const coinsMeta = [
      { title: 'SMESHED', coins: mined },
      { title: 'SENT', coins: sent },
      { title: 'RECEIVED', coins: received }
    ];
    const totalCoinsMeta = [
      { title: 'SMESHED', coins: totalMined },
      { title: 'SENT', coins: totalSent },
      { title: 'RECEIVED', coins: totalReceived }
    ];

    return (
      <>
        <BoldText>activity</BoldText>
        <BoldText>--</BoldText>
        <Text style={{ marginBottom: 27 }}>{`${filterName.replace(/^\w/, (c) => c.toUpperCase())} coins: ${formatSmidge(totalFilteredCoins)}`}</Text>
        {coinsMeta.map((coinMeta) => (
          <ProgressBar key={coinMeta.title}>
            <SmallText>{`${coinMeta.title} ${formatSmidge(coinMeta.coins)}`}</SmallText>
            <Bar>
              <Progress coins={coinMeta.coins} total={totalFilteredCoins} />
            </Bar>
          </ProgressBar>
        ))}
        <BoldText>total</BoldText>
        <BoldText>--</BoldText>
        {totalCoinsMeta.map((totalMeta) => (
          <TextRow key={totalMeta.title}>
            <Text>{totalMeta.title}</Text>
            <Dots>...................</Dots>
            <Text>{formatSmidge(totalMeta.coins)}</Text>
          </TextRow>
        ))}
      </>
    );
  }
}

export default TransactionsMeta;
