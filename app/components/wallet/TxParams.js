// @flow
import { shell, clipboard } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import { Link, Input, DropDown, Button, ErrorPopup, AutocompleteDropdown } from '/basicComponents';
import { getAbbreviatedText, getAddress } from '/infra/utils';
import { smColors } from '/vars';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 525px;
  height: 100%;
  margin-right: 10px;
  padding: 10px 15px;
  background-color: ${({ theme }) => (theme.isDarkModeOn ? smColors.dmBlack2 : smColors.black02Alpha)};
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
  color: ${({ theme }) => (theme.isDarkModeOn ? smColors.white : smColors.black)};
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

const DetailsText = styled.div`
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => (theme.isDarkModeOn ? smColors.white : smColors.realBlack)};
`;

const Dots = styled.div`
  flex: 1;
  flex-shrink: 1;
  overflow: hidden;
  margin-right: 12px;
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => (theme.isDarkModeOn ? smColors.white : smColors.realBlack)};
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

const NotSyncedExplanation = styled.div`
  flex: 1;
  font-size: 11px;
  line-height: 15px;
  color: ${smColors.orange};
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

const inputStyle = { flex: '0 0 240px' };
const errorPopupStyle = { top: 3, right: -190, maxWidth: 250 };
const errorPopupStyle1 = { top: -5, right: -255, maxWidth: 250 };

type Props = {
  fromAddress: string,
  address: string,
  contacts: Array<object>,
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
  cancelTx: () => void,
  status: Object,
  isDarkModeOn: boolean
};

type State = {
  selectedFeeIndex: number
};

class TxParams extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedFeeIndex: 0
    };
  }

  render() {
    const {
      fromAddress,
      hasAddressError,
      address,
      resetAddressError,
      amount,
      hasAmountError,
      updateTxAmount,
      resetAmountError,
      note,
      updateTxNote,
      nextAction,
      cancelTx,
      status,
      isDarkModeOn,
      contacts
    } = this.props;
    const { selectedFeeIndex } = this.state;
    const ddStyle = { border: `1px solid ${isDarkModeOn ? smColors.white : smColors.black}`, marginLeft: 'auto', flex: '0 0 240px' };

    return (
      <Wrapper>
        <Header>
          <HeaderText>Send SMH</HeaderText>
          <Link onClick={cancelTx} text="CANCEL TRANSACTION" style={{ color: smColors.orange }} />
        </Header>
        <SubHeader>--</SubHeader>
        <DetailsRow>
          <DetailsText>To</DetailsText>
          <Dots>....................................</Dots>
          <AutocompleteDropdown
            isDarkModeOn
            getItemValue={(item) => item.address}
            id="address"
            name="address"
            placeholder="Address"
            data={contacts || []}
            value={address}
            onChange={(value) => this.updateTxAddress({ value })}
            onEnter={(value) => this.updateTxAddress({ value: value.target.value })}
          />
          {hasAddressError && <ErrorPopup onClick={resetAddressError} text="This address is invalid." style={errorPopupStyle} />}
        </DetailsRow>
        <DetailsRow>
          <DetailsText>From</DetailsText>
          <Dots>....................................</Dots>
          <DetailsText>{getAbbreviatedText(getAddress(fromAddress), true, 10)}</DetailsText>
        </DetailsRow>
        <DetailsRow>
          <DetailsText>Amount</DetailsText>
          <Dots>....................................</Dots>
          <Input value={amount} onChange={updateTxAmount} extraText="SMD" style={inputStyle} />
          {hasAmountError && <ErrorPopup onClick={resetAmountError} text="You don't have enough Smidge in your wallet." style={errorPopupStyle1} />}
        </DetailsRow>
        <DetailsRow>
          <DetailsText>Est. Confirmation time</DetailsText>
          <Dots>....................................</Dots>
          <DropDown
            data={fees}
            onPress={this.selectFee}
            DdElement={({ label, text, isMain }) => this.renderFeeElement({ label, text, isInDropDown: !isMain })}
            selectedItemIndex={selectedFeeIndex}
            rowHeight={40}
            style={ddStyle}
            bgColor={smColors.white}
          />
        </DetailsRow>
        <DetailsRow>
          <DetailsText>Note</DetailsText>
          <Dots>....................................</Dots>
          <Input value={note} onChange={updateTxNote} maxLength="50" style={inputStyle} />
        </DetailsRow>
        <Footer>
          <Link onClick={this.navigateToGuide} text="SEND SMH GUIDE" style={{ marginRight: 25 }} />
          {!status?.synced && <NotSyncedExplanation>Please wait until your app is synced with the mesh</NotSyncedExplanation>}
          <Button onClick={nextAction} text="NEXT" isDisabled={!status.synced} />
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
    updateTxAddress({ value: clipboardValue });
  };

  updateTxAddress = ({ value }: { value: string }) => {
    const { updateTxAddress } = this.props;
    updateTxAddress({ value });
  };

  selectFee = ({ index }: { index: number }) => {
    const { updateFee } = this.props;
    updateFee({ fee: fees[index].fee });
    this.setState({ selectedFeeIndex: index });
  };

  navigateToGuide = () => shell.openExternal('https://testnet.spacemesh.io/#/send_coin');
}

export default TxParams;
