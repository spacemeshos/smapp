import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { CoinUnits, toSMH, toSmidge } from '../infra/utils';
import { smColors } from '../vars';
import RefreshIcon from './Icons/RefreshIcon';

const Wrapper = styled.div<{ isFocused: boolean; isDisabled: boolean }>`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 40px;
`;
const Input = styled.input<{
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  isDisabled: boolean;
  isFocused: boolean;
}>`
  flex: 1;
  width: 100%;
  height: 100%;
  padding: 8px 110px 8px 10px;
  position: relative;
  border-radius: 0;
  border: none;
  font-size: 14px;
  line-height: 16px;
  outline: none;
  transition: background-color 100ms linear, border-color 100ms linear;
  color: ${({
    isDisabled,
    theme: {
      form: {
        input: { states },
      },
    },
  }) => (isDisabled ? states.disable.color : states.normal.color)};
  background-color: ${({
    isDisabled,
    theme: {
      form: {
        input: { states },
      },
    },
  }) =>
    isDisabled
      ? states.disable.backgroundColor
      : states.normal.backgroundColor};
  ${({
    isDisabled,
    theme: {
      colors,
      form: {
        input: { states },
      },
    },
  }) =>
    !isDisabled &&
    `&:hover, &:focus, &:active {
            background-color: ${states.focus.backgroundColor}; 
            color: ${states.focus.color}; 
            border: 1px solid ${colors.secondary100};
     } `}

  ${({ theme: { form } }) => `
    border: ${Number(form.input.states.normal.hasBorder)}px solid ${
    form.input.states.normal.borderColor
  };`}
  
  opacity: ${({ isDisabled }) => (isDisabled ? 0.2 : 1)};

  ${({ theme: { form } }) => `
    border-radius: ${form.input.boxRadius}px;`}
`;

const UnitButton = styled.button`
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  padding: 0 1em;
  border: 0;
  outline: 0;
  cursor: pointer;
  background-color: transparent;

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
  valueUnits?: CoinUnits;
  selectedUnits?: CoinUnits;
  disabled?: boolean;
  value?: number;
  style?: React.CSSProperties;
};

const AmountInput = ({
  onChange,
  disabled,
  style,
  value,
  selectedUnits = CoinUnits.SMH,
  valueUnits = CoinUnits.Smidge,
}: Props) => {
  /* eslint-disable no-nested-ternary */
  const amount =
    valueUnits === selectedUnits
      ? value || 0
      : valueUnits === CoinUnits.SMH
      ? toSmidge(value || 0)
      : toSMH(value || 0);
  /* eslint-enable no-nested-ternary */
  const [curValue, setValue] = useState(value ? amount.toString() : '');
  const [units, setUnits] = useState<CoinUnits>(selectedUnits);
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
    const nextUnits =
      units === CoinUnits.Smidge && newValue.indexOf('.') !== -1
        ? CoinUnits.SMH
        : units;
    setUnits(nextUnits);

    // Commit always in Smidge
    onChange(nextUnits === CoinUnits.SMH ? toSmidge(parsedValue) : parsedValue);
  };
  const changeUnits = () => {
    const nextUnits =
      units === CoinUnits.SMH ? CoinUnits.Smidge : CoinUnits.SMH;
    setUnits(nextUnits);
    // Convert amount to units
    const parsedValue = parseFloat(curValue);
    if (!Number.isNaN(parsedValue)) {
      const nextValue =
        nextUnits === CoinUnits.Smidge
          ? toSmidge(parsedValue)
          : toSMH(parsedValue);
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
    <Wrapper isFocused={isFocused} isDisabled={!!disabled} style={style}>
      <Input
        ref={inputRef}
        pattern="[0-9]*\.?[0-9]*"
        value={curValue}
        onChange={changeAmount}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        isDisabled={!!disabled}
        isFocused={isFocused}
      />
      <UnitButton onClick={changeUnits}>
        {units}
        <Toggle />
      </UnitButton>
    </Wrapper>
  );
};

export default AmountInput;
