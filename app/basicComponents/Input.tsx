import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { smColors } from '../vars';

const DEFAULT_DEBOUNCE_TIME = 500;

const Wrapper = styled.div<{ isFocused: boolean; isDisabled: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  width: 100%;
  height: 40px;
  border: 1px solid ${({ isFocused }) => (isFocused ? smColors.purple : smColors.black)};
  opacity: ${({ isDisabled }) => (isDisabled ? 0.2 : 1)};
  ${({ isDisabled }) => !isDisabled && `&:hover { border: 1px solid ${smColors.purple}; `}
  background-color: ${smColors.white};
`;

const ActualInput = styled.input<{
  value: string;
  onKeyPress: (event: any) => void;
  onChange: (event: any) => void;
  onFocus: (event: any) => void;
  onBlur: (event: any) => void;
  isDisabled: any;
}>`
  flex: 1;
  width: 100%;
  height: 36px;
  padding: 8px 10px;
  border-radius: 0;
  border: none;
  color: ${({ isDisabled }) => (isDisabled ? smColors.darkGray : smColors.black)};
  font-size: 14px;
  line-height: 16px;
  outline: none;
`;

const ExtraTxt = styled.div`
  padding: 10px 10px 10px 0;
  font-size: 14px;
  line-height: 16px;
  color: ${smColors.black};
  background-color: ${smColors.white};
`;

type Props = {
  onChange?: ({ value }: { value: any }) => void;
  onChangeDebounced?: ({ value }: { value: string | number }) => void;
  onEnterPress?: () => void | Promise<any>;
  onFocus?: ({ target }: { target: EventTarget | null }) => void;
  onPaste?: () => void;
  value: any;
  isDisabled?: boolean;
  placeholder?: string;
  extraText?: string;
  debounceTime?: number;
  style?: any;
  type?: string;
  maxLength?: any;
  autofocus?: boolean;
};

const Input = ({
  onChange = () => {},
  onChangeDebounced = () => {},
  onFocus = () => {},
  onEnterPress = () => {},
  onPaste = () => {},
  value,
  isDisabled = false,
  placeholder = '',
  extraText = '',
  debounceTime = 0,
  style = {},
  type = 'text',
  maxLength = '',
  autofocus = false
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

  const handleChange = ({ target }: { target: any }) => {
    const { value } = target;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onChange && onChange({ value });
    if (onChangeDebounced) {
      clearTimeout(debounce);
      if (!value) {
        onChangeDebounced({ value });
      } else {
        debounce = setTimeout(() => onChangeDebounced({ value }), debounceTime || DEFAULT_DEBOUNCE_TIME);
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
        value={value}
        readOnly={isDisabled}
        placeholder={placeholder}
        onKeyPress={handleEnterPress}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={() => setIsFocused(false)}
        type={type}
        maxLength={maxLength}
        autoFocus={autofocus}
        isDisabled={isDisabled}
      />
      {extraText && <ExtraTxt>{extraText}</ExtraTxt>}
    </Wrapper>
  );
};

export default Input;
