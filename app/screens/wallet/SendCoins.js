// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { sendTransaction } from '/redux/wallet/actions';
import { SendCoinsHeader, TxParams, TxTotal, TxConfirmation } from '/components/wallet';
import { cryptoConsts } from '/vars';
import type { Account, Action } from '/types';

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
  location: {
    state: {
      account: Account
    }
  },
  history: { push: (string, Object) => void },
  fiatRate: number,
  sendTransaction: Action
};

type State = {
  address: string,
  amount: number,
  note: string,
  addressErrorMsg?: string,
  amountErrorMsg?: string,
  feeIndex: number,
  shouldShowModal: boolean
};

class SendCoins extends Component<Props, State> {
  state = {
    address: '',
    addressErrorMsg: '',
    amount: 0,
    amountErrorMsg: '',
    note: '',
    feeIndex: 0,
    shouldShowModal: false
  };

  render() {
    const {
      location: {
        state: {
          account: { balance }
        }
      },
      fiatRate
    } = this.props;
    const { address, amount, addressErrorMsg, amountErrorMsg, feeIndex, note, shouldShowModal } = this.state;
    return [
      <Wrapper key="main">
        <SendCoinsHeader fiatRate={fiatRate} balance={balance} navigateToTxExplanation={this.navigateToTxExplanation} />
        <MainContainer>
          <TxParams
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
          key="modal"
          address={address}
          amount={amount}
          fee={fees[feeIndex].fee}
          note={note}
          confirmationTime={fees[feeIndex].label}
          fiatRate={fiatRate}
          navigateToExplanation={() => {}}
          onCancelBtnClick={this.cancelTxProcess}
          closeModal={() => this.setState({ shouldShowModal: false })}
          sendTransaction={this.sendTransaction}
          editTransaction={() => this.setState({ shouldShowModal: false })}
        />
      )
    ];
  }

  navigateToTxExplanation = () => {};

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
      location: {
        state: {
          account: { balance }
        }
      }
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
    const {
      sendTransaction,
      history,
      location: {
        state: {
          account: { pk }
        }
      }
    } = this.props;
    const { address, amount, feeIndex, note } = this.state;
    await sendTransaction({ srcAddress: pk, dstAddress: address, amount, fee: fees[feeIndex].fee, note });
    history.push('/main/wallet');
  };
}

const mapStateToProps = (state) => ({
  fiatRate: state.wallet.fiatRate
});

const mapDispatchToProps = {
  sendTransaction
};

SendCoins = connect(
  mapStateToProps,
  mapDispatchToProps
)(SendCoins);

export default SendCoins;
