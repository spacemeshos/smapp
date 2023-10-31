import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { SingleSigTemplate } from '@spacemesh/sm-codec';
import { TxConfirmation, TxSent } from '../../components/wallet';
import { formatSmidge } from '../../infra/utils';
import { RootState } from '../../types';
import { Contact } from '../../../shared/types';
import { MainPath } from '../../routerPaths';
import { eventsService } from '../../infra/eventsService';
import {
  BoldText,
  Button,
  DropDown,
  ErrorPopup,
  Link,
} from '../../basicComponents';
import { smColors } from '../../vars';
import { TxSentFieldType } from '../../components/wallet/TxSent';
import Address from '../../components/common/Address';
import { SingleSigMethods } from '../../../shared/templateConsts';
import getFees from '../../components/wallet/getFees';
import { captureReactBreadcrumb } from '../../sentry';

interface Props extends RouteComponentProps {
  location: {
    hash: string;
    pathname: string;
    search: string;
    state: { contact: Contact };
  };
}

// TODO: Get rid of code duplication
// and partial duplication of SendCoins, TxParams, and etc
// and make the generic SendTransaction screen instead

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 525px;
  height: 100%;
  margin-right: 10px;
  padding: 10px 15px;
  background-color: ${({ theme: { wrapper } }) => wrapper.color};
  ${({ theme }) => `border-radius: ${theme.box.radius}px;`}
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const HeaderText = styled(BoldText)`
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme: { color } }) => color.primary};
`;

const SubHeader = styled(HeaderText)`
  margin-bottom: 25px;
`;

const DetailsRow = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

const DetailsText = styled.div`
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => theme.color.contrast};
`;

const Dots = styled.div`
  flex: 1;
  flex-shrink: 1;
  overflow: hidden;
  margin-right: 12px;
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => theme.color.contrast};
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
  align-items: flex-end;
`;

const DropDownContainer = styled.div`
  width: 240px;
`;

