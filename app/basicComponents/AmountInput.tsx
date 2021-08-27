import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { CoinUnits, toSMH, toSmidge } from '../infra/utils';
import { smColors } from '../vars';
import RefreshIcon from './Icons/RefreshIcon';

const Wrapper = styled.div<{ isFocused: boolean; disabled: boolean }>`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  width: 100%;
  height: 40px;
  border: 1px solid ${({ isFocused }) => (isFocused ? smColors.purple : smColors.black)};
  opacity: ${({ disabled }) => (disabled ? 0.2 : 1)};
  ${({ disabled }) => !disabled && `&:hover { border: 1px solid ${smColors.purple}; `}
  background-color: ${smColors.white};
`;
const Input = styled.input<{
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  disabled: boolean;
}>`
  flex: 1;
  width: 100%;
  height: 36px;
  padding: 8px 10px;
  border-radius: 0;
  border: none;
  color: ${({ disabled }) => (disabled ? smColors.darkGray : smColors.black)};
  font-size: 14px;
  line-height: 16px;
  outline: none;
`;

const UnitButton = styled.button`
  height: 100%;

  padding: 0 1em;
  border: 0;
  outline: 0;
  background: ${smColors.white};
  cursor: pointer;

  svg {
    fill: ${smColors.realBlack};
  }

  :hover,
  :active,
  :focus {
    color: ${smColors.green};

    svg {
      fill: ${smColors.green};
    }
  }
`;

const Toggle = styled(RefreshIcon)`
  display: inline-block;
  margin-left: 4px;
  cursor: pointer;
  vertical-align: bottom;
`;

type Props = {
  onChange: (amountSmidge: number) => void;
  disabled?: boolean;
  value?: number;
  style?: React.CSSProperties;
};

const AmountInput = ({ onChange, disabled, style, value }: Props) => {
  const [curValue, setValue] = useState(value ? value.toString() : '');
  const [units, setUnits] = useState<CoinUnits>(CoinUnits.SMH);
  const [isFocused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const changeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.validity.valid) return;
    const newValue = e.target.value;
    if (newValue === '') {
      setValue('');
      onChange(0);
      return;
    }
    const parsedValue = parseFloat(newValue);
    if (Number.isNaN(parsedValue)) return;

    setValue(newValue);

    // If User typed a decimal in Smidge -> switch to SMH without any conversion
    const nextUnits = units === CoinUnits.Smidge && newValue.indexOf('.') !== -1 ? CoinUnits.SMH : units;
    setUnits(nextUnits);

    // Commit always in Smidge
    onChange(nextUnits === CoinUnits.SMH ? toSmidge(parsedValue) : parsedValue);
  };
  const changeUnits = () => {
    const nextUnits = units === CoinUnits.SMH ? CoinUnits.Smidge : CoinUnits.SMH;
    setUnits(nextUnits);
    // Convert amount to units
    const parsedValue = parseFloat(curValue);
    if (!Number.isNaN(parsedValue)) {
      const nextValue = nextUnits === CoinUnits.Smidge ? toSmidge(parsedValue) : toSMH(parsedValue);
      setValue(nextValue.toString());
    }
    // Switch focus back to the input
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.selectionStart = inputRef.current.value.length;
        inputRef.current.selectionEnd = inputRef.current.value.length;
      }
    }, 0);
  };

  return (
    <Wrapper isFocused={isFocused} disabled={!!disabled} style={style}>
      <Input
        ref={inputRef}
        pattern="[0-9]*\.?[0-9]*"
        value={curValue}
        onChange={changeAmount}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={!!disabled}
      />
      <UnitButton onClick={changeUnits}>
        {units}
        <Toggle />
      </UnitButton>
    </Wrapper>
  );
};

export default AmountInput;
