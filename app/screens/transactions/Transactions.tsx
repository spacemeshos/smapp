import React, { useState } from 'react';
import useVirtual from 'react-cool-virtual';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { ExternalLinks } from '../../../shared/constants';
import { Bech32Address } from '../../../shared/types';
import { isReward } from '../../../shared/types/guards';
import {
  CorneredWrapper,
  DropDown,
  Link,
  WrapperWith2SideBars,
} from '../../basicComponents';
import { BackButton } from '../../components/common';
import { CreateNewContact } from '../../components/contacts';
import {
  RewardRow,
  TransactionsMeta,
  TxRow,
} from '../../components/transactions';
import { setRef } from '../../infra/utils';
import {
  RewardView,
  TxView,
  getContacts,
  getReceivedTransactions,
  getRewards,
  getSentTransactions,
  getTransactions,
  getTxAndRewards,
} from '../../redux/wallet/selectors';
import { MainPath } from '../../routerPaths';
import { RootState } from '../../types';

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

export const TIME_SPANS = [
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
  setAddressToAdd,
}: {
  address: Bech32Address;
  transactions: (TxView | RewardView)[];
  setAddressToAdd: (a: Bech32Address) => void;
}) => {
  const { outerRef, innerRef, items } = useVirtual({
    itemCount: transactions.length,
    itemSize: 60,
  });
  const contacts = useSelector(getContacts);

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

  const nonce = useSelector(
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

  const handleCompleteAction = () => {
    setAddressToAdd('');
  };

  const handlePress = ({ index }: { index: number }) => {
    setSelectedTimeSpan(index);
  };

  const cancelCreatingNewContact = () => {
    setAddressToAdd('');
  };

  const navigateToGuide = () => window.open(ExternalLinks.WalletGuide);

  return (
    <Wrapper>
      <BackButton action={() => history.replace(MainPath.Wallet)} />
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
            filterName={TIME_SPANS[selectedTimeSpan].label}
            nonce={nonce}
            transactions={transactions}
            address={address}
            selectedTimeSpan={selectedTimeSpan}
          />
        </RightPaneWrapper>
      )}
    </Wrapper>
  );
};

export default Transactions;
