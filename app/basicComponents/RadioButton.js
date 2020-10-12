// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';

const DEFAULT_DEBOUNCE_TIME = 500;

const Input = styled.input`
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
    border: 1px solid ${smColors.black};
  }
  :checked::after {
    content: '';
    position: absolute;
    top: 70%;
    left: calc(50% - 10px);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${smColors.green};
    transform: translate(-50%, -50%);
    visibility: visible;
  }
`;

type Props = {
  onChange?: ({ value: string }) => void,
  onChangeDebounced?: ({ value: string }) => void,
  onEnterPress?: () => void | Promise<any>,
  onFocus?: ({ target: Object }) => void,
  value: string,
  checked?: boolean,
  name?: string,
  debounceTime?: number,
  autofocus?: boolean
};

type State = {
  isFocused: boolean
};

class RadioButton extends Component<Props, State> {
  debounce: TimeoutID;

  state = {
    isFocused: false
  };

  render() {
    const { value, autofocus, checked, name } = this.props;
    const { isFocused } = this.state;

    return (
      <Input
        value={value}
        checked={checked}
        name={name}
        onKeyPress={this.onEnterPress}
        onChange={this.onChange}
        onFocus={this.handleFocus}
        type="radio"
        onBlur={() => this.setState({ isFocused })}
        autoFocus={autofocus}
      />
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

export default RadioButton;
