// @flow
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';

const DEFAULT_DEBOUNCE_TIME = 500;

const Wrapper = styled.div`
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

const ActualInput = styled.input`
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
  onChange?: ({ value: string }) => void,
  onChangeDebounced?: ({ value: string }) => void,
  onEnterPress?: () => void | Promise<any>,
  onFocus?: ({ target: Object }) => void,
  value: string,
  isDisabled?: boolean,
  placeholder?: string,
  extraText?: string,
  debounceTime?: number,
  style?: Object,
  type?: string,
  maxLength?: string,
  autofocus?: boolean
};

const Input = ({
  onChange,
  onChangeDebounced,
  onFocus,
  onEnterPress,
  value,
  isDisabled,
  placeholder = '',
  extraText,
  debounceTime,
  style,
  type = 'text',
  maxLength,
  autofocus
}: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  useEffect(() => {
    return () => {
      clearTimeout(debounce);
    };
  }, []);

  let debounce: TimeoutID = null;

  const handleEnterPress = ({ key }: { key: string }) => {
    if (key === 'Enter' && !!onEnterPress) {
      onEnterPress();
    }
  };

  const handleChange = ({ target }: { target: { value: string } }) => {
    const { value } = target;
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

  const handleFocus = (event: Event) => {
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
      />
      {extraText && <ExtraTxt>{extraText}</ExtraTxt>}
    </Wrapper>
  );
};

export default Input;