const SpawnAccount = ({ history }: Props) => {
  const [mode, setMode] = useState<1 | 2 | 3>(1);
  const [txId, setTxId] = useState('');
  const [fee, setFee] = useState(1);
  const [maxGas, setMaxGas] = useState(0);
  const [realFee, setRealFee] = useState(0);
  const [hasAmountError, setHasAmountError] = useState(false);
  const [selectedFeeIndex, setSelectedFeeIndex] = useState(0);

  const status = useSelector((state: RootState) => state.node.status);
  const currentAccountIndex = useSelector(
    (state: RootState) => state.wallet.currentAccountIndex
  );
  const currentAccount = useSelector(
    (state: RootState) => state.wallet.accounts[currentAccountIndex]
  );
  const currentBalance = useSelector(
    (state: RootState) => state.wallet.balances[currentAccount.address]
  );

  const fees = getFees(maxGas);

  useEffect(() => {
    (async () => {
      const parsedMaxGas = await eventsService.getTxMaxGas({
        templateAddress: SingleSigTemplate.key,
        method: SingleSigMethods.Spawn,
        payload: { fee: 1 },
        accountIndex: currentAccountIndex,
      });
      parsedMaxGas > 0 && setMaxGas(parsedMaxGas);
    })();
  }, [currentAccountIndex]);

  const updateFee = (fee: number) => setFee(fee);
  const selectFee = ({ index }: { index: number }) => {
    updateFee(fees[index].fee);
    setSelectedFeeIndex(index);
    captureReactBreadcrumb({
      category: 'Spawn Account',
      data: {
        action: 'Select fee',
      },
      level: 'info',
    });
  };

  const resetAmountError = () => {
    setHasAmountError(false);
    captureReactBreadcrumb({
      category: 'Spawn Account',
      data: {
        action: 'Reset Amount error',
      },
      level: 'info',
    });
  };

  const validateAmount = () => {
    captureReactBreadcrumb({
      category: 'Spawn Account',
      data: {
        action: 'Check validate amount',
      },
      level: 'info',
    });
    return fee * maxGas < (currentBalance?.projectedState?.balance || 0);
  };

  const proceedToConfirmation = () => {
    const amountValid = validateAmount();
    captureReactBreadcrumb({
      category: 'Spawn Account',
      data: {
        action: 'Click button next',
      },
      level: 'info',
    });
    if (!amountValid) {
      setHasAmountError(true);
      captureReactBreadcrumb({
        category: 'Spawn Account',
        data: {
          action: 'button Next without amount valid',
        },
        level: 'info',
      });
      return;
    }
    setMode(2);
  };

  const handleSendTransaction = async () => {
    const result = await eventsService.spawnTx(fee, currentAccountIndex);
    captureReactBreadcrumb({
      category: 'Spawn Account',
      data: {
        action: 'Send Transaction',
      },
      level: 'info',
    });
    if (result.tx?.id) {
      setMode(3);
      setTxId(result.tx.id);
      setRealFee(result.tx.gas.fee);
      captureReactBreadcrumb({
        category: 'Spawn Account',
        data: {
          action: 'Navigate to transaction send',
        },
        level: 'info',
      });
    }
  };

  const navigateToCancelTransaction = () => {
    history.replace(MainPath.Wallet);
    captureReactBreadcrumb({
      category: 'Spawn Account',
      data: {
        action: 'Click link cancel transaction',
      },
      level: 'info',
    });
  };

  const errorPopupStyle = { top: -5, right: -255, maxWidth: 250 };
  const renderTxParamsMode = () => (
    <Wrapper>
      <Header>
        <HeaderText>Send SMH</HeaderText>
        <Link
          onClick={navigateToCancelTransaction}
          text="CANCEL TRANSACTION"
          style={{ color: smColors.orange }}
        />
      </Header>
      <SubHeader>--</SubHeader>
      <DetailsRow>
        <DetailsText>Self-Spawn</DetailsText>
        <Dots>....................................</Dots>
        <DetailsText>
          <Address address={currentAccount.address} suffix="(Me)" />
        </DetailsText>
      </DetailsRow>
      <DetailsRow>
        <DetailsText>Fee</DetailsText>
        <Dots>....................................</Dots>
        <DropDownContainer>
          <DropDown
            data={fees}
            onClick={selectFee}
            selectedItemIndex={selectedFeeIndex}
            rowHeight={40}
            hideSelectedItem
          />
        </DropDownContainer>
        {hasAmountError && (
          <ErrorPopup
            onClick={resetAmountError}
            text="You don't have enough Smidge on the balance"
            style={errorPopupStyle}
          />
        )}
      </DetailsRow>
      <Footer>
        <Button onClick={proceedToConfirmation} text="NEXT" />
      </Footer>
    </Wrapper>
  );

  switch (mode) {
    default: // Hopefully it never defaults, but in case that this happened at least render a first step
    case 1: {
      return renderTxParamsMode();
    }
    case 2: {
      return (
        <TxConfirmation
          fields={[
            {
              label: 'Address',
              value: currentAccount.address,
            },
            {
              label: 'Fee',
              value: formatSmidge(fee * maxGas),
            },
          ]}
          isDisabled={!status?.isSynced}
          doneAction={handleSendTransaction}
          editTx={() => setMode(1)}
          backButtonRoute={MainPath.Wallet}
        />
      );
    }
    case 3: {
      return (
        <TxSent
          fields={[
            {
              label: 'Address',
              value: currentAccount.address,
            },
            {
              label: 'Fee',
              value: formatSmidge(realFee),
              type: TxSentFieldType.Bold,
            },
          ]}
          txId={txId}
          doneButtonRoute={MainPath.Wallet}
          navigateToTxList={() => history.replace(MainPath.Transactions)}
        />
      );
    }
  }
};

export default SpawnAccount;
