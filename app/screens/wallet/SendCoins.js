// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sendTransaction } from '/redux/wallet/actions';
import { TxParams, TxSummary, TxConfirmation, TxSent } from '/components/wallet';
import { CreateNewContact } from '/components/contacts';
import type { RouterHistory } from 'react-router-dom';
import type { Account, Contact, Action } from '/types';

type Props = {
  contacts: Contact[],
  lastUsedContacts: Contact[],
  currentAccount: Account,
  sendTransaction: Action,
  history: RouterHistory,
  isConnected: boolean,
  location: { state?: { contact: Contact } }
};

type State = {
  mode: 1 | 2 | 3,
  address: string,
  hasAddressError: boolean,
  amount: number,
  hasAmountError: boolean,
  note: string,
  fee: number,
  txId: string,
  isCreateNewContactOn: boolean
};

class SendCoins extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { location } = props;
    this.state = {
      mode: 1,
      address: location?.state?.contact.address || '',
      hasAddressError: false,
      amount: 0,
      hasAmountError: false,
      note: '',
      fee: 1,
      txId: '',
      isCreateNewContactOn: false
    };
  }

  render() {
    const { currentAccount, history, isConnected } = this.props;
    const { mode, address, amount, fee, note, txId } = this.state;
    switch (mode) {
      case 1: {
        return this.renderTxParamsMode();
      }
      case 2: {
        return (
          <TxConfirmation
            address={address}
            fromAddress={currentAccount.publicKey}
            amount={amount}
            fee={fee}
            note={note}
            doneAction={this.sendTransaction}
            isConnected={isConnected}
            editTx={() => this.setState({ mode: 1 })}
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
            navigateToTxList={() => history.replace('/main/transactions')}
          />
        );
      }
      default: {
        return null;
      }
    }
  }

  renderTxParamsMode = () => {
    const { currentAccount, lastUsedContacts, contacts, history, location } = this.props;
    const { address, hasAddressError, amount, hasAmountError, fee, note, isCreateNewContactOn } = this.state;
    return [
      <TxParams
        fromAddress={currentAccount.publicKey}
        initialAddress={location?.state?.contact.address || ''}
        contacts={lastUsedContacts.concat(contacts)}
        hasAddressError={hasAddressError}
        updateTxAddress={this.updateTxAddress}
        resetAddressError={() => this.setState({ address: '', hasAddressError: false })}
        amount={amount}
        updateTxAmount={this.updateTxAmount}
        hasAmountError={hasAmountError}
        resetAmountError={() => this.setState({ amount: 0, hasAmountError: false })}
        updateFee={this.updateFee}
        note={note}
        updateTxNote={this.updateTxNote}
        cancelTx={history.goBack}
        openCreateNewContact={() => this.setState({ isCreateNewContactOn: true })}
        nextAction={this.proceedToMode2}
        key="params"
      />,
      isCreateNewContactOn ? (
        <CreateNewContact
          isStandalone
          initialAddress={address}
          onCompleteAction={() => this.setState({ isCreateNewContactOn: false })}
          onCancel={() => this.setState({ isCreateNewContactOn: false })}
          key="newContact"
        />
      ) : (
        <TxSummary address={address} fromAddress={currentAccount.publicKey} amount={amount} fee={fee} note={note} key="summary" />
      )
    ];
  };

  updateTxAddress = ({ value }: { value: string }) => {
    const trimmedValue = value ? value.trim() : '';
    if (trimmedValue && trimmedValue.startsWith('0x') !== -1 && trimmedValue.length === 42) {
      this.setState({ address: trimmedValue.substring(2), hasAddressError: false });
    } else if (trimmedValue.length === 40) {
      this.setState({ address: trimmedValue, hasAddressError: false });
    } else {
      this.setState({ address: '', hasAddressError: false });
    }
  };

  updateTxAmount = ({ value }: { value: string }) => {
    if (value && value.trim()) {
      const integerValue = parseInt(value);
      this.setState({ amount: integerValue });
    } else {
      this.setState({ amount: 0 });
    }
  };

  updateTxNote = ({ value }: { value: string }) => this.setState({ note: value });

  updateFee = ({ fee }: { fee: number }) => this.setState({ fee });

  proceedToMode2 = () => {
    const {
      currentAccount: { balance }
    } = this.props;
    const { address, amount, fee, hasAddressError, hasAmountError } = this.state;
    if (!!address && !!amount && amount + fee < balance && !hasAddressError && !hasAmountError) {
      this.setState({ mode: 2 });
    } else if (!address || address.length !== 40) {
      this.setState({ hasAddressError: true });
    } else if (!amount || amount + fee > balance) {
      this.setState({ hasAmountError: true });
    }
  };

  cancelTxProcess = () => {
    const { history } = this.props;
    history.push('/main/wallet');
  };

  sendTransaction = async () => {
    const { sendTransaction } = this.props;
    const { address, amount, fee, note } = this.state;
    try {
      const txId = await sendTransaction({ recipient: address, amount, fee, note });
      this.setState({ mode: 3, txId });
    } catch (error) {
      this.setState(() => {
        throw error;
      });
    }
  };
}

const mapStateToProps = (state) => ({
  isConnected: state.node.isConnected,
  currentAccount: state.wallet.accounts[state.wallet.currentAccountIndex],
  contacts: state.wallet.contacts,
  lastUsedContacts: state.wallet.lastUsedContacts
});

const mapDispatchToProps = {
  sendTransaction
};

SendCoins = connect<any, any, _, _, _, _>(mapStateToProps, mapDispatchToProps)(SendCoins);

export default SendCoins;
