import { shell } from 'electron';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { NewVault, VaultType, VaultMasterAccount, VaultMasterAccounts, DailySpending, VaultTx, ReviewNewVault, VaultFinish } from '../../components/vault';
import { CorneredContainer } from '../../components/common';
import { vault } from '../../assets/images';
import { Link, Button } from '../../basicComponents';
import { RootState } from '../../types';

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
  align-items: flex-end;
`;

const headers = [
  'NEW VAULT',
  'VAULT TYPE',
  'VAULT MASTER ACCOUNT',
  'VAULT MASTER ACCOUNTS',
  'DAILY SPENDING',
  'CREATE VAULT TRANSACTION',
  'REVIEW NEW VAULT',
  'NEW VAULT SUBMITTED!'
];
const subHeader = [
  'A vault is an enhanced account with extra security and spending features.',
  'Select vault’s type from one of the options below.',
  'The master account is the account that will be used to perform vault operations such as withdrawing funds.',
  'Set your vault’s 3 master addresses. Approval of 2 out of 3 address’ owners is needed to use this vault.',
  'You can set a daily spending limit which only requires one account to withdraw up to a daily spending limit from your vault.',
  'Select a wallet’s account to execute the create vault transaction and set an amount to transfer from the account to the new vault.',
  'Review your new vault information.',
  ''
];

const Vault = () => {
  const [mode, setMode] = useState(0);
  const [name, setName] = useState('');
  const [type, setType] = useState('single');
  const [masterAccountIndex, setMasterAccountIndex] = useState(0);

  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  const handleChangeVaultName = ({ value }: { value: string }) => {
    setName(value);
  };

  const handleChangeType = ({ value }: { value: string }) => {
    setType(value);
  };

  const handleNext = () => {
    setMode(mode + 1);
  };

  const selectAccountIndex = ({ index }: { index: number }) => {
    setMasterAccountIndex(index);
  };

  const renderVaultSteps = () => {
    switch (mode) {
      case 0: {
        return <NewVault vaultName={name} onChangeVaultName={handleChangeVaultName} isDarkMode={isDarkMode} />;
      }
      case 1: {
        return <VaultType handleChangeType={handleChangeType} type={type} isDarkMode={isDarkMode} />;
      }
      case 2: {
        return <VaultMasterAccount masterAccountIndex={masterAccountIndex} selectedAccountIndex={selectAccountIndex} isDarkMode={isDarkMode} />;
      }
      case 3: {
        return <VaultMasterAccounts masterAccountIndex={masterAccountIndex} selectAccountIndex={selectAccountIndex} isDarkMode={isDarkMode} />;
      }
      case 4: {
        return <DailySpending masterAccountIndex={masterAccountIndex} selectAccountIndex={selectAccountIndex} isDarkMode={isDarkMode} />;
      }
      case 5: {
        return (
          <VaultTx
            selectAccountIndex={selectAccountIndex}
            selectFundAmount={selectAccountIndex}
            selectGasPrice={selectAccountIndex}
            selectGasUnits={selectAccountIndex}
            isDarkMode={isDarkMode}
          />
        );
      }
      case 6: {
        return <ReviewNewVault isDarkMode={isDarkMode} />;
      }
      case 7: {
        return <VaultFinish isDarkMode={isDarkMode} />;
      }
      default: {
        return null;
      }
    }
  };

  const navigateToVaultSetup = () => shell.openExternal('https://product.spacemesh.io/#/smapp_vaults');

  return (
    <CorneredContainer width={650} height={400} header={headers[mode]} headerIcon={vault} subHeader={subHeader[mode]} isDarkMode={isDarkMode} useEmptyWrap>
      {renderVaultSteps()}
      <Footer>
        <Link onClick={navigateToVaultSetup} text="VAULT SETUP GIDE" />
        <Button text="NEXT" onClick={handleNext} isDisabled={name.length === 0} style={{ marginTop: 'auto' }} />
      </Footer>
    </CorneredContainer>
  );
};

export default Vault;
