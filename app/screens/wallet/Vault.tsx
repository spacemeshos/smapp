import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { NewVault, VaultType, VaultMasterAccount, VaultMasterAccounts, DailySpending, VaultTx, ReviewNewVault, VaultFinish } from '../../components/vault';
import { CorneredContainer } from '../../components/common';
import { vault } from '../../assets/images';
import { Link, Button } from '../../basicComponents';
import { Account, RootState } from '../../types';
import { eventsService } from '../../infra/eventsService';
import { setCurrentMode } from '../../redux/wallet/actions';
import { formatSmidge } from '../../infra/utils';

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
  align-items: flex-end;
`;

const WrapperVault = styled.div`
  & > div {
    height: auto;
    min-height: 100%;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
`;

const WrapperLink = styled.div`
  display: flex;
  align-items: flex-end;
  & > div:first-child {
    margin-right: 10px;
  }
`;

const Vault = ({ history }: RouteComponentProps) => {
  const [name, setName] = useState('My Vault');
  const [type, setType] = useState('single');
  const [accountsOption, setAccountsOption] = useState<Array<any>>([]);
  const [masterAccountIndex, setMasterAccountIndex] = useState(0);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const vaultMode = useSelector((state: RootState) => state.wallet.vaultMode);
  const accounts: Account[] = useSelector((state: RootState) => state.wallet.accounts);

  const dispatch = useDispatch();

  const createOptionArray = () => {
    const objOption = accounts.map((elem, index: number) => ({
      account: index,
      label: elem.displayName,
      text: formatSmidge(elem.balance)
    }));
    setAccountsOption(objOption);
  };

  useEffect(() => createOptionArray(), []);

  const handleChangeVaultName = ({ value }: { value: string }) => {
    setName(value);
  };

  const handleChangeType = ({ value }: { value: string }) => {
    setType(value);
  };

  const saveAndFinish = () => {
    dispatch(setCurrentMode({ mode: 0 }));
  };

  const handleModeUp = () => {
    dispatch(setCurrentMode({ mode: vaultMode + 1 }));
  };

  const selectAccountIndex = ({ index }: { index: number }) => {
    setMasterAccountIndex(index);
  };

  const navigateToVaultSetup = () => eventsService.openExternalLink({ link: 'https://product.spacemesh.io/#/smapp_vaults' });

  const Steps = new Map();

  // Each step has different configuration depending on the type
  Steps.set('single', [
    {
      step: 0,
      header: 'NEW VAULT',
      subHeader: 'A vault is an enhanced account with extra security and spending features.',
      component: <NewVault vaultName={name} onChangeVaultName={handleChangeVaultName} isDarkMode={isDarkMode} />,
      nextButton: <Button text="NEXT" onClick={handleModeUp} isDisabled={name.length === 0} style={{ marginTop: 'auto' }} />,
      finishButton: null
    },
    {
      step: 1,
      header: 'VAULT TYPE',
      subHeader: 'Select vault’s type from one of the options below.',
      component: <VaultType handleChangeType={handleChangeType} type={type} isDarkMode={isDarkMode} />,
      nextButton: <Button text="NEXT" onClick={handleModeUp} isDisabled={name.length === 0} style={{ marginTop: 'auto' }} />,
      finishButton: null
    },
    {
      step: 2,
      header: 'VAULT MASTER ACCOUNT',
      subHeader: 'The master account is the account that will be used to perform vault operations such as withdrawing funds.',
      component: <VaultMasterAccount masterAccountIndex={masterAccountIndex} selectedAccountIndex={selectAccountIndex} isDarkMode={isDarkMode} accountsOption={accountsOption} />,
      nextButton: <Button text="NEXT" onClick={handleModeUp} isDisabled={name.length === 0} style={{ marginTop: 'auto' }} />,
      finishButton: null
    },
    {
      step: 3,
      header: 'DAILY SPENDING',
      subHeader: 'Select vault’s type from one of the options below.',
      component: <DailySpending masterAccountIndex={masterAccountIndex} selectAccountIndex={selectAccountIndex} accountsOption={accountsOption} isDarkMode={isDarkMode} />,
      nextButton: <Button text="NEXT" onClick={handleModeUp} isDisabled={name.length === 0} style={{ marginTop: 'auto' }} />,
      finishButton: <Link onClick={handleModeUp} text="SKIP" />
    },
    {
      step: 4,
      header: 'CREATE VAULT TRANSACTION',
      subHeader: 'Select a wallet’s account to execute the create vault transaction and set an amount to transfer from the account to the new vault.',
      component: (
        <VaultTx
          selectAccountIndex={selectAccountIndex}
          selectFundAmount={selectAccountIndex}
          selectGasPrice={selectAccountIndex}
          selectGasUnits={selectAccountIndex}
          isDarkMode={isDarkMode}
        />
      ),
      nextButton: <Button text="NEXT" onClick={handleModeUp} isDisabled={name.length === 0} style={{ marginTop: 'auto' }} />,
      finishButton: <Link onClick={saveAndFinish} text="SAVE AND FINISH LATER" />
    },
    {
      step: 5,
      header: 'REVIEW NEW VAULT',
      subHeader: 'Review your new vault information.',
      component: <ReviewNewVault isDarkMode={isDarkMode} />,
      nextButton: <Button text="CREATE VAULT" onClick={handleModeUp} isDisabled={name.length === 0} style={{ marginTop: 'auto' }} />,
      finishButton: <Button text="CANCEL" onClick={history.goBack} isDisabled={name.length === 0} style={{ marginTop: 'auto' }} isPrimary={false} />
    },
    {
      step: 6,
      header: 'NEW VAULT SUBMITTED!',
      subHeader: '',
      component: <VaultFinish isDarkMode={isDarkMode} />,
      nextButton: <Button text="DONE" onClick={history.goBack} isDisabled={name.length === 0} style={{ marginTop: 'auto' }} />,
      finishButton: null
    }
  ]);

  Steps.set('multi-sig', [
    {
      step: 0,
      header: 'NEW VAULT',
      subHeader: 'A vault is an enhanced account with extra security and spending features.',
      component: <NewVault vaultName={name} onChangeVaultName={handleChangeVaultName} isDarkMode={isDarkMode} />,
      nextButton: <Button text="NEXT" onClick={handleModeUp} isDisabled={name.length === 0} style={{ marginTop: 'auto' }} />,
      finishButton: null
    },
    {
      step: 1,
      header: 'VAULT TYPE',
      subHeader: 'Select vault’s type from one of the options below.',
      component: <VaultType handleChangeType={handleChangeType} type={type} isDarkMode={isDarkMode} />,
      nextButton: <Button text="NEXT" onClick={handleModeUp} isDisabled={name.length === 0} style={{ marginTop: 'auto' }} />,
      finishButton: null
    },
    {
      step: 2,
      header: 'VAULT MASTER ACCOUNT',
      subHeader: 'The master account is the account that will be used to perform vault operations such as withdrawing funds.',
      component: <VaultMasterAccounts masterAccountIndex={masterAccountIndex} selectAccountIndex={selectAccountIndex} isDarkMode={isDarkMode} accountsOption={accountsOption} />,
      nextButton: <Button text="NEXT" onClick={handleModeUp} isDisabled={name.length === 0} style={{ marginTop: 'auto' }} />,
      finishButton: <Link onClick={saveAndFinish} text="SAVE AND FINISH LATER" />
    },
    {
      step: 3,
      header: 'DAILY SPENDING',
      subHeader: 'Select vault’s type from one of the options below.',
      component: <DailySpending masterAccountIndex={masterAccountIndex} selectAccountIndex={selectAccountIndex} accountsOption={accountsOption} isDarkMode={isDarkMode} />,
      nextButton: <Button text="NEXT" onClick={handleModeUp} isDisabled={name.length === 0} style={{ marginTop: 'auto' }} />,
      finishButton: <Link onClick={handleModeUp} text="SKIP" />
    },
    {
      step: 4,
      header: 'CREATE VAULT TRANSACTION',
      subHeader: 'Select a wallet’s account to execute the create vault transaction and set an amount to transfer from the account to the new vault.',
      component: (
        <VaultTx
          selectAccountIndex={selectAccountIndex}
          selectFundAmount={selectAccountIndex}
          selectGasPrice={selectAccountIndex}
          selectGasUnits={selectAccountIndex}
          isDarkMode={isDarkMode}
        />
      ),
      nextButton: <Button text="NEXT" onClick={handleModeUp} isDisabled={name.length === 0} style={{ marginTop: 'auto' }} />,
      finishButton: <Link onClick={saveAndFinish} text="SAVE AND FINISH LATER" />
    },
    {
      step: 5,
      header: 'REVIEW NEW VAULT',
      subHeader: 'Review your new vault information.',
      component: <ReviewNewVault isDarkMode={isDarkMode} />,
      nextButton: <Button text="CREATE VAULT" onClick={handleModeUp} isDisabled={name.length === 0} style={{ marginTop: 'auto' }} />,
      finishButton: <Button text="CANCEL" onClick={history.goBack} isDisabled={name.length === 0} style={{ marginTop: 'auto' }} isPrimary={false} />
    },
    {
      step: 6,
      header: 'NEW VAULT SUBMITTED!',
      subHeader: '',
      component: <VaultFinish isDarkMode={isDarkMode} />,
      nextButton: <Button text="DONE" onClick={history.goBack} isDisabled={name.length === 0} style={{ marginTop: 'auto' }} />,
      finishButton: null
    }
  ]);

  const renderVaultSteps = () => {
    switch (vaultMode) {
      case 0: {
        return Steps.get(type)[0].component;
      }
      case 1: {
        return Steps.get(type)[1].component;
      }
      case 2: {
        return Steps.get(type)[2].component;
      }
      case 3: {
        return Steps.get(type)[3].component;
      }
      case 4: {
        return Steps.get(type)[4].component;
      }
      case 5: {
        return Steps.get(type)[5].component;
      }
      case 6: {
        return Steps.get(type)[6].component;
      }
      default: {
        return null;
      }
    }
  };

  return (
    <WrapperVault>
      <CorneredContainer
        width={700}
        height={412}
        header={Steps.get(type)[vaultMode].header}
        headerIcon={vault}
        subHeader={Steps.get(type)[vaultMode].subHeader}
        isDarkMode={isDarkMode}
        useEmptyWrap
      >
        {renderVaultSteps()}
        <Footer>
          <Link onClick={navigateToVaultSetup} text="VAULT SETUP GIDE" />
          <WrapperLink>
            {Steps.get(type)[vaultMode].finishButton}
            {Steps.get(type)[vaultMode].nextButton}
          </WrapperLink>
        </Footer>
      </CorneredContainer>
    </WrapperVault>
  );
};

export default Vault;
