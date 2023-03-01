import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const DEFAULT_DEBOUNCE_TIME = 500;

const Wrapper = styled.div<{ isFocused: boolean; isDisabled: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  width: 100%;
  height: 40px;
  border: 1px solid
    ${({ isFocused, theme: { colors } }) =>
      isFocused ? colors.secondary100 : 'transparent'};
  opacity: ${({ isDisabled }) => (isDisabled ? 0.2 : 1)};
  ${({ theme: { form } }) => `
  border-radius: ${form.input.boxRadius}px;`}
  ${({ isDisabled, theme: { colors } }) =>
    !isDisabled && `&:hover { border: 1px solid ${colors.secondary100}; `}
  background-color:  ${({ theme: { form } }) =>
    form.input.states.normal.backgroundColor};
`;

const ActualInput = styled.input<{
  value: string;
  onKeyPress: (event: any) => void;
  onChange: (event: any) => void;
  onFocus: (event: any) => void;
  onBlur: (event: any) => void;
  isDisabled: any;
  iconLeft?: string;
}>`
  flex: 1;
  width: 100%;
  height: 38px;
  padding: 8px 10px;
  border-radius: 0;
  border: none;
  transition: background-color 100ms linear, border-color 100ms linear;
  color: ${({
    isDisabled,
    theme: {
      form: {
        input: { states },
      },
    },
  }) =>
    // eslint-disable-next-line no-nested-ternary
    isDisabled ? states.disable.color : states.normal.color};
  background-color: ${({
    isDisabled,
    theme: {
      form: {
        input: { states },
      },
    },
  }) =>
    // eslint-disable-next-line no-nested-ternary
    isDisabled
      ? states.disable.backgroundColor
      : states.normal.backgroundColor};
  ${({
    isDisabled,
    theme: {
      form: {
        input: { states },
      },
    },
  }) =>
    !isDisabled &&
    `&:hover, &:focus, &:active {
            background-color: ${states.focus.backgroundColor}; 
            color: ${states.focus.color}; 
     } `}
  font-size: 14px;
  line-height: 16px;
  outline: none;
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'text')};
  ${({ theme: { form } }) => `
  border-radius: ${form.input.boxRadius}px;`}
  ${({ theme: { form } }) => `
  border: ${Number(form.input.states.normal.hasBorder)}px solid ${
    form.input.states.normal.borderColor
  };`}
  ${({ iconLeft }) =>
    iconLeft &&
    `
  background-image: url(${iconLeft});
  background-repeat: no-repeat;
  background-position: 5px center;
  background-size: 20px;
  padding-left: 30px;`}
`;

const ExtraTxt = styled.div`
  padding: 10px 10px 10px 0;
  font-size: 14px;
  line-height: 16px;
  color: #${({ theme: { colors } }) => colors.dark};
  background-color: #${({ theme: { colors } }) => colors.light100};
`;

type Props = {
  onKeyDown?: (event: React.KeyboardEvent) => void;
  onChange?: ({ value }: { value: string }) => void;
  onBlur?: ({ value }: { value: string }) => void;
  onChangeDebounced?: ({ value }: { value: string | number }) => void;
  onEnterPress?: () => void | Promise<any>;
  onFocus?: ({ target }: { target: EventTarget | null }) => void;
  onPaste?: () => void;
  inputRef?: (element: HTMLInputElement | null) => void;
  value: any;
  isDisabled?: boolean;
  placeholder?: string;
  extraText?: string;
  debounceTime?: number;
  style?: any;
  type?: string;
  maxLength?: any;
  autofocus?: boolean;
  iconLeft?: string;
  min?: number;
  max?: number;
};

const Input = ({
  onBlur = () => {},
  onKeyDown = () => {},
  onChange = () => {},
  onChangeDebounced = () => {},
  onFocus = () => {},
  onEnterPress = () => {},
  onPaste = () => {},
  inputRef,
  value,
  isDisabled = false,
  placeholder = '',
  extraText = '',
  debounceTime = 0,
  style = {},
  type = 'text',
  maxLength = '',
  autofocus = false,
  iconLeft,
  min,
  max,
}: Props) => {
  let debounce: any = null;
  const [isFocused, setIsFocused] = useState(false);
  useEffect(() => {
    return () => {
      clearTimeout(debounce);
    };
  });

  const handleEnterPress = (event: any) => {
    if (event.key === 'Enter' && !!onEnterPress) {
      onEnterPress();
      onPaste();
    }
  };

  const handleOnBlur = ({ target }: { target: any }) => {
    setIsFocused(false);
    const { value } = target;

    onBlur && onBlur(value);
  };

  const handleChange = ({ target }: { target: any }) => {
    const { value } = target;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onChange && onChange({ value });
    if (onChangeDebounced) {
      clearTimeout(debounce);
      if (!value) {
        onChangeDebounced({ value });
      } else {
        debounce = setTimeout(
          () => onChangeDebounced({ value }),
          debounceTime || DEFAULT_DEBOUNCE_TIME
        );
      }
    }
  };

  const handleFocus = (event: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onFocus && onFocus({ target: event.target });
  };

  return (
    <Wrapper isDisabled={isDisabled} isFocused={isFocused} style={style}>
      <ActualInput
        ref={inputRef}
        iconLeft={iconLeft}
        value={value}
        readOnly={isDisabled}
        placeholder={placeholder}
        onKeyPress={handleEnterPress}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleOnBlur}
        onKeyDown={onKeyDown}
        type={type}
        maxLength={maxLength}
        autoFocus={autofocus}
        isDisabled={isDisabled}
        min={min}
        max={max}
      />
      {extraText && <ExtraTxt>{extraText}</ExtraTxt>}
    </Wrapper>
  );
};

export default Input;
