import React from 'react';
import styled, { css } from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentAccount } from '../../redux/wallet/actions';
import {
  BoldText,
  DropDown,
  WrapperWith2SideBars,
} from '../../basicComponents';
import { getAbbreviatedAddress, parseSmidge } from '../../infra/utils';
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
  color: ${({ theme }) => theme.color.contrast};
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
  color: ${({ theme: { color } }) => color.primary};
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
  const dispatch = useDispatch();

  const handleSetCurrentAccount = ({ index }: { index: number }) => {
    dispatch(setCurrentAccount(index));
  };

  const renderAccountRow = ({
    displayName,
    address,
  }: {
    displayName: string;
    address: string;
  }) => (
    <AccountWrapper>
      <AccountName>{displayName}</AccountName>
      <Address address={address} />
    </AccountWrapper>
  );

  if (!accounts || !accounts.length) {
    return null;
  }
  const { displayName, address } = accounts[currentAccountIndex];
  const balance = balances[address];
  const { value, unit } = parseSmidge(balance?.currentState?.balance || 0);

  return (
    <WrapperWith2SideBars
      width={290}
      height={'calc(100% - 65px)'}
      header={meta.displayName}
    >
      <AccountDetails>
        {accounts.length > 1 ? (
          <DropDown
            data={accounts.map((item) => ({
              label: item.displayName,
              description: getAbbreviatedAddress(item.address),
            }))}
            onClick={handleSetCurrentAccount}
            selectedItemIndex={currentAccountIndex}
            rowHeight={55}
          />
        ) : (
          renderAccountRow({ displayName, address })
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
