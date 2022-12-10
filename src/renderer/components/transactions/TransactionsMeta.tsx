import React from 'react';
import styled from 'styled-components';
import { formatSmidge } from '../../infra/utils';
import { smColors } from '../../vars';

const Text = styled.span`
  font-size: 16px;
  line-height: 22px;
  color: ${({ theme }) => theme.color.contrast};
`;

const BoldText = styled.span`
  font-weight: 800;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.color.contrast};
`;

const TextRow = styled.div`
  display: flex;
  flex: 20px 1 0;
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

const Group = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  :last-of-type {
    margin-bottom: 0;
  }
`;

const ProgressBar = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 14px;
`;

const SmallText = styled.span`
  font-size: 13px;
  line-height: 17px;
  color: ${({ theme }) =>
    theme.isDarkMode ? smColors.white : smColors.darkGray};
`;

const Bar = styled.div`
  width: 100%;
  height: 5px;
  background-color: ${({ theme }) =>
    theme.isDarkMode ? smColors.white : smColors.mediumGray};
  position: relative;
`;

const Progress = styled.div<{ total: number; coins: number }>`
  width: ${({ total, coins }) => (total === 0 ? 0 : (coins / total) * 100)}%;
  height: inherit;
  background-color: ${smColors.green};
  //position: absolute;
`;

type Props = {
  filterName: string;
  mined: number;
  sent: number;
  received: number;
  totalMined: number;
  totalSent: number;
  totalReceived: number;
};

const TransactionsMeta = ({
  mined,
  sent,
  received,
  totalMined,
  totalSent,
  totalReceived,
  filterName,
}: Props) => {
  const totalFilteredCoins = mined + sent + received;
  const coinsMeta = [
    { title: 'SMESHED', coins: mined },
    { title: 'SENT', coins: sent },
    { title: 'RECEIVED', coins: received },
  ];
  const totalCoinsMeta = [
    { title: 'SMESHED', coins: totalMined },
    { title: 'SENT', coins: totalSent },
    { title: 'RECEIVED', coins: totalReceived },
  ];

  return (
    <>
      <Group>
        <BoldText>activity</BoldText>
        <BoldText>--</BoldText>
        <Text style={{ marginBottom: 27 }}>
          {`${filterName.replace(/^\w/, (c) =>
            c.toUpperCase()
          )} coins: ${formatSmidge(totalFilteredCoins)}`}
        </Text>
        {coinsMeta.map((coinMeta) => (
          <ProgressBar key={coinMeta.title}>
            <SmallText>
              {`${coinMeta.title} ${formatSmidge(coinMeta.coins)}`}
            </SmallText>
            <Bar>
              <Progress coins={coinMeta.coins} total={totalFilteredCoins} />
            </Bar>
          </ProgressBar>
        ))}
      </Group>
      <Group>
        <BoldText>total</BoldText>
        <BoldText>--</BoldText>
        {totalCoinsMeta.map((totalMeta) => (
          <TextRow key={totalMeta.title}>
            <Text>{totalMeta.title}</Text>
            <Dots>...................</Dots>
            <Text>{formatSmidge(totalMeta.coins)}</Text>
          </TextRow>
        ))}
      </Group>
    </>
  );
};

export default TransactionsMeta;
