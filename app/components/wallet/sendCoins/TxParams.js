// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { SmInput } from '/basicComponents';
import { contactIcon } from '/assets/images';
import { smColors } from '/vars';
import TxFeeSelector from './TxFeeSelector';

const Wrapper = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
`;

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;
`;

const Label = styled.div`
  font-size: 14px;
  font-weight: bold;
  line-height: 19px;
  color: ${smColors.darkGray};
  margin-bottom: 15px;
  cursor: inherit;
`;

const InputSection = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  border: 1px solid ${smColors.borderGray};
  border-radius: 2px;
`;

const AmountSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const MyContactsSection = styled.div`
  width: 160px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 10px;
  border-left: 1px solid ${smColors.borderGray};
`;

const MyContactsText = styled.div`
  font-size: 14px;
  line-height: 19px;
  color: ${smColors.borderGray};
  margin-right: 10px;
`;

const MyContactsIcon = styled.img`
  width: 11px;
  height: 14px;
`;

const CurrencyText = styled.span`
  font-size: 16px;
  line-height: 46px;
  color: ${smColors.darkGray50Alpha};
  margin: 0 5px;
`;

const EstimationSection = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
  cursor: pointer;
`;

const EstimatedTime = styled.span`
  font-size: 14px;
  line-height: 19px;
  font-weight: bold;
  color: ${smColors.darkGreen};
  cursor: inherit;
`;

const EstimatedFee = styled.span`
  font-size: 14px;
  line-height: 19px;
  color: ${smColors.darkGray50Alpha};
  cursor: inherit;
`;

const inputStyle = { border: '1px solid transparent' };

type Props = {
  updateTxAddress: () => void,
  updateTxAmount: () => void,
  updateTxNote: () => void,
  updateFee: () => void,
  addressErrorMsg?: string,
  amountErrorMsg?: string,
  fees: { fee: number, label: string, additionalText: string },
  feeIndex: number
};

type State = {
  isFeeSelectorVisible: boolean
};

class TxParams extends Component<Props, State> {
  state = {
    isFeeSelectorVisible: false
  };

  render() {
    const { updateTxAddress, updateTxAmount, updateTxNote, updateFee, addressErrorMsg, amountErrorMsg, fees, feeIndex } = this.props;
    const { isFeeSelectorVisible } = this.state;
    return (
      <Wrapper>
        <SectionWrapper>
          <Label>Send to</Label>
          <InputSection>
            <SmInput type="text" placeholder="Type address" onChange={updateTxAddress} hasDebounce errorMsg={addressErrorMsg} style={inputStyle} />
            <MyContactsSection>
              <MyContactsText>My contacts</MyContactsText>
              <MyContactsIcon src={contactIcon} />
            </MyContactsSection>
          </InputSection>
        </SectionWrapper>
        <SectionWrapper>
          <Label>Amount to send</Label>
          <AmountSection>
            <InputSection>
              <SmInput type="tel" placeholder="Type amount" onChange={updateTxAmount} hasDebounce errorMsg={amountErrorMsg} style={inputStyle} />
              <CurrencyText>SMC</CurrencyText>
            </InputSection>
            <CurrencyText> = </CurrencyText>
            <InputSection>
              <SmInput type="tel" placeholder="Fiat value" disabled value={10} style={inputStyle} />
              <CurrencyText>USD</CurrencyText>
            </InputSection>
          </AmountSection>
        </SectionWrapper>
        <SectionWrapper>
          <Label>Note (optional)</Label>
          <InputSection>
            <SmInput type="text" placeholder="Add a short note (optional)" onChange={updateTxNote} hasDebounce style={inputStyle} />
          </InputSection>
        </SectionWrapper>
        <EstimationSection onClick={() => this.setState({ isFeeSelectorVisible: !isFeeSelectorVisible })}>
          <Label style={{ marginBottom: 0 }}>Estimated confirmation time</Label>
          <EstimatedTime>&nbsp;~1 min&nbsp;</EstimatedTime>
          <EstimatedFee>(fee 0.005 SMC = 0.03 USD)</EstimatedFee>
        </EstimationSection>
        {isFeeSelectorVisible && <TxFeeSelector fees={fees} onSelect={updateFee} selectedFeeIndex={feeIndex} />}
      </Wrapper>
    );
  }
}

export default TxParams;
