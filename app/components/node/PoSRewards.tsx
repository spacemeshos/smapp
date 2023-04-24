import React, { useState } from 'react';
import styled from 'styled-components';
import { AutocompleteDropdown, ErrorPopup } from '../../basicComponents';
import { validateAddress } from '../../infra/utils';
import PoSFooter from './PoSFooter';

type Props = {
  coinbase: string;
  nextAction: () => void;
  onChange: (address: string) => void;
  address: Array<{ address: string; nickname: string }>;
};
const AutocompleteContainer = styled.div`
  position: relative;
`;
const errorPopupStyle = { top: 50, maxWidth: 250 };

const PoSRewards = ({ coinbase, nextAction, address, onChange }: Props) => {
  const [isAddressValid, setIsValidAddress] = useState(true);
  return (
    <>
      <AutocompleteContainer>
        <AutocompleteDropdown
          isDarkModeOn
          getItemValue={(item: { address: string }) => item.address}
          id="rewardAddress"
          name="rewardAddress"
          placeholder="Reward Address"
          data={address}
          value={coinbase}
          autocomplete={false}
          onChange={(value: string) => onChange(value)}
          onEnter={(value: string) => onChange(value)}
          autofocus
        />
        {!isAddressValid && (
          <ErrorPopup
            onClick={() => setIsValidAddress(true)}
            text="This address is invalid."
            style={errorPopupStyle}
          />
        )}
      </AutocompleteContainer>
      <PoSFooter
        action={() => {
          const isValid = validateAddress(coinbase);

          if (isValid) {
            nextAction();
          } else {
            setIsValidAddress(false);
          }
        }}
        isDisabled={!coinbase}
      />
    </>
  );
};

export default PoSRewards;
