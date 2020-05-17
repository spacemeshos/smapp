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

const ExtraTxt = styled.div`
  padding: 8px 10px 9px 0;
  font-size: 14px;
  line-height: 16px;
  color: ${smColors.black};
  font-size: 14px;
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
    const { value, isDisabled, placeholder, extraText, style, type, maxLength, autofocus } = this.props;
    const { isFocused } = this.state;
    return (
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
