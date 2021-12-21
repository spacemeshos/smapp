import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { BackButton } from '../../components/common';
import { TxRow, RewardRow, TransactionsMeta } from '../../components/transactions';
import { CreateNewContact } from '../../components/contacts';
import { Link, WrapperWith2SideBars, CorneredWrapper, DropDown } from '../../basicComponents';
import { getAddress } from '../../infra/utils';
import { smColors } from '../../vars';
import { RootState } from '../../types';
import { getTxAndRewards, RewardView, TxView } from '../../redux/wallet/selectors';
import { TxState, HexString } from '../../../shared/types';
import { isReward, isTx } from '../../../shared/types/guards';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
`;

const Text = styled.span`
  font-size: 16px;
  line-height: 22px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.realBlack)};
`;

const TransactionsListWrapper = styled.div`
  flex: 1;
  overflow-x: hidden;
  overflow-y: scroll;
  margin: 0 -10px 10px -10px;
  padding: 0 10px;
`;

const RightPaneWrapper = styled(CorneredWrapper)`
  background-color: ${({ theme }) => (theme.isDarkMode ? smColors.dmBlack2 : smColors.black02Alpha)};
  display: flex;
  flex-direction: column;
  width: 260px;
  padding: 20px 14px;
`;

const TimeSpanEntry = styled.div<{ isInDropDown: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 5px 5px 5px 15px;
  cursor: pointer;
  text-align: left;
  ${({ isInDropDown }) => isInDropDown && 'opacity: 0.5;'}
  &:hover {
    opacity: 1;
    color: ${smColors.darkGray50Alpha};
  }
`;

const getNumOfCoinsFromTransactions = (publicKey: HexString, transactions: (TxView | RewardView)[]) => {
  const coins = { mined: 0, sent: 0, received: 0 };
  const address = getAddress(publicKey);
  return transactions.reduce((coins, txOrReward: TxView | RewardView) => {
    if (isTx(txOrReward)) {
      const { status, sender, amount } = txOrReward;
      if (status !== TxState.TRANSACTION_STATE_REJECTED && status !== TxState.TRANSACTION_STATE_INSUFFICIENT_FUNDS && status !== TxState.TRANSACTION_STATE_CONFLICTING) {
        return sender === address ? { ...coins, sent: coins.sent + amount } : { ...coins, received: coins.received + amount };
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

const Transactions = ({ history }: RouteComponentProps) => {
  const [selectedTimeSpan, setSelectedTimeSpan] = useState(0);
  const [addressToAdd, setAddressToAdd] = useState('');

  const publicKey = useSelector((state: RootState) => state.wallet.accounts[state.wallet.currentAccountIndex].publicKey);
  const transactions = useSelector(getTxAndRewards(publicKey));
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  const getCoinStatistics = (filteredTransactions: (TxView | RewardView)[]) => {
    const coins = getNumOfCoinsFromTransactions(publicKey, filteredTransactions);
    const totalCoins = getNumOfCoinsFromTransactions(publicKey, transactions || []);
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
    return transactions.filter((tx) => (tx.timestamp && tx.timestamp >= startDate) || !tx.timestamp);
  };

  const cancelCreatingNewContact = () => {
    setAddressToAdd('');
  };

  // const navigateToContacts = () => {
  //   history.push('/main/contacts');
  // };

  const navigateToGuide = () => window.open('https://testnet.spacemesh.io/#/wallet');

  const ddStyle = { width: 120, position: 'absolute', right: 12, top: 5, color: isDarkMode ? smColors.white : smColors.black };

  const filteredTransactions = filterTransactions();
  const coinStats = getCoinStatistics(filteredTransactions);
  const { mined, sent, received, totalMined, totalSent, totalReceived } = coinStats;
  return (
    <Wrapper>
      <BackButton action={history.goBack} width={7} height={10} />
      <WrapperWith2SideBars width={680} header="TRANSACTION LOG" style={{ marginRight: 10 }} isDarkMode={isDarkMode}>
        <TransactionsListWrapper>
          {transactions && transactions.length ? (
            transactions.map((tx: TxView | RewardView) =>
              isReward(tx) ? (
                <RewardRow key={`${publicKey}_reward_${tx.layer}`} publicKey={publicKey} tx={tx} />
              ) : (
                <TxRow key={`tx_${tx.id}`} tx={tx} publicKey={publicKey} addAddressToContacts={({ address }) => setAddressToAdd(`0x${address}`)} />
              )
            )
          ) : (
            <Text>No transactions yet.</Text>
          )}
        </TransactionsListWrapper>
        <Link onClick={navigateToGuide} text="TRANSACTIONS GUIDE" />
      </WrapperWith2SideBars>
      {addressToAdd ? (
        <CreateNewContact isStandalone initialAddress={addressToAdd} onCompleteAction={handleCompleteAction} onCancel={cancelCreatingNewContact} />
      ) : (
        <RightPaneWrapper>
          <DropDown
            data={TIME_SPANS}
            DdElement={({ label, isMain }) => <TimeSpanEntry isInDropDown={!isMain}>{label}</TimeSpanEntry>}
            onClick={handlePress}
            selectedItemIndex={selectedTimeSpan}
            rowHeight={40}
            style={ddStyle}
            bgColor={isDarkMode ? smColors.black : smColors.white}
            rowContentCentered={false}
            isDarkMode={isDarkMode}
          />
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
