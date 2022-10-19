// @flow
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { sendTransaction } from '../../redux/wallet/actions';
import {
  TxParams,
  TxSummary,
  TxConfirmation,
  TxSent,
} from '../../components/wallet';
import { CreateNewContact } from '../../components/contacts';
import { formatSmidge, validateAddress } from '../../infra/utils';
import { AppThDispatch, RootState } from '../../types';
import { Contact } from '../../../shared/types';
import { MainPath } from '../../routerPaths';
import { TxConfirmationFieldType } from '../../components/wallet/TxConfirmation';
import { TxSentFieldType } from '../../components/wallet/TxSent';

const MAX_GAS = 500; // TODO

interface Props extends RouteComponentProps {
  location: {
    hash: string;
    pathname: string;
    search: string;
    state: { contact: Contact };
  };
}

const SendCoins = ({ history, location }: Props) => {
  const [mode, setMode] = useState<1 | 2 | 3>(1);
  const [address, setAddress] = useState(
    location?.state?.contact.address || ''
  );
  const [hasAddressError, setHasAddressError] = useState(false);
  const [amount, setAmount] = useState(0);
  const [hasAmountError, setHasAmountError] = useState(false);
  const [note, setNote] = useState('');
  const [fee, setFee] = useState(1);
  const [txId, setTxId] = useState('');
  const [isCreateNewContactOn, setIsCreateNewContactOn] = useState(false);

  const status = useSelector((state: RootState) => state.node.status);
  const currentAccount = useSelector(
    (state: RootState) =>
      state.wallet.accounts[state.wallet.currentAccountIndex]
  );
  const currentBalance = useSelector(
    (state: RootState) => state.wallet.balances[currentAccount.address]
  );
  const contacts = useSelector((state: RootState) => state.wallet.contacts);
  const dispatch: AppThDispatch = useDispatch();

  const updateTxAddress = ({ value }: { value: string }) => {
    setAddress(value);
    setHasAddressError(false);
  };

  const updateTxAmount = (value: number) => {
    setAmount(value);
    setHasAmountError(false);
  };

  const updateTxNote = ({ value }: { value: any }) => {
    setNote(value);
  };

  const updateFee = ({ fee }: { fee: number }) => {
    setFee(fee);
  };

  const validateAmount = () => {
    return (
      amount + fee * MAX_GAS < (currentBalance?.projectedState?.balance || 0)
    );
  };

  const proceedToMode2 = () => {
    const addrValid = validateAddress(address);
    const amountValid = validateAmount();
    setHasAddressError(!addrValid);
    setHasAmountError(!amountValid);

    if (addrValid && amountValid) {
      setAddress(address.trim());
      setAmount(amount);
      setMode(2);
    }
  };

  const handleSendTransaction = async () => {
    const result = await dispatch(
      sendTransaction({ receiver: address, amount, fee, note })
    );
    if (result?.id) {
      setMode(3);
      setTxId(result.id);
    }
  };

  const renderTxParamsMode = () => {
    return (
      <>
        <TxParams
          fromAddress={currentAccount.address}
          address={address}
          hasAddressError={hasAddressError}
          updateTxAddress={updateTxAddress}
          resetAddressError={() => setHasAddressError(false)}
          amount={amount}
          updateTxAmount={updateTxAmount}
          hasAmountError={hasAmountError}
          resetAmountError={() => setHasAmountError(false)}
          updateFee={updateFee}
          note={note}
          updateTxNote={updateTxNote}
          cancelTx={history.goBack}
          nextAction={proceedToMode2}
          contacts={contacts}
          key="params"
        />
        {isCreateNewContactOn ? (
          <CreateNewContact
            isStandalone
            initialAddress={address}
            onCompleteAction={() => setIsCreateNewContactOn(false)}
            onCancel={() => setIsCreateNewContactOn(false)}
            key="newContact"
          />
        ) : (
          <TxSummary
            address={address}
            fromAddress={currentAccount.address}
            amount={parseInt(`${amount}`)}
            fee={fee}
            note={note}
            key="summary"
          />
        )}
      </>
    );
  };

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
              label: 'From',
              value: currentAccount.address,
            },
            {
              label: 'To',
              value: address,
            },
            {
              label: 'Note',
              value: note,
            },
            {
              label: 'Amount',
              value: formatSmidge(amount),
            },
            {
              label: 'Fee',
              value: `~${formatSmidge(fee * MAX_GAS)}`,
            },
            {
              label: 'Total',
              value: `~${formatSmidge(amount + fee * MAX_GAS)}`,
              type: TxConfirmationFieldType.Total,
            },
          ]}
          isDisabled={!status?.isSynced}
          doneAction={handleSendTransaction}
          editTx={() => setMode(1)}
          cancelTx={history.goBack}
        />
      );
    }
    case 3: {
      return (
        <TxSent
          fields={[
            {
              label: 'From',
              value: currentAccount.address,
            },
            {
              label: 'To',
              value: address,
            },
            {
              label: 'Amount',
              value: formatSmidge(amount),
              type: TxSentFieldType.Bold,
            },
          ]}
          txId={txId}
          doneAction={history.goBack}
          navigateToTxList={() => history.replace(MainPath.Transactions)}
        />
      );
    }
  }
};

export default SendCoins;
