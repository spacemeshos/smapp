import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { captureReactBreadcrumb } from '../../sentry';
import {
  Link,
  Input,
  DropDown,
  Button,
  ErrorPopup,
  AutocompleteDropdown,
  BoldText,
} from '../../basicComponents';
import { CoinUnits, getAbbreviatedAddress } from '../../infra/utils';
import { smColors } from '../../vars';
import AmountInput from '../../basicComponents/AmountInput';
import { ExternalLinks } from '../../../shared/constants';
import { Contact } from '../../../shared/types';
import getFees from './getFees';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 525px;
  height: 100%;
  margin-right: 10px;
  padding: 10px 15px;
  background-color: ${({ theme: { wrapper } }) => wrapper.color};
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
  color: ${({ theme: { color } }) => color.primary};
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
  color: ${({ theme }) => theme.color.contrast};
`;

const HintRow = styled(DetailsRow)`
  margin-top: -15px;
`;

const HintText = styled(DetailsText)`
  font-size: 14px;
  line-height: 18px;
`;

const Dots = styled.div`
  flex: 1;
  flex-shrink: 1;
  overflow: hidden;
  margin-right: 12px;
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => theme.color.contrast};
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
  align-items: flex-end;
`;

const DropDownContainer = styled.div`
  width: 240px;
`;

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
  maxGas: number;
  updateTxAmount: (value: number) => void;
  hasAmountError: boolean;
  resetAmountError: () => void;
  updateFee: ({ fee }: { fee: number }) => void;
  note: string;
  updateTxNote: ({ value }: { value: any }) => void;
  nextAction: () => void;
  contacts: Contact[];
  backButtonRoute: string;
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
  maxGas,
  resetAmountError,
  note,
  updateTxNote,
  updateFee,
  nextAction,
  contacts,
  backButtonRoute,
}: Props) => {
  const [selectedFeeIndex, setSelectedFeeIndex] = useState(0);
  const fees = getFees(maxGas);
  const [sameAddressError, setSameAddressError] = useState(false);

  const selectFee = ({ index }: { index: number }) => {
    updateFee({ fee: fees[index].fee });
    setSelectedFeeIndex(index);
  };

  const navigateToGuide = () => {
    window.open(ExternalLinks.SendCoinGuide);
    captureReactBreadcrumb({
      category: 'TX params',
      data: {
        action: 'Navigate to coin guide',
      },
      level: 'info',
    });
  };

  const handleAmountChange = useCallback(
    (value) => updateTxAmount(parseFloat(value)),
    [updateTxAmount]
  );
  const history = useHistory();

  const cancelButton = () => {
    history.replace(backButtonRoute);
    captureReactBreadcrumb({
      category: 'TX params',
      data: {
        action: 'Click cancel transaction link',
      },
      level: 'info',
    });
  };

  return (
    <Wrapper>
      <Header>
        <HeaderText>Send SMH</HeaderText>
        <Link
          onClick={cancelButton}
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
          onChange={(value: string) => {
            setSameAddressError(fromAddress === value);
            updateTxAddress({ value });
          }}
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
        {sameAddressError && (
          <ErrorPopup
            onClick={() => setSameAddressError(false)}
            text="The address of the sender and recipient is the same."
            style={errorPopupStyle1}
            messageType="warning"
          />
        )}
      </DetailsRow>
      <DetailsRow>
        <DetailsText>From</DetailsText>
        <Dots>....................................</Dots>
        <DetailsText>{getAbbreviatedAddress(fromAddress)}</DetailsText>
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
        <DropDownContainer>
          <DropDown
            isDisabled={maxGas === 0}
            data={fees}
            onClick={selectFee}
            selectedItemIndex={selectedFeeIndex}
            rowHeight={40}
            hideSelectedItem
          />
        </DropDownContainer>
      </DetailsRow>
      {maxGas === 0 && (
        <HintRow>
          <HintText>
            Please, fill other fields to calculate the transaction fee
          </HintText>
        </HintRow>
      )}
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
