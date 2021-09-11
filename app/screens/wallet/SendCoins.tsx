// @flow
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { sendTransaction } from '../../redux/wallet/actions';
import { TxParams, TxSummary, TxConfirmation, TxSent } from '../../components/wallet';
import { CreateNewContact } from '../../components/contacts';
import { getAddress } from '../../infra/utils';
import { RootState } from '../../types';
import { Contact } from '../../../shared/types';

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
  const [address, setAddress] = useState(location?.state?.contact.address || '');
  const [hasAddressError, setHasAddressError] = useState(false);
  const [amount, setAmount] = useState(0);
  const [hasAmountError, setHasAmountError] = useState(false);
  const [note, setNote] = useState('');
  const [fee, setFee] = useState(1);
  const [txId, setTxId] = useState('');
  const [isCreateNewContactOn, setIsCreateNewContactOn] = useState(false);

  const status = useSelector((state: RootState) => state.node.status);
  const currentAccount = useSelector((state: RootState) => state.wallet.accounts[state.wallet.currentAccountIndex]);
  const contacts = useSelector((state: RootState) => state.wallet.contacts);
  // const lastUsedContacts = useSelector((state: RootState) => state.wallet.lastUsedContacts);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const dispatch = useDispatch();

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

  const validateAddress = () => {
    const trimmedValue = address ? address.trim() : '';
    return (
      // @ts-ignore
      trimmedValue && (trimmedValue.startsWith('0x') !== -1 ? trimmedValue.length === 42 : trimmedValue.length === 40) && trimmedValue !== getAddress(currentAccount.publicKey)
    );
  };

  const validateAmount = () => {
    return !!amount && amount + fee < currentAccount.currentState.balance;
  };

  const proceedToMode2 = () => {
    if (!validateAddress()) {
      setHasAddressError(true);
    }
    if (!validateAmount()) {
      setHasAmountError(true);
    } else {
      let trimmedAddress = address.trim();
      trimmedAddress = trimmedAddress.startsWith('0x') ? trimmedAddress.substring(2) : trimmedAddress;
      setAddress(trimmedAddress);
      setAmount(amount);
      setMode(2);
    }
  };

  // const cancelTxProcess = () => {
  //   history.push('/main/wallet');
  // };

  const handleSendTransaction = async () => {
    const txId: any = await dispatch(sendTransaction({ receiver: address, amount, fee, note }));
    setMode(3);
    setTxId(txId);
  };

  const renderTxParamsMode = () => {
    return (
      <>
        <TxParams
          fromAddress={currentAccount.publicKey}
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
          isDarkMode={isDarkMode}
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
          <TxSummary address={address} fromAddress={currentAccount.publicKey} amount={parseInt(`${amount}`)} fee={fee} note={note} key="summary" />
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
          address={address}
          fromAddress={currentAccount.publicKey}
          amount={parseInt(`${amount}`)}
          fee={fee}
          note={note}
          canSend={!!status?.isSynced}
          doneAction={handleSendTransaction}
          editTx={() => setMode(1)}
          cancelTx={history.goBack}
        />
      );
    }
    case 3: {
      return (
        <TxSent
          address={address}
          fromAddress={currentAccount.publicKey}
          amount={amount}
          txId={txId}
          doneAction={history.goBack}
          isDarkMode={isDarkMode}
          navigateToTxList={() => history.replace('/main/transactions')}
        />
      );
    }
  }
};

export default SendCoins;
