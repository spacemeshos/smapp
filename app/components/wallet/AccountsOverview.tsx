import React from 'react';
import styled, { css } from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentAccount } from '../../redux/wallet/actions';
import {
  BoldText,
  DropDown,
  WrapperWith2SideBars,
} from '../../basicComponents';
import { parseSmidge } from '../../infra/utils';
import { smColors } from '../../vars';
import { RootState } from '../../types';
import Address from '../common/Address';

const AccountDetails = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
`;

const AccountWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 5px;
  cursor: inherit;
  color: ${({ theme }) =>
    theme.isDarkMode ? smColors.white : smColors.realBlack};
`;

const AccountName = styled(BoldText)`
  font-size: 16px;
  line-height: 22px;
  cursor: inherit;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: flex-end;
`;

const BalanceHeader = styled.div`
  font-size: 13px;
  line-height: 17px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
`;

const BalanceWrapper = styled.div<{ isSynced?: boolean }>`
  color: ${({ isSynced }) => (isSynced ? smColors.green : smColors.mediumGray)};
  font-size: 6px;

  ${({ isSynced }) =>
    !isSynced &&
    css`
      &:before {
        content: 'Syncing...';
        display: block;
        font-size: 14px;
        line-height: 20px;
        margin-top: 4px;
        color: ${smColors.orange};
      }
    `}
`;

const BalanceAmount = styled.div`
  display: inline-block;
  font-size: 32px;
`;

const UnitsText = styled.div`
  display: inline-block;
  font-size: 17px;
`;

const AccountsOverview = () => {
  const isSynced = useSelector(
    (state: RootState) => !!state.node.status?.isSynced
  );
  const meta = useSelector((state: RootState) => state.wallet.meta);
  const accounts = useSelector((state: RootState) => state.wallet.accounts);
  const balances = useSelector((state: RootState) => state.wallet.balances);
  const currentAccountIndex = useSelector(
    (state: RootState) => state.wallet.currentAccountIndex
  );
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const dispatch = useDispatch();

  const handleSetCurrentAccount = ({ index }: { index: number }) => {
    dispatch(setCurrentAccount(index));
  };

  const renderAccountRow = ({
    displayName,
    publicKey,
  }: {
    displayName: string;
    publicKey: string;
  }) => (
    <AccountWrapper>
      <AccountName>{displayName}</AccountName>
      <Address address={publicKey} />
    </AccountWrapper>
  );

  if (!accounts || !accounts.length) {
    return null;
  }
  const { displayName, publicKey } = accounts[currentAccountIndex];
  const balance = balances[publicKey];
  const { value, unit } = parseSmidge(balance?.currentState?.balance || 0);

  return (
    <WrapperWith2SideBars
      width={290}
      height={'calc(100% - 65px)'}
      header={meta.displayName}
      isDarkMode={isDarkMode}
    >
      <AccountDetails>
        {accounts.length > 1 ? (
          <DropDown
            data={accounts.map((item) => ({
              label: item.displayName,
            }))}
            onClick={handleSetCurrentAccount}
            selectedItemIndex={currentAccountIndex}
            rowHeight={55}
          />
        ) : (
          renderAccountRow({ displayName, publicKey })
        )}
      </AccountDetails>
      <Footer>
        <BalanceHeader>BALANCE</BalanceHeader>
        <BalanceWrapper
          isSynced={isSynced}
          title={isSynced ? 'Your current balance' : 'Last synced balance'}
        >
          <BalanceAmount>{value}</BalanceAmount>
          &nbsp;
          <UnitsText>{unit}</UnitsText>
        </BalanceWrapper>
      </Footer>
    </WrapperWith2SideBars>
  );
};

export default AccountsOverview;
