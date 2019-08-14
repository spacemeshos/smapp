// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sendTransaction } from '/redux/wallet/actions';
import { TxParams, TxSummary, TxConfirmation, TxSent } from '/components/wallet';
import { cryptoConsts } from '/vars';
import type { RouterHistory } from 'react-router-dom';
import type { Account, Action } from '/types';

type Props = {
  currentAccount: Account,
  history: RouterHistory,
  sendTransaction: Action
};

type State = {
  mode: 1 | 2 | 3,
  tmpAddress: string,
  address: string,
  hasAddressError: boolean,
  tmpAmount: number | string,
  amount: number,
  hasAmountError: boolean,
  note: string,
  fee: number,
  txId: string
};

class SendCoins extends Component<Props, State> {
  state = {
    mode: 1,
    tmpAddress: '',
    address: '',
    hasAddressError: false,
    tmpAmount: '',
    amount: 0,
    hasAmountError: false,
    note: '',
    fee: 0.001,
    txId: ''
  };

  render() {
    const { currentAccount, history } = this.props;
    const { mode, address, amount, fee, note, txId } = this.state;
    switch (mode) {
      case 1: {
        return this.renderTxParamsMode();
      }
      case 2: {
        return (
          <TxConfirmation
            address={address}
            fromAddress={currentAccount.pk}
            amount={amount}
            fee={fee}
            note={note}
            doneAction={this.sendTransaction}
            editTx={() => this.setState({ mode: 1 })}
            cancelTx={history.goBack}
          />
        );
      }
      case 3: {
        return (
          <TxSent
            address={address}
            fromAddress={currentAccount.pk}
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
    const { currentAccount, history } = this.props;
    const { tmpAddress, address, hasAddressError, tmpAmount, amount, hasAmountError, fee, note } = this.state;
    return [
      <TxParams
        fromAddress={currentAccount.pk}
        address={tmpAddress}
        hasAddressError={hasAddressError}
        updateTxAddress={({ value }) => this.setState({ tmpAddress: value })}
        updateTxAddressDebounced={this.updateTxAddressDebounced}
        resetAddressError={() => this.setState({ address: '', hasAddressError: false })}
        amount={tmpAmount}
        updateTxAmount={({ value }) => this.setState({ tmpAmount: value })}
        updateTxAmountDebounced={this.updateTxAmountDebounced}
        hasAmountError={hasAmountError}
        resetAmountError={() => this.setState({ amount: 0, hasAmountError: false })}
        updateFee={this.updateFee}
        note={note}
        updateTxNote={this.updateTxNote}
        cancelTx={history.goBack}
        isNextActionEnabled={!!address && !!amount && !hasAddressError && !hasAmountError}
        nextAction={() => this.setState({ mode: 2 })}
        key="params"
      />,
      <TxSummary address={address} fromAddress={currentAccount.pk} amount={amount} fee={fee} note={note} key="summary" />
    ];
  };

  updateTxAddressDebounced = ({ value }: { value: string }) => {
    if (value) {
      this.setState({ address: value, hasAddressError: value.length !== cryptoConsts.PUB_KEY_LENGTH });
    } else {
      this.setState({ hasAddressError: false });
    }
  };

  updateTxAmountDebounced = ({ value }: { value: string }) => {
    const {
      currentAccount: { balance }
    } = this.props;
    if (value) {
      const integerValue = parseInt(value);
      this.setState({ amount: integerValue, hasAmountError: integerValue >= balance });
    } else {
      this.setState({ hasAmountError: false });
    }
  };

  updateTxNote = ({ value }: { value: string }) => this.setState({ note: (value && value.trim()) || '' });

  updateFee = ({ fee }: { fee: number }) => this.setState({ fee });

  cancelTxProcess = () => {
    const { history } = this.props;
    history.push('/main/wallet');
  };

  sendTransaction = async () => {
    const { sendTransaction } = this.props;
    const { address, amount, fee, note } = this.state;
    try {
      const txId = await sendTransaction({ recipient: address, amount, price: fee, note });
      this.setState({ mode: 3, txId });
    } catch (error) {
      this.setState(() => {
        throw error;
      });
    }
  };
}

const mapStateToProps = (state) => ({
  currentAccount: state.wallet.accounts[state.wallet.currentAccountIndex],
  contacts: state.wallet.contacts,
  lastUsedAddresses: state.wallet.lastUsedAddresses
});

const mapDispatchToProps = {
  sendTransaction
};

SendCoins = connect<any, any, _, _, _, _>(
  mapStateToProps,
  mapDispatchToProps
)(SendCoins);

export default SendCoins;
