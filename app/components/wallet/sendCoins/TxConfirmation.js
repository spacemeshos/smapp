// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Modal, SmButton } from '/basicComponents';
import { smColors } from '/vars';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 30px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid ${smColors.borderGray};
`;

const RowName = styled.div`
  flex: 1;
  font-size: 18px;
  font-weight: bold;
  line-height: 24px;
  color: ${smColors.darkGray};
`;

const RowMiddle = styled.div`
  flex: 2;
  font-size: 18px;
  line-height: 24px;
  color: ${smColors.darkGray};
`;

const RowRight = styled.div`
  flex: 1;
  font-size: 16px;
  line-height: 24px;
  color: ${smColors.darkGray50Alpha};
`;

const EstimatedTime = styled.div`
  margin-top: 25px;
  font-size: 18px;
  line-height: 24px;
  color: ${smColors.darkGray};
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const EditTxButton = styled.div`
  font-size: 14px;
  line-height: 19px;
  color: ${smColors.darkGreen};
  padding: 5px 10px 5px 0;
  cursor: pointer;
`;

type Props = {
  address: string,
  amount: number,
  fee: number,
  note?: string,
  fiatRate: number,
  confirmationTime: string,
  navigateToExplanation: () => void,
  closeModal: () => void,
  sendTransaction: () => void,
  editTransaction: () => void
};

class TxConfirmation extends PureComponent<Props> {
  render() {
    return <Modal header="Confirm Transaction" onQuestionMarkClick={this.onQuestionMarkClick} onCloseClick={this.onCloseClick} content={this.renderModalBody()} />;
  }

  renderModalBody = () => {
    const { address, amount, fee, note, fiatRate, confirmationTime } = this.props;
    return (
      <Wrapper>
        <Row>
          <RowName>Send to</RowName>
          <RowMiddle>{address}</RowMiddle>
          <RowRight />
        </Row>
        <Row>
          <RowName>Amount</RowName>
          <RowMiddle>{amount} SMC</RowMiddle>
          <RowRight>= {amount * fiatRate} USD</RowRight>
        </Row>
        <Row>
          <RowName>Fee</RowName>
          <RowMiddle>{fee} SMC</RowMiddle>
          <RowRight>= {fee * fiatRate} USD</RowRight>
        </Row>
        <Row>
          <RowName>Total</RowName>
          <RowMiddle>{amount + fee} SMC</RowMiddle>
          <RowRight>= {(amount + fee) * fiatRate} USD</RowRight>
        </Row>
        <Row>
          <RowName>Note</RowName>
          <RowMiddle>{note || '-'}</RowMiddle>
          <RowRight />
        </Row>
        <EstimatedTime>Estimated confirmation time {confirmationTime}</EstimatedTime>
        <BottomSection>
          <EditTxButton onClick={this.editTransaction}>Edit Transaction</EditTxButton>
          <SmButton text="Confirm" theme="orange" onPress={this.sendTransaction} />
        </BottomSection>
      </Wrapper>
    );
  };

  onQuestionMarkClick = () => {
    const { navigateToExplanation } = this.props;
    navigateToExplanation();
  };

  onCloseClick = () => {
    const { closeModal } = this.props;
    closeModal();
  };

  editTransaction = () => {
    const { editTransaction } = this.props;
    editTransaction();
  };

  sendTransaction = () => {
    const { sendTransaction } = this.props;
    sendTransaction();
  };
}

export default TxConfirmation;
