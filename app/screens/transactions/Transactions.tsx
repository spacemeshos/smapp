import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { BackButton } from '../../components/common';
import {
  TxRow,
  RewardRow,
  TransactionsMeta,
} from '../../components/transactions';
import { CreateNewContact } from '../../components/contacts';
import {
  Link,
  WrapperWith2SideBars,
  CorneredWrapper,
  DropDown,
} from '../../basicComponents';
import { RootState } from '../../types';
import {
  getRewards,
  getTransactions,
  getTxAndRewards,
  RewardView,
  TxView,
} from '../../redux/wallet/selectors';
import { TxState, Bech32Address } from '../../../shared/types';
import { isReward, isTx } from '../../../shared/types/guards';
import { ExternalLinks } from '../../../shared/constants';
import { SingleSigMethods } from '../../../shared/templateConsts';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
`;

const Text = styled.span`
  font-size: 16px;
  line-height: 22px;
  color: ${({ theme }) => theme.color.contrast};
`;

const TransactionsListWrapper = styled.div`
  flex: 1;
  overflow-x: hidden;
  overflow-y: scroll;
  margin: 0 -10px 10px -10px;
  padding: 0 10px;
`;

const RightPaneWrapper = styled(CorneredWrapper)`
  background-color: ${({ theme: { wrapper } }) => wrapper.color};
  display: flex;
  flex-direction: column;
  width: 260px;
  padding: 20px 14px;
`;

const DropDownWrapper = styled.div`
  position: absolute;
  width: 150px;
  right: 6px;
  top: 7px;
`;

const FilterDropDownWrapper = styled(DropDownWrapper)`
  right: 30px;
`;

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

const TIME_SPANS = [
  { label: 'daily', days: 1 },
  { label: 'monthly', days: 30 },
  { label: 'yearly', days: 365 },
];

enum TxFilter {
  All = 0,
  Transactions = 1,
  Rewards = 2,
}

const TX_FILTERS = [
  { label: 'all', filter: TxFilter.All },
  { label: 'transactions', filter: TxFilter.Transactions },
  { label: 'rewards', filter: TxFilter.Rewards },
];

const Transactions = ({ history }: RouteComponentProps) => {
  const [selectedTimeSpan, setSelectedTimeSpan] = useState(0);
  const [addressToAdd, setAddressToAdd] = useState('');
  const [txFilter, setTxFilter] = useState(TxFilter.All);

  const address = useSelector(
    (state: RootState) =>
      state.wallet.accounts[state.wallet.currentAccountIndex].address
  );
  const transactions = useSelector(getTxAndRewards(address));

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

  const handleCompleteAction = () => {
    setAddressToAdd('');
  };

  const handlePress = ({ index }: { index: number }) => {
    setSelectedTimeSpan(index);
  };

  const filterTransactions = () => {
    const oneDayInMs = 86400000;
    const spanInDays = TIME_SPANS[selectedTimeSpan].days || 1;
    const startDate = Date.now() - spanInDays * oneDayInMs;
    return transactions.filter(
      (tx) => (tx.timestamp && tx.timestamp >= startDate) || !tx.timestamp
    );
  };

  const cancelCreatingNewContact = () => {
    setAddressToAdd('');
  };

  const navigateToGuide = () => window.open(ExternalLinks.WalletGuide);

  const filteredTransactions = filterTransactions();
  const coinStats = getCoinStatistics(filteredTransactions);
  const {
    mined,
    sent,
    received,
    totalMined,
    totalSent,
    totalReceived,
  } = coinStats;

  return (
    <Wrapper>
      <BackButton action={history.goBack} width={7} height={10} />
      <WrapperWith2SideBars
        width={680}
        header="TRANSACTION LOG"
        style={{ marginRight: 10 }}
      >
        <FilterDropDownWrapper>
          <DropDown
            data={TX_FILTERS}
            onClick={({ index }) => setTxFilter(index)}
            selectedItemIndex={txFilter}
            rowHeight={40}
            bold
            dark
          />
        </FilterDropDownWrapper>
        <TransactionsListWrapper>
          {transactions && transactions.length ? (
            transactions.map((tx: TxView | RewardView) =>
              isReward(tx) ? (
                <RewardRow
                  key={`${address}_reward_${tx.layer}`}
                  address={address}
                  tx={tx}
                  isHidden={txFilter === TxFilter.Transactions}
                />
              ) : (
                <TxRow
                  key={`tx_${tx.id}`}
                  tx={tx}
                  address={address}
                  addAddressToContacts={({ address }) => address}
                  isHidden={txFilter === TxFilter.Rewards}
                />
              )
            )
          ) : (
            <Text>No transactions yet.</Text>
          )}
        </TransactionsListWrapper>
        <Link onClick={navigateToGuide} text="TRANSACTIONS GUIDE" />
      </WrapperWith2SideBars>
      {addressToAdd ? (
        <CreateNewContact
          isStandalone
          initialAddress={addressToAdd}
          onCompleteAction={handleCompleteAction}
          onCancel={cancelCreatingNewContact}
        />
      ) : (
        <RightPaneWrapper>
          <DropDownWrapper>
            <DropDown
              data={TIME_SPANS}
              onClick={handlePress}
              selectedItemIndex={selectedTimeSpan}
              rowHeight={40}
              bold
              dark
            />
          </DropDownWrapper>
          <TransactionsMeta
            mined={mined}
            sent={sent}
            received={received}
            totalMined={totalMined}
            totalSent={totalSent}
            totalReceived={totalReceived}
            filterName={TIME_SPANS[selectedTimeSpan].label}
          />
        </RightPaneWrapper>
      )}
    </Wrapper>
  );
};

export default Transactions;
