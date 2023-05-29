import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentAccount } from '../../redux/wallet/actions';
import { DropDown, WrapperWith2SideBars } from '../../basicComponents';
import { formatSmidge } from '../../infra/utils';
import { smColors } from '../../vars';
import { RootState } from '../../types';
import Address from '../common/Address';

const AccountDetails = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
`;

const AccountWrapper = styled.div<{ isInDropDown: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 5px;
  cursor: inherit;
  color: ${({ theme }) =>
    theme.isDarkMode ? smColors.white : smColors.realBlack};
  &:hover {
    opacity: 1;
    color: ${({ theme }) =>
      theme.isDarkMode ? smColors.lightGray : smColors.darkGray50Alpha};
  }
  ${({ isInDropDown }) =>
    isInDropDown &&
    `opacity: 0.5; color: ${smColors.realBlack}; &:hover {
    opacity: 1;
    color: ${(theme: any) =>
      theme.isDarkMode ? smColors.darkGray50Alpha : smColors.darkGray50Alpha};
  }`}
`;

const AccountName = styled.div`
  font-family: SourceCodeProBold;
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
  margin-bottom: 10px;
  font-size: 13px;
  line-height: 17px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
`;

const BalanceWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;

const BalanceAmount = styled.div`
  font-size: 32px;
  line-height: 40px;
  color: ${smColors.green};
`;

const SmhText = styled.div`
  font-size: 17px;
  line-height: 32px;
  color: ${smColors.green};
`;

const NotSyncedYetText = styled.div`
  font-size: 15px;
  line-height: 32px;
  color: ${smColors.orange};
`;

const AccountsOverview = () => {
  const isSynced = useSelector(
    (state: RootState) => !!state.node.status?.isSynced
  );
  const meta = useSelector((state: RootState) => state.wallet.meta);
  const accounts = useSelector((state: RootState) => state.wallet.accounts);
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
    isInDropDown = false,
  }: {
    displayName: string;
    publicKey: string;
    isInDropDown?: boolean;
  }) => (
    <AccountWrapper isInDropDown={isInDropDown}>
      <AccountName>{displayName}</AccountName>
      <Address address={publicKey} />
    </AccountWrapper>
  );

  if (!accounts || !accounts.length) {
    return null;
  }
  const { displayName, publicKey, currentState } = accounts[
    currentAccountIndex
  ];
  const { value, unit }: any = formatSmidge(
    currentState ? currentState.balance : 0,
    true
  );

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
            data={accounts}
            DdElement={({ displayName, publicKey, isMain }) =>
              renderAccountRow({
                displayName,
                publicKey,
                isInDropDown: !isMain,
              })
            }
            onClick={handleSetCurrentAccount}
            selectedItemIndex={currentAccountIndex}
            rowHeight={55}
            whiteIcon={isDarkMode}
            isDarkMode={isDarkMode}
            rowContentCentered={false}
            bgColor={isDarkMode ? smColors.black : smColors.white}
          />
        ) : (
          renderAccountRow({ displayName, publicKey })
        )}
      </AccountDetails>
      <Footer>
        <BalanceHeader>BALANCE</BalanceHeader>
        {isSynced ? (
          <BalanceWrapper>
            <BalanceAmount>{value}</BalanceAmount>
            <SmhText>{unit}</SmhText>
          </BalanceWrapper>
        ) : (
          <NotSyncedYetText>Syncing...</NotSyncedYetText>
        )}
      </Footer>
    </WrapperWith2SideBars>
  );
};

export default AccountsOverview;
