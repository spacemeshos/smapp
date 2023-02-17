import React, { useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import ExplorerButton from '../../basicComponents/ExplorerButton';
import CopyButton from '../../basicComponents/CopyButton';
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
import { SignMessage } from '../settings';

const AccountDetails = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;

const AccountWrapper = styled.div`
  display: flex;
  font-size: 14px;
  flex-direction: column;
  align-items: flex-start;
  margin: 5px 0;
  cursor: inherit;
  color: ${({ theme }) => theme.color.contrast};
`;

const AccountActionButton = styled.button`
  color: ${smColors.blue};

  cursor: pointer;

  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  line-height: 22px;
  background: none;
  border: none;
  outline: none;
  text-decoration: underline;
  text-align: left;

  padding: 0;
  margin: 3px 0;

  &:hover {
    text-decoration: none;
  }
`;

const SwitchAccountButton = styled(AccountActionButton)`
  color: ${smColors.orange};
`;

const AccountName = styled(BoldText)`
  font-size: 16px;
  line-height: 18px;
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

const StyledPostfix = styled.div`
  display: flex;
`;

const fadeInOut = keyframes`
  0% { opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { opacity: 0; }
`;

const CopiedBanner = styled.div`
  z-index: 10;
  color: ${smColors.darkerGreen};
  animation: 3s ${fadeInOut} ease-out;
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

  const [isSwitching, setIsSwitching] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

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

  const AccountPostfix = ({ address }: { address: string }) => {
    return (
      <StyledPostfix>
        <CopyButton secondary value={address} onClick={setCopiedAddress} />
        <ExplorerButton address={address} />
      </StyledPostfix>
    );
  };

  const showedData = accounts.map((item) => ({
    label: item.displayName,
    description:
      item.address === copiedAddress ? (
        <CopiedBanner>Copied</CopiedBanner>
      ) : (
        getAbbreviatedAddress(item.address)
      ),
    endAdorment: <AccountPostfix address={item.address} />,
  }));

  return (
    <WrapperWith2SideBars
      width={290}
      height={'calc(100% - 65px)'}
      header={meta.displayName}
    >
      <AccountDetails>
        {isSwitching && (
          <>
            <DropDown
              data={showedData}
              onClick={handleSetCurrentAccount}
              onClose={() => setIsSwitching(false)}
              isOpened
              hideHeader
              selectedItemIndex={currentAccountIndex}
              rowHeight={55}
              maxHeight={400}
            />
            <div>
              <SwitchAccountButton onClick={() => setIsSwitching(false)}>
                cancel
              </SwitchAccountButton>
            </div>
          </>
        )}
        {renderAccountRow({ displayName, address })}
        {accounts.length > 1 && !isSwitching && (
          <div>
            <SwitchAccountButton onClick={() => setIsSwitching(true)}>
              switch account
            </SwitchAccountButton>
          </div>
        )}
        <AccountActionButton onClick={() => setIsSigning(true)}>
          sign message
        </AccountActionButton>
        {isSigning && (
          <SignMessage
            index={currentAccountIndex}
            close={() => setIsSigning(false)}
          />
        )}
      </AccountDetails>
      <Footer>
        <BalanceHeader>BALANCE</BalanceHeader>
        <BalanceWrapper
          isSynced={isSynced}
          title={[
            isSynced ? 'Your current balance' : 'Last synced balance',
            ': ',
            balance?.currentState?.balance || 0,
            ' Smidge',
          ].join('')}
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
