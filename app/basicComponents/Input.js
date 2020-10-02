// @flow
import React, { Component } from 'react';
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

const RadioInput = styled.input`
  position: relative;
  height: 18px;
  width: 18px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
  }
  ::before {
    content: '';
    position: absolute;
    top: 70%;
    left: calc(50% - 10px);
    width: 14px;
    height: 14px;
    border-radius: 50%;
    -webkit-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
    border: 1px solid #000;
  }
  :checked::after {
    content: '';
    position: absolute;
    top: 70%;
    left: calc(50% - 10px);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #65B042;
    transform: translate(-50%, -50%);
    visibility: visible;
  }
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
  checked?: boolean,
  name?: string,
  isDisabled?: boolean,
  placeholder?: string,
  extraText?: string,
  debounceTime?: number,
  style?: Object,
  type?: string,
  maxLength?: string,
  autofocus?: boolean
};

type State = {
  isFocused: boolean
};

class Input extends Component<Props, State> {
  debounce: TimeoutID;

  static defaultProps = {
    type: 'text',
    placeholder: ''
  };

  state = {
    isFocused: false
  };

  render() {
    const { value, isDisabled, placeholder, extraText, style, type, maxLength, autofocus, checked, name } = this.props;
    const { isFocused } = this.state;
    return (
      type === 'radio' ? (
      <RadioInput
        value={value}
        checked={checked}
        name={name}
        onKeyPress={this.onEnterPress}
        onChange={this.onChange}
        onFocus={this.handleFocus}
        onBlur={() => this.setState({ isFocused: false })}
        type={type}
        autoFocus={autofocus}
      />
    ) : (
      <Wrapper isDisabled={isDisabled} isFocused={isFocused} style={style}>
        <ActualInput
          value={value}
          readOnly={isDisabled}
          placeholder={placeholder}
          onKeyPress={this.onEnterPress}
          onChange={this.onChange}
          onFocus={this.handleFocus}
          onBlur={() => this.setState({ isFocused: false })}
          type={type}
          maxLength={maxLength}
          autoFocus={autofocus}
        />
        {extraText && <ExtraTxt>{extraText}</ExtraTxt>}
      </Wrapper>
      )
    );
  }

  componentWillUnmount(): void {
    const { onChangeDebounced } = this.props;
    onChangeDebounced && clearTimeout(this.debounce);
  }

  onEnterPress = ({ key }: { key: string }) => {
    const { onEnterPress } = this.props;
    if (key === 'Enter' && !!onEnterPress) {
      onEnterPress();
    }
  };

  onChange = ({ target }: { target: { value: string } }) => {
    const { onChangeDebounced, debounceTime, onChange } = this.props;
    const { value } = target;
    onChange && onChange({ value });
    if (onChangeDebounced) {
      clearTimeout(this.debounce);
      if (!value) {
        onChangeDebounced({ value });
      } else {
        this.debounce = setTimeout(() => onChangeDebounced({ value }), debounceTime || DEFAULT_DEBOUNCE_TIME);
      }
    }
  };

  handleFocus = (event: Event) => {
    const { onFocus } = this.props;
    const target = event.target;
    this.setState({ isFocused: true }, () => {
      onFocus && onFocus({ target });
    });
  };
}

export default Input;
