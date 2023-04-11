import React, { MutableRefObject, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import useVirtual from 'react-cool-virtual';
import { MainPath } from '../../routerPaths';
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
  getContacts,
  getRewards,
  getTransactions,
  getSentTransactions,
  getReceivedTransactions,
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
  Sent = 3,
  Received = 4,
}

const TX_FILTERS = [
  { label: 'all', filter: TxFilter.All },
  { label: 'transactions', filter: TxFilter.Transactions },
  { label: 'rewards', filter: TxFilter.Rewards },
  { label: 'sent', filter: TxFilter.Sent },
  { label: 'received', filter: TxFilter.Received },
];

const TransactionList = ({
  address,
  transactions,
  contacts,
  setAddressToAdd,
}: {
  address: Bech32Address;
  transactions: (TxView | RewardView)[];
  contacts: Record<Bech32Address, string>;
  setAddressToAdd: (a: Bech32Address) => void;
}) => {
  const { outerRef, innerRef, items } = useVirtual({
    itemCount: transactions.length,
    itemSize: 60,
  });
  const setRef = (ref: MutableRefObject<HTMLElement | null>) => (
    el: HTMLElement | null
  ) => {
    ref.current = el;
  };

  return (
    <TransactionsListWrapper ref={setRef(outerRef)}>
      {!(transactions && transactions.length) ? (
        <Text>No transactions yet.</Text>
      ) : (
        <div ref={setRef(innerRef)}>
          {items.map(({ index, measureRef }) => {
            const tx = transactions[index];
            if (!tx) return null;
            const isRew = isReward(tx);
            const key = [address, tx.layer, isRew ? tx.amount : tx.id].join(
              '_'
            );
            return (
              <div key={key} ref={measureRef}>
                {isReward(tx) ? (
                  <RewardRow
                    key={`${address}_reward_${tx.layer}`}
                    address={address}
                    tx={tx}
                  />
                ) : (
                  <TxRow
                    key={`tx_${tx.id}`}
                    tx={tx}
                    address={address}
                    contacts={contacts}
                    addToContacts={(addr) => setAddressToAdd(addr)}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </TransactionsListWrapper>
  );
};

const Transactions = ({ history }: RouteComponentProps) => {
  const [selectedTimeSpan, setSelectedTimeSpan] = useState(0);
  const [addressToAdd, setAddressToAdd] = useState('');
  const [txFilter, setTxFilter] = useState(TxFilter.All);

  const address = useSelector(
    (state: RootState) =>
      state.wallet.accounts[state.wallet.currentAccountIndex].address
  );

  const getNonce = useSelector(
    (state: RootState) =>
      state.wallet.balances[address]?.currentState?.counter ?? 0
  );

  const transactions = useSelector((state: RootState) => {
    switch (txFilter) {
      case TxFilter.Transactions:
        return getTransactions(address, state);
      case TxFilter.Rewards:
        return getRewards(address, state);
      case TxFilter.Received:
        return getReceivedTransactions(address, state);
      case TxFilter.Sent:
        return getSentTransactions(address, state);
      default:
      case TxFilter.All:
        return getTxAndRewards(address, state);
    }
  });

  const contacts = useSelector(getContacts);

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

  const filterLastDays = (txs: (TxView | RewardView)[], days = 1) => {
    const oneDayInMs = 1000 * 60 * 60 * 24;
    const startDate = Date.now() - days * oneDayInMs;
    return txs.filter(
      (tx) => (tx.timestamp && tx.timestamp >= startDate) || !tx.timestamp
    );
  };

  const cancelCreatingNewContact = () => {
    setAddressToAdd('');
  };

  const navigateToGuide = () => window.open(ExternalLinks.WalletGuide);

  const filteredTransactions = filterLastDays(
    transactions,
    TIME_SPANS[selectedTimeSpan].days
  );
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
      <BackButton
        action={() => history.replace(MainPath.Wallet)}
        width={7}
        height={10}
      />
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
        <TransactionList
          address={address}
          transactions={transactions}
          contacts={contacts}
          setAddressToAdd={setAddressToAdd}
        />
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
            nonce={getNonce}
          />
        </RightPaneWrapper>
      )}
    </Wrapper>
  );
};

export default Transactions;
