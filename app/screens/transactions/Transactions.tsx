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
import { Reward, RootState, Tx, TxState } from '../../types';

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

const getNumOfCoinsFromTransactions = ({ publicKey, transactions }: { publicKey: string; transactions: Tx[] }) => {
  const coins = {
    mined: 0,
    sent: 0,
    received: 0,
  };
  const address = getAddress(publicKey);
  transactions.forEach(({ txId, status, sender, amount }: { txId: string; status: number; sender: string; amount: number }) => {
    if (status !== TxState.REJECTED && status !== TxState.INSUFFICIENT_FUNDS && status !== TxState.CONFLICTING) {
      if (txId === 'reward') {
        coins.mined += amount;
      } else if (sender === address) {
        coins.sent += amount;
      } else {
        coins.received += amount;
      }
    }
  });

  return coins;
};

const timeSpans = [{ label: 'daily' }, { label: 'monthly' }, { label: 'yearly' }];

const Transactions = ({ history }: RouteComponentProps) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [addressToAdd, setAddressToAdd] = useState('');

  const publicKey = useSelector((state: RootState) => state.wallet.accounts[state.wallet.currentAccountIndex].publicKey);
  const transactions = useSelector((state: RootState) => state.wallet.txsAndRewards[publicKey]);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  const getCoinStatistics = ({ filteredTransactions }: { filteredTransactions: Tx[] }) => {
    const coins = getNumOfCoinsFromTransactions({ publicKey, transactions: filteredTransactions });
    const totalCoins = getNumOfCoinsFromTransactions({ publicKey, transactions: transactions || [] });
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
    setSelectedItemIndex(index);
  };

  const filterTransactions = () => {
    const oneDayInMs = 86400000;
    const spanInDays = [1, 30, 365];
    const startDate = new Date().getTime() - spanInDays[selectedItemIndex] * oneDayInMs;
    return transactions ? Object.values(transactions).reduce((acc: Tx[], tx: any) => (tx.timestamp >= startDate || !tx.timestamp ? [...acc, tx] : acc), []) : [];
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
  const { mined, sent, received, totalMined, totalSent, totalReceived } = getCoinStatistics({ filteredTransactions });
  return (
    <Wrapper>
      <BackButton action={history.goBack} width={7} height={10} />
      <WrapperWith2SideBars width={680} header="TRANSACTION LOG" style={{ marginRight: 10 }} isDarkMode={isDarkMode}>
        <TransactionsListWrapper>
          {filteredTransactions && filteredTransactions.length ? (
            filteredTransactions.map((tx: Tx | Reward, index: number) =>
              tx.txId === 'reward' ? (
                <RewardRow key={index} tx={tx as Reward} />
              ) : (
                <TxRow tx={tx as Tx} publicKey={publicKey} addAddressToContacts={({ address }) => setAddressToAdd(`0x${address}`)} />
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
            data={timeSpans}
            DdElement={({ label, isMain }) => <TimeSpanEntry isInDropDown={!isMain}>{label}</TimeSpanEntry>}
            onClick={handlePress}
            selectedItemIndex={selectedItemIndex}
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
            filterName={timeSpans[selectedItemIndex].label}
          />
        </RightPaneWrapper>
      )}
    </Wrapper>
  );
};

export default Transactions;
