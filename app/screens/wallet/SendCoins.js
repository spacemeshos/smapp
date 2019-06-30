// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { sendTransaction } from '/redux/wallet/actions';
import { AllContactsModal } from '/components/contacts';
import { SendCoinsHeader, TxParams, TxTotal, TxConfirmation } from '/components/wallet';
import { cryptoConsts } from '/vars';
import type { RouterHistory } from 'react-router-dom';
import type { Account, Action, Contact } from '/types';
import { shell } from 'electron';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 50px;
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const fees = [
  {
    fee: 0.001,
    label: '~ 10 min',
    additionalText: 'fee 0.001 SMC = '
  },
  {
    fee: 0.003,
    label: '~ 5 min',
    additionalText: 'fee 0.003 SMC = '
  },
  {
    fee: 0.005,
    label: '~ 1 min',
    additionalText: 'fee 0.005 SMC = '
  }
];

type Props = {
  currentAccount: Account,
  history: RouterHistory,
  fiatRate: number,
  sendTransaction: Action,
  contacts: Contact[],
  lastUsedAddresses: Contact[]
};

type State = {
  address: string,
  defaultAddress?: string,
  amount: number,
  note: string,
  addressErrorMsg?: string,
  amountErrorMsg?: string,
  feeIndex: number,
  shouldShowModal: boolean,
  shouldShowContactsModal: boolean
};

class SendCoins extends Component<Props, State> {
  state = {
    address: '',
    defaultAddress: '',
    addressErrorMsg: '',
    amount: 0,
    amountErrorMsg: '',
    note: '',
    feeIndex: 0,
    shouldShowModal: false,
    shouldShowContactsModal: false
  };

  render() {
    const {
      currentAccount: { balance },
      fiatRate,
      contacts,
      lastUsedAddresses
    } = this.props;
    const { address, defaultAddress, amount, addressErrorMsg, amountErrorMsg, feeIndex, note, shouldShowModal, shouldShowContactsModal } = this.state;
    return [
      <Wrapper key="main">
        <SendCoinsHeader fiatRate={fiatRate} balance={balance} navigateToTxExplanation={this.navigateToTxExplanation} />
        <MainContainer>
          <TxParams
            defaultAddress={defaultAddress}
            updateTxAddress={this.updateTxAddress}
            updateTxAmount={this.updateTxAmount}
            amount={amount}
            updateTxNote={this.updateTxNote}
            updateFee={this.updateFee}
            addressErrorMsg={addressErrorMsg}
            amountErrorMsg={amountErrorMsg}
            fees={fees}
            feeIndex={feeIndex}
            fiatRate={fiatRate}
            openModal={contacts.length || lastUsedAddresses.length ? () => this.setState({ shouldShowContactsModal: true }) : null}
          />
          <TxTotal
            amount={amount}
            fee={fees[feeIndex]}
            fiatRate={1}
            proceedToTxConfirmation={this.proceedToTxConfirmation}
            canSendTx={address && amount && !addressErrorMsg && !amountErrorMsg}
          />
        </MainContainer>
      </Wrapper>,
      shouldShowModal && (
        <TxConfirmation
          key="modal1"
          address={address}
          amount={amount}
          fee={fees[feeIndex].fee}
          note={note}
          confirmationTime={fees[feeIndex].label}
          fiatRate={fiatRate}
          navigateToExplanation={this.navigateToTxExplanation}
          onCancelBtnClick={this.cancelTxProcess}
          closeModal={() => this.setState({ shouldShowModal: false })}
          sendTransaction={this.sendTransaction}
          editTransaction={() => this.setState({ shouldShowModal: false })}
        />
      ),
      shouldShowContactsModal && <AllContactsModal key="modal2" selectContact={this.selectContactFromModal} closeModal={() => this.setState({ shouldShowContactsModal: false })} />
    ];
  }

  navigateToTxExplanation = () => shell.openExternal('https://testnet.spacemesh.io/#/send_coin');

  selectContactFromModal = ({ contact }: { contact: Contact }) => {
    const { address } = contact;
    this.setState({ address, defaultAddress: address, shouldShowContactsModal: false });
  };

  updateTxAddress = ({ value }: { value: string }) => {
    this.setState({ addressErrorMsg: '' });
    if (value) {
      if (value.length === cryptoConsts.PUB_KEY_LENGTH) {
        this.setState({ address: value });
      } else {
        this.setState({ addressErrorMsg: 'Invalid Address' });
      }
    }
  };

  updateTxAmount = ({ value }: { value: string }) => {
    const {
      currentAccount: { balance }
    } = this.props;
    this.setState({ amountErrorMsg: '' });
    if (value) {
      const integerValue = parseInt(value);
      if (integerValue <= balance) {
        this.setState({ amount: integerValue });
      } else {
        this.setState({ amountErrorMsg: 'Amount exceeds available balance' });
      }
    }
  };

  updateTxNote = ({ value }: { value: string }) => this.setState({ note: value });

  updateFee = ({ index }: { index: number }) => this.setState({ feeIndex: index });

  cancelTxProcess = () => {
    const { history } = this.props;
    history.push('/main/wallet');
  };

  proceedToTxConfirmation = () => this.setState({ shouldShowModal: true });

  sendTransaction = async () => {
    const { sendTransaction, history } = this.props;
    const { address, amount, feeIndex, note } = this.state;
    try {
      await sendTransaction({ recipient: address, amount: amount * 10000, price: fees[feeIndex].fee * 10000, note });
      history.push('/main/wallet');
    } catch (error) {
      this.setState(() => {
        throw error;
      });
    }
  };
}

const mapStateToProps = (state) => ({
  currentAccount: state.wallet.accounts[state.wallet.currentAccountIndex],
  fiatRate: state.wallet.fiatRate,
  contacts: state.wallet.contacts,
  lastUsedAddresses: state.wallet.lastUsedAddresses
});

const mapDispatchToProps = {
  sendTransaction
};

SendCoins = connect(
  mapStateToProps,
  mapDispatchToProps
)(SendCoins);

export default SendCoins;
