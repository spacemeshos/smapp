import React from 'react';
import styled from 'styled-components';
import { smColors } from '../../vars';
import { Tooltip, RadioButton } from '../../basicComponents';

const Label = styled.div`
  display: flex;
  align-items: baseline;
`;

const InputTitle = styled.span`
  text-transform: uppercase;
  font-size: 16px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
`;

const InputSubTitle = styled.div`
  margin: 5px 0 45px 20px;
  font-size: 16px;
  line-height: 17px;
  color: ${smColors.disabledGray};
`;

type Props = {
  type: string;
  handleChangeType: ({ value }: { value: string }) => void;
  isDarkMode: boolean;
};

const VaultType = ({ type, handleChangeType, isDarkMode }: Props) => (
  <>
    <Label>
      <RadioButton checked={type === 'single'} name="single" value={'single'} onChange={handleChangeType} />
      <InputTitle>Simple Vault</InputTitle>
      <Tooltip width={250} text="Simple Vault" isDarkMode={isDarkMode} />
    </Label>
    <InputSubTitle>A vault controlled by a single master account.</InputSubTitle>
    <Label>
      <RadioButton checked={type === 'multi-sig'} name="multi-sig" value={'multi-sig'} onChange={handleChangeType} />
      <InputTitle>Multi-sig Vault</InputTitle>
      <Tooltip width={250} text="Multi-sig Vault" isDarkMode={isDarkMode} />
    </Label>
    <InputSubTitle>A 2/3 multi-sig vault which is controlled by 3 master accounts and requires 2 signatures on each operation.</InputSubTitle>
  </>
);

export default VaultType;
