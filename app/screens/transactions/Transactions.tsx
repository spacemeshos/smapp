import React, { useState } from 'react';
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
  Tooltip,
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
import { TxState, Bech32Address, formatTxState } from '../../../shared/types';
import { isReward, isTx } from '../../../shared/types/guards';
import { DAY, ExternalLinks } from '../../../shared/constants';
import { SingleSigMethods } from '../../../shared/templateConsts';
import { setRef } from '../../infra/utils';
import { formatDateAsISO } from '../../../shared/datetime';
import exportCsvIcon from '../../assets/images/export_csv_icon.svg';
import exportCsvDisabledIcon from '../../assets/images/export_csv_disabled_icon.svg';

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

const ExportButtonWrapper = styled(DropDownWrapper)`
  width: 30px;
  right: 205px;
`;

const ExportButton = styled.button`
  border: 0;
  outline: 0;
  background: transparent;
  &:disabled {
    cursor: pointer;
  }
  ${(props) =>
    !props.disabled &&
    `
    cursor: pointer;
    & > * {
      cursor: pointer;
    }
    &:hover {
      opacity: 0.5;
    }
    &:active {
      transform: translate3d(2px, 2px, 0);
    }
    `}
`;

const ExportIcon = styled.img`
  align-self: center;
  width: 36px;
  height: 36px;
  border: 5px solid transparent;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  margin: 0 3px;
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
    const startDate = Date.now() - days * DAY;
    return txs.filter(
      (tx) => (tx.timestamp && tx.timestamp >= startDate) || !tx.timestamp
    );
  };

  const cancelCreatingNewContact = () => {
    setAddressToAdd('');
  };

  const getCsvFileNameSuffix = () => {
    switch (txFilter) {
      case TxFilter.All:
      default:
        throw new Error('Cannot export Transactions and Reward at once');
      case TxFilter.Received:
        return 'txs-received';
      case TxFilter.Sent:
        return 'txs-sent';
      case TxFilter.Transactions:
        return 'txs';
      case TxFilter.Rewards:
        return 'rewards';
    }
  };
  const getCsvContent = () => {
    switch (txFilter) {
      case TxFilter.All:
      default:
        throw new Error('Cannot export Transactions and Reward at once');
      case TxFilter.Received:
      case TxFilter.Sent:
      case TxFilter.Transactions: {
        const totals = (transactions as TxView[]).reduce(
          (acc, next) => {
            const isOutgoing = next.principal === address;
            const sign = isOutgoing ? BigInt(-1) : BigInt(1);
            const amount =
              sign * (next.payload?.Arguments?.Amount ?? BigInt(0));
            return {
              gas: acc.gas - next.gas.fee,
              spent: acc.spent + amount,
            };
          },
          { gas: 0, spent: BigInt(0) }
        );
        return [
          [
            'ID',
            'Template',
            'Method',
            'Date',
            'Layer',
            'Status',
            'Gas Spent in Smidge',
            'Principal address',
            'Sent to',
            'Amount in Smidge',
            'Note',
          ].join(','),
          (transactions as TxView[])
            .map((tx: TxView) => {
              const isOutgoing = tx.principal === address;
              const sign = isOutgoing ? BigInt(-1) : BigInt(1);
              const amount =
                tx.method === SingleSigMethods.Spend
                  ? sign * tx.payload.Arguments.Amount
                  : BigInt(0);
              return [
                tx.id,
                tx.meta?.templateName,
                tx.meta?.methodName,
                tx.timestamp
                  ? formatDateAsISO(new Date(tx.timestamp))
                  : 'Unknown date',
                tx.layer ?? 'Unknown layer',
                formatTxState(tx.status),
                -tx.gas.fee,
                tx.principal,
                tx.method === SingleSigMethods.Spend
                  ? tx.payload.Arguments.Destination
                  : 'SelfSpawn',
                tx.method === SingleSigMethods.Spend ? amount.toString() : '0',
                tx.note ?? '',
              ].join(',');
            })
            .join('\n'),
          [
            'Transactions:',
            transactions.length,
            '',
            '',
            '',
            '',
            totals.gas,
            '',
            '',
            totals.spent.toString(),
            '',
          ].join(','),
        ].join('\n');
      }
      case TxFilter.Rewards: {
        const totals = (transactions as RewardView[]).reduce(
          (acc, next) => acc + next.amount,
          0
        );
        return [
          ['Layer', 'Date', 'Reward in Smidge'].join(','),
          (transactions as RewardView[])
            .map((r) =>
              [
                r.layer,
                r.timestamp
                  ? formatDateAsISO(new Date(r.timestamp))
                  : 'Unknown date',
                r.amount,
              ].join(',')
            )
            .join('\n'),
          ['Rewards:', transactions.length, totals].join(','),
        ].join('\n');
      }
    }
  };
  const exportCsv = () => {
    const content = getCsvContent();
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/csv' });
    element.href = URL.createObjectURL(file);
    element.download = `export-${getCsvFileNameSuffix()}.csv`;
    element.click();
  };
  const isExportCsvDisabled = txFilter === TxFilter.All;

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
        <ExportButtonWrapper>
          <Tooltip
            width={200}
            left={-190}
            text="Select a filter to enable export as CSV"
            disabled={!isExportCsvDisabled}
          >
            <ExportButton
              type="button"
              disabled={isExportCsvDisabled}
              title="Export as CSV"
              onClick={exportCsv}
            >
              <ExportIcon
                src={
                  isExportCsvDisabled ? exportCsvDisabledIcon : exportCsvIcon
                }
              />
            </ExportButton>
          </Tooltip>
        </ExportButtonWrapper>
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
            nonce={nonce}
          />
        </RightPaneWrapper>
      )}
    </Wrapper>
  );
};

export default Transactions;
