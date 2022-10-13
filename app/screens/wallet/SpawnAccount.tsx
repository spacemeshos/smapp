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
import { validateAddress } from '../../infra/utils';
import { AppThDispatch, RootState } from '../../types';
import { Contact } from '../../../shared/types';
import { MainPath } from '../../routerPaths';

interface Props extends RouteComponentProps {
  location: {
    hash: string;
    pathname: string;
    search: string;
    state: { contact: Contact };
  };
}

const SpawnAccount = ({ history }: Props) => {
  const [mode, setMode] = useState<1 | 2 | 3>(1);
  const [txId, setTxId] = useState('');
  const [fee, setFee] = useState(1);

  const status = useSelector((state: RootState) => state.node.status);
  const currentAccount = useSelector(
    (state: RootState) =>
      state.wallet.accounts[state.wallet.currentAccountIndex]
  );
  const currentBalance = useSelector(
    (state: RootState) => state.wallet.balances[currentAccount.address]
  );
  const dispatch: AppThDispatch = useDispatch();

  const proceedToConfirmation = () => setMode(2);

  const handleSendTransaction = async () => {
    const result = await dispatch(
      sendTransaction({ receiver: address, amount, fee, note })
    );
    if (result?.id) {
      setMode(3);
      setTxId(result.id);
    }
  };

  const renderTxParamsMode = () => <>TODO</>;

  switch (mode) {
    default: // Hopefully it never defaults, but in case that this happened at least render a first step
    case 1: {
      return renderTxParamsMode();
    }
    case 2: {
      return (
        <TxConfirmation
          address={address}
          fromAddress={currentAccount.address}
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
          fromAddress={currentAccount.address}
          amount={amount}
          txId={txId}
          doneAction={history.goBack}
          navigateToTxList={() => history.replace(MainPath.Transactions)}
        />
      );
    }
  }
};

export default SpawnAccount;
