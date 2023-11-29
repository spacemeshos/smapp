import { RewardView, TxView } from 'app/redux/wallet/selectors';
import { TIME_SPANS } from 'app/screens/transactions/Transactions';
import React from 'react';
import { DAY } from 'shared/constants';
import { SingleSigMethods } from 'shared/templateConsts';
import { Bech32Address, TxState } from 'shared/types';
import { isReward, isTx } from 'shared/types/guards';
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
  nonce: number;
  transactions: (TxView | RewardView)[];
  address: Bech32Address;
  selectedTimeSpan: number;
};

const TransactionsMeta = ({
  filterName,
  nonce,
  transactions,
  address,
  selectedTimeSpan,
}: Props) => {
  const getNumOfCoinsFromTransactions = (
    address: Bech32Address,
    transactions: (TxView | RewardView)[]
  ) => {
    const coins = { mined: 0, sent: 0, received: 0 };
    return transactions.reduce((coins, txOrReward: TxView | RewardView) => {
      if (isTx(txOrReward)) {
        const { status, principal: sender, method, payload } = txOrReward;
        const amount =
          method === SingleSigMethods.Spend
            ? parseInt(payload?.Arguments?.Amount || 0, 10)
            : 0;
        if (
          status !== TxState.REJECTED &&
          status !== TxState.INSUFFICIENT_FUNDS &&
          status !== TxState.CONFLICTING &&
          status !== TxState.FAILURE
        ) {
          return sender === address
            ? { ...coins, sent: coins.sent + amount }
            : { ...coins, received: coins.received + amount };
        }
      } else if (isReward(txOrReward)) {
        const { amount } = txOrReward;
        return { ...coins, mined: coins.mined + amount };
      }
      return coins;
    }, coins);
  };

  const filterLastDays = (txs: (TxView | RewardView)[], days = 1) => {
    const startDate = Date.now() - days * DAY;
    return txs.filter(
      (tx) => (tx.timestamp && tx.timestamp >= startDate) || !tx.timestamp
    );
  };
  const filteredTransactions = filterLastDays(
    transactions,
    TIME_SPANS[selectedTimeSpan].days
  );
  const getCoinStatistics = (filteredTransactions: (TxView | RewardView)[]) => {
    const coins = getNumOfCoinsFromTransactions(address, filteredTransactions);
    const totalCoins = getNumOfCoinsFromTransactions(
      address,
      transactions || []
    );
    return {
      ...coins,
      totalMined: totalCoins.mined,
      totalSent: totalCoins.sent,
      totalReceived: totalCoins.received,
    };
  };

  const coinStats = getCoinStatistics(filteredTransactions);

  const {
    mined,
    sent,
    received,
    totalMined,
    totalSent,
    totalReceived,
  } = coinStats;

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
      <Text style={{ marginTop: 5 }}>Current Nonce: {nonce}</Text>
    </>
  );
};

export default TransactionsMeta;
