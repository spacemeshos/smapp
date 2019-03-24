// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { SendCoinsHeader, TxParams, TxTotal } from '/components/wallet';
import get from 'lodash.get';
import { cryptoConsts } from '/vars';
import type { Account } from '/types';

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
    additionalText: 'fee 0.001 SMC = 0.01 USD'
  },
  {
    fee: 0.003,
    label: '~ 5 min',
    additionalText: 'fee 0.003 SMC = 0.02 USD'
  },
  {
    fee: 0.005,
    label: '~ 1 min',
    additionalText: 'fee 0.005 SMC = 0.03 USD'
  }
];

type Props = {
  location: {
    state: {
      account: Account
    }
  },
  history: { push: () => void },
  fiatRate: number
  // accounts: Account[]
};

type State = {
  address: string,
  amount: string,
  note: string,
  addressErrorMsg?: string,
  amountErrorMsg?: string,
  fee: number
};

class SendCoins extends Component<Props, State> {
  state = {
    address: '',
    addressErrorMsg: '',
    amount: 0,
    amountErrorMsg: '',
    note: '',
    feeIndex: 0
  };

  render() {
    const {
      location: {
        state: {
          account: { balance }
        }
      },
      // accounts,
      fiatRate
    } = this.props;
    // if (!accounts) {
    //   return null;
    // }
    // const { balance } = accounts[0];
    const { amount, addressErrorMsg, amountErrorMsg, feeIndex } = this.state;
    return (
      <Wrapper>
        <SendCoinsHeader fiatRate={fiatRate} balance={balance} navigateToTxExplanation={this.navigateToTxExplanation} />
        <MainContainer>
          <TxParams
            updateTxAddress={this.updateTxAddress}
            updateTxAmount={this.updateTxAmount}
            updateTransactionNote={this.updateTransactionNote}
            updateFee={this.updateFee}
            addressErrorMsg={addressErrorMsg}
            amountErrorMsg={amountErrorMsg}
            fees={fees}
            feeIndex={feeIndex}
          />
          <TxTotal amount={amount} fee={fees[feeIndex]} fiatRate={1} sendTransaction={this.sendTransaction} />
        </MainContainer>
      </Wrapper>
    );
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
      if (integerValue < balance) {
        this.setState({ amount: integerValue });
      } else {
        this.setState({ amountErrorMsg: 'Amount exceeds available balance' });
      }
    }
  };

  updateTransactionNote = ({ value }: { value: string }) => this.setState({ note: value });

  updateFee = ({ index }: { index: number }) => this.setState({ feeIndex: index });

  sendTransaction = () => {
    const { history } = this.props;
    const { address, amount, note, feeIndex } = this.state;
    history.push('/txSummary', { address, amount, note, feeIndex });
  };
}

const mapStateToProps = (state) => ({
  accounts: get(state.wallet.wallet, 'crypto.cipherText.accounts', null),
  fiatRate: state.wallet.fiatRate
});

SendCoins = connect(mapStateToProps)(SendCoins);

export default SendCoins;
