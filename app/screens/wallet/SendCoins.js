// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sendTransaction } from '/redux/wallet/actions';
import { TxParams, TxSummary, TxConfirmation, TxSent } from '/components/wallet';
import { CreateNewContact } from '/components/contacts';
import type { RouterHistory } from 'react-router-dom';
import type { Account, Contact, Action } from '/types';
import { getAddress } from '../../infra/utils';

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
  amount: number | string,
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
    this.setState({ address: value, hasAddressError: false });
  };

  updateTxAmount = ({ value }: { value: string }) => {
    this.setState({ amount: value, hasAmountError: false });
  };

  updateTxNote = ({ value }: { value: string }) => this.setState({ note: value });

  updateFee = ({ fee }: { fee: number }) => this.setState({ fee });

  validateAddress = () => {
    const { currentAccount } = this.props;
    const { address } = this.state;
    const trimmedValue = address ? address.trim() : '';
    return (
      trimmedValue && ((trimmedValue.startsWith('0x') !== -1 && trimmedValue.length === 42) || trimmedValue.length === 40) && trimmedValue !== getAddress(currentAccount.publicKey)
    );
  };

  validateAmount = () => {
    const {
      currentAccount: { balance }
    } = this.props;
    const { amount, fee } = this.state;
    const intAmount = parseInt(amount);
    return !!intAmount && intAmount + fee < balance;
  };

  proceedToMode2 = () => {
    const { address, amount } = this.state;
    if (!this.validateAddress()) {
      this.setState({ hasAddressError: true });
    }
    if (!this.validateAmount()) {
      this.setState({ hasAmountError: true });
    } else {
      let trimmedAddress = address.trim();
      trimmedAddress = trimmedAddress.startsWith('0x') ? trimmedAddress.substring(2) : trimmedAddress;
      this.setState({ address: trimmedAddress, amount: parseInt(amount), mode: 2 });
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
