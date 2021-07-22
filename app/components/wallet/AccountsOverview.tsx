import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentAccount } from '../../redux/wallet/actions';
import { DropDown, WrapperWith2SideBars } from '../../basicComponents';
import { copyBlack, copyWhite, explorer } from '../../assets/images';
import { getAbbreviatedText, getAddress, formatSmidge } from '../../infra/utils';
import { smColors } from '../../vars';
import { RootState } from '../../types';

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
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.realBlack)};
  &:hover {
    opacity: 1;
    color: ${({ theme }) => (theme.isDarkMode ? smColors.lightGray : smColors.darkGray50Alpha)};
  }
  ${({ isInDropDown }) =>
    isInDropDown &&
    `opacity: 0.5; color: ${smColors.realBlack}; &:hover {
    opacity: 1;
    color: ${(theme: any) => (theme.isDarkMode ? smColors.darkGray50Alpha : smColors.darkGray50Alpha)};
  }`}
`;

const AccountName = styled.div`
  font-family: SourceCodeProBold;
  font-size: 16px;
  line-height: 22px;
  cursor: inherit;
`;

const Address = styled.div`
  display: flex;
  flex-direction: row;
  align-self: center;
  font-size: 16px;
  line-height: 22px;
  cursor: inherit;
`;

const CopyIcon = styled.img`
  align-self: center;
  width: 16px;
  height: 15px;
  margin: 0 3px;
  cursor: pointer;
  &:hover {
    opacity: 0.5;
  }
  &:active {
    transform: translate3d(2px, 2px, 0);
  }
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

const CopiedText = styled.div`
  text-align: left;
  font-size: 16px;
  line-height: 20px;
  height: 20px;
  margin: -20px 0 5px 6px;
  color: ${smColors.green};
`;

const NotSyncedYetText = styled.div`
  font-size: 15px;
  line-height: 32px;
  color: ${smColors.orange};
`;

const ExplorerIcon = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-top: 2px;
`;

const AccountsOverview = () => {
  let copiedTimeout: any = null;
  const [isCopied, setIsCopied] = useState(false);
  useEffect(() => {
    return () => {
      clearTimeout(copiedTimeout);
    };
  });

  const isSynced = useSelector((state: RootState) => !!state.node.status?.isSynced);
  const meta = useSelector((state: RootState) => state.wallet.meta);
  const accounts = useSelector((state: RootState) => state.wallet.accounts);
  const currentAccountIndex = useSelector((state: RootState) => state.wallet.currentAccountIndex);
  const explorerUrl = useSelector((state: RootState) => state.network.explorerUrl);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const dispatch = useDispatch();

  const handleSetCurrentAccount = ({ index }: { index: number }) => {
    dispatch(setCurrentAccount({ index }));
  };

  const copyPublicAddress = async (e: React.MouseEvent) => {
    e.stopPropagation();
    copiedTimeout && clearTimeout(copiedTimeout);
    await navigator.clipboard.writeText(`0x${getAddress(accounts[currentAccountIndex].publicKey)}`);
    copiedTimeout = setTimeout(() => setIsCopied(false), 10000);
    setIsCopied(true);
  };

  const openExplorerLink = (e: React.MouseEvent, publicKey: string) => {
    e.stopPropagation();
    window.open(explorerUrl.concat(`accounts/${publicKey}${isDarkMode ? '?dark' : ''}`));
  };

  const renderAccountRow = ({ displayName, publicKey, isInDropDown = false }: { displayName: string; publicKey: string; isInDropDown?: boolean }) => (
    <AccountWrapper isInDropDown={isInDropDown}>
      <AccountName>{displayName}</AccountName>
      <Address>
        {getAbbreviatedText(getAddress(publicKey))}
        <CopyIcon src={isDarkMode ? copyWhite : copyBlack} onClick={copyPublicAddress} />
        <ExplorerIcon src={explorer} onClick={(e: React.MouseEvent) => openExplorerLink(e, `0x${getAddress(publicKey)}`)} />
      </Address>
    </AccountWrapper>
  );

  if (!accounts || !accounts.length) {
    return null;
  }
  const { displayName, publicKey, currentState } = accounts[currentAccountIndex];
  const { value, unit }: any = formatSmidge(currentState ? currentState.balance : 0, true);

  return (
    <WrapperWith2SideBars width={300} height={'calc(100% - 65px)'} header={meta.displayName} isDarkMode={isDarkMode}>
      <AccountDetails>
        {accounts.length > 1 ? (
          <DropDown
            data={accounts}
            DdElement={({ displayName, publicKey, isMain }) => renderAccountRow({ displayName, publicKey, isInDropDown: !isMain })}
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
      <CopiedText>{isCopied ? 'Address copied' : ''}</CopiedText>
      <Footer>
        <BalanceHeader>BALANCE</BalanceHeader>
        {isSynced && currentState ? (
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
