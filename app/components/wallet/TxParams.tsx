import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import {
  Link,
  Input,
  DropDown,
  Button,
  ErrorPopup,
  AutocompleteDropdown,
  BoldText,
} from '../../basicComponents';
import { CoinUnits, getAbbreviatedText, getAddress } from '../../infra/utils';
import { smColors } from '../../vars';
import { Contact } from '../../types';
import AmountInput from '../../basicComponents/AmountInput';
import { ExternalLinks } from '../../../shared/constants';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 525px;
  height: 100%;
  margin-right: 10px;
  padding: 10px 15px;
  background-color: ${({ theme }) =>
    theme.isDarkMode ? smColors.dmBlack2 : smColors.black02Alpha};
  ${({ theme }) => `border-radius: ${theme.box.radius}px;`}
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const HeaderText = styled(BoldText)`
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
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
  color: ${({ theme }) =>
    theme.isDarkMode ? smColors.white : smColors.realBlack};
`;

const Dots = styled.div`
  flex: 1;
  flex-shrink: 1;
  overflow: hidden;
  margin-right: 12px;
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) =>
    theme.isDarkMode ? smColors.white : smColors.realBlack};
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
    label: '~ 10 min (FEE 1 Smidge)',
  },
  {
    fee: 2,
    label: '~ 5 min (FEE 2 Smidge)',
  },
  {
    fee: 3,
    label: '~ 1 min (FEE 3 Smidge)',
  },
];

const inputStyle = { flex: '0 0 240px' };
const errorPopupStyle = { top: 3, right: -190, maxWidth: 250 };
const errorPopupStyle1 = { top: -5, right: -255, maxWidth: 250 };

type Props = {
  fromAddress: string;
  address: string;
  hasAddressError: boolean;
  updateTxAddress: ({ value }: { value: string }) => void;
  resetAddressError: () => void;
  amount: number;
  updateTxAmount: (value: number) => void;
  hasAmountError: boolean;
  resetAmountError: () => void;
  updateFee: ({ fee }: { fee: number }) => void;
  note: string;
  updateTxNote: ({ value }: { value: any }) => void;
  nextAction: () => void;
  cancelTx: () => void;
  contacts: Contact[];
};

const TxParams = ({
  fromAddress,
  hasAddressError,
  address,
  updateTxAddress,
  resetAddressError,
  amount,
  hasAmountError,
  updateTxAmount,
  resetAmountError,
  note,
  updateTxNote,
  updateFee,
  nextAction,
  cancelTx,
  contacts,
}: Props) => {
  const [selectedFeeIndex, setSelectedFeeIndex] = useState(0);

  const selectFee = ({ index }: { index: number }) => {
    updateFee({ fee: fees[index].fee });
    setSelectedFeeIndex(index);
  };

  const navigateToGuide = () => window.open(ExternalLinks.SendCoinGuide);

  const handleAmountChange = useCallback(
    (value) => updateTxAmount(parseFloat(value)),
    [updateTxAmount]
  );

  return (
    <Wrapper>
      <Header>
        <HeaderText>Send SMH</HeaderText>
        <Link
          onClick={cancelTx}
          text="CANCEL TRANSACTION"
          style={{ color: smColors.orange }}
        />
      </Header>
      <SubHeader>--</SubHeader>
      <DetailsRow>
        <DetailsText>To</DetailsText>
        <Dots>....................................</Dots>
        <AutocompleteDropdown
          isDarkModeOn
          getItemValue={(item: { address: string }) => item.address}
          id="address"
          name="address"
          placeholder="Address"
          data={contacts || []}
          value={address}
          onChange={(value: string) => updateTxAddress({ value })}
          onEnter={(value: string) => updateTxAddress({ value })}
          autofocus
        />
        {hasAddressError && (
          <ErrorPopup
            onClick={resetAddressError}
            text="This address is invalid."
            style={errorPopupStyle}
          />
        )}
      </DetailsRow>
      <DetailsRow>
        <DetailsText>From</DetailsText>
        <Dots>....................................</Dots>
        <DetailsText>
          {getAbbreviatedText(getAddress(fromAddress), true, 10)}
        </DetailsText>
      </DetailsRow>
      <DetailsRow>
        <DetailsText>Amount</DetailsText>
        <Dots>....................................</Dots>
        <AmountInput
          value={amount}
          onChange={handleAmountChange}
          style={inputStyle}
          selectedUnits={
            amount.toString().length > 10 ? CoinUnits.SMH : CoinUnits.Smidge
          }
          valueUnits={CoinUnits.Smidge}
        />
        {hasAmountError && (
          <ErrorPopup
            onClick={resetAmountError}
            text="You don't have enough Smidge in your wallet."
            style={errorPopupStyle1}
          />
        )}
      </DetailsRow>
      <DetailsRow>
        <DetailsText>Fee</DetailsText>
        <Dots>....................................</Dots>
        <DropDown
          data={fees}
          onClick={selectFee}
          selectedItemIndex={selectedFeeIndex}
          rowHeight={40}
          bgColor={smColors.white}
        />
      </DetailsRow>
      <DetailsRow>
        <DetailsText>Note</DetailsText>
        <Dots>....................................</Dots>
        <Input
          value={note}
          onChange={updateTxNote}
          maxLength="50"
          style={inputStyle}
          placeholder="Only visible to you."
        />
      </DetailsRow>
      <Footer>
        <Link
          onClick={navigateToGuide}
          text="SEND SMH GUIDE"
          style={{ marginRight: 25 }}
        />
        <Button onClick={nextAction} text="NEXT" />
      </Footer>
    </Wrapper>
  );
};

export default TxParams;
