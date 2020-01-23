// @flow
import { shell, clipboard } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import { Link, Input, DropDown, Button, ErrorPopup } from '/basicComponents';
import { getAbbreviatedText } from '/infra/utils';
import { smColors } from '/vars';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 525px;
  height: 100%;
  margin-right: 10px;
  padding: 10px 15px;
  background-color: ${smColors.black02Alpha};
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const HeaderText = styled.div`
  font-family: SourceCodeProBold;
  font-size: 16px;
  line-height: 20px;
  color: ${smColors.black};
`;

const SubHeader = styled(HeaderText)`
  margin-bottom: 25px;
`;

const DetailsRow = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

const ActualInput = styled.input`
  flex: 1;
  width: 100%;
  height: 40px;
  padding: 8px 10px;
  border-radius: 0;
  border: 1px solid ${smColors.black};
  color: ${smColors.black};
  font-size: 14px;
  line-height: 16px;
  outline: none;
  &:hover {
    border: 1px solid ${smColors.purple};
  }
`;

const DetailsText = styled.div`
  flex: 1;
  margin-right: 10px;
  font-size: 16px;
  line-height: 20px;
  color: ${smColors.realBlack};
`;

const DetailsText1 = styled(DetailsText)`
  margin-right: 0;
  text-align: right;
`;

const Fee = styled.div`
  font-size: 13px;
  line-height: 17px;
  color: ${smColors.black};
  padding: 5px;
  cursor: inherit;
  ${({ isInDropDown }) => isInDropDown && `opacity: 0.5; border-bottom: 1px solid ${smColors.disabledGray};`}
  &:hover {
    opacity: 1;
    color: ${smColors.darkGray50Alpha};
  }
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
  align-items: flex-end;
`;

// TODO add auto update for fee ranges
const fees = [
  {
    fee: 1,
    label: '~ 10 min',
    text: '(FEE 1 Smidge)'
  },
  {
    fee: 2,
    label: '~ 5 min',
    text: '(FEE 2 Smidge)'
  },
  {
    fee: 3,
    label: '~ 1 min',
    text: '(FEE 3 Smidge)'
  }
];

const errorPopupStyle = { top: -5, right: -255, maxWidth: 250 };

type Props = {
  fromAddress: string,
  initialAddress: string,
  hasAddressError: boolean,
  updateTxAddress: ({ value: string }) => void,
  resetAddressError: () => void,
  amount: string,
  updateTxAmount: ({ value: string }) => void,
  hasAmountError: boolean,
  resetAmountError: () => void,
  updateFee: ({ fee: number }) => void,
  note: string,
  updateTxNote: ({ value: string }) => void,
  nextAction: () => void,
  cancelTx: () => void
};

type State = {
  address: string,
  selectedFeeIndex: number
};

class TxParams extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { initialAddress } = props;
    this.state = {
      address: initialAddress || '',
      selectedFeeIndex: 0
    };
  }

  render() {
    const {
      fromAddress,
      hasAddressError,
      updateTxAddress,
      resetAddressError,
      amount,
      hasAmountError,
      updateTxAmount,
      resetAmountError,
      note,
      updateTxNote,
      nextAction,
      cancelTx
    } = this.props;
    const { address, selectedFeeIndex } = this.state;
    return (
      <Wrapper>
        <Header>
          <HeaderText>Send SMH</HeaderText>
          <Link onClick={cancelTx} text="CANCEL TRANSACTION" style={{ color: smColors.orange }} />
        </Header>
        <SubHeader>--</SubHeader>
        <DetailsRow>
          <DetailsText>To</DetailsText>
          <ActualInput value={address} onChange={updateTxAddress} onPaste={this.onPaste} type="text" maxLength="42" />
          {hasAddressError && <ErrorPopup onClick={resetAddressError} text="This address is invalid." style={errorPopupStyle} />}
        </DetailsRow>
        <DetailsRow>
          <DetailsText>From</DetailsText>
          <DetailsText1>{getAbbreviatedText(fromAddress)}</DetailsText1>
        </DetailsRow>
        <DetailsRow>
          <DetailsText>Amount</DetailsText>
          <Input value={amount} onChange={updateTxAmount} extraText="SMH" style={{ flex: 1 }} />
          {hasAmountError && <ErrorPopup onClick={resetAmountError} text="You don't have enough SMH in your wallet." style={errorPopupStyle} />}
        </DetailsRow>
        <DetailsRow>
          <DetailsText>Confirmation time</DetailsText>
          <DropDown
            data={fees}
            onPress={this.selectFee}
            DdElement={({ label, text, isMain }) => this.renderFeeElement({ label, text, isInDropDown: !isMain })}
            selectedItemIndex={selectedFeeIndex}
            rowHeight={40}
            style={{ border: `1px solid ${smColors.black}` }}
          />
        </DetailsRow>
        <DetailsRow>
          <DetailsText>Note</DetailsText>
          <Input value={note} onChange={updateTxNote} maxLength="50" style={{ flex: 1 }} />
        </DetailsRow>
        <Footer>
          <Link onClick={this.navigateToGuide} text="SEND SMH GUIDE" />
          <Button onClick={nextAction} text="NEXT" />
        </Footer>
      </Wrapper>
    );
  }

  renderFeeElement = ({ label, text, isInDropDown }: { label: string, text: string, isInDropDown: boolean }) => (
    <Fee key={label} isInDropDown={isInDropDown}>
      {label} {text}
    </Fee>
  );

  onPaste = () => {
    const { updateTxAddress } = this.props;
    const clipboardValue = clipboard.readText();
    const address = clipboardValue.startsWith('0x') ? clipboardValue.substring(2) : clipboardValue;
    this.setState({ address: clipboardValue });
    updateTxAddress({ value: address });
  };

  selectFee = ({ index }: { index: number }) => {
    const { updateFee } = this.props;
    updateFee({ fee: fees[index].fee });
    this.setState({ selectedFeeIndex: index });
  };

  navigateToGuide = () => shell.openExternal('https://testnet.spacemesh.io/#/send_coin');
}

export default TxParams;
