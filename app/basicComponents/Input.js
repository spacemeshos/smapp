// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';

const DEFAULT_DEBOUNCE_TIME = 500;

// $FlowStyledIssue
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
`;

// $FlowStyledIssue
const ActualInput = styled.input`
  flex: 1;
  width: 100%;
  height: 34px;
  padding: 8px 10px;
  border-radius: 0;
  border: none;
  color: ${({ isDisabled }) => (isDisabled ? smColors.gray : smColors.black)};
  font-size: 14px;
  line-height: 16px;
  outline: none;
`;

const ExtraTxt = styled.div`
  margin: 8px 10px 9px 0;
  font-size: 14px;
  line-height: 16px;
  color: ${smColors.red};
  font-size: 14px;
`;

type Props = {
  onChange?: ({ value: string }) => void,
  onEnterPress?: () => void,
  value: string,
  isDisabled?: boolean,
  placeholder?: string,
  extraText?: string,
  hasDebounce?: boolean,
  debounceTime?: number,
  style?: Object,
  type?: string
};

type State = {
  isFocused: boolean
};

class Input extends Component<Props, State> {
  debounce: any;

  static defaultProps = {
    type: 'text',
    placeholder: ''
  };

  state = {
    isFocused: false
  };

  render() {
    const { value, isDisabled, placeholder, extraText, style, type } = this.props;
    const { isFocused } = this.state;
    return (
      <Wrapper isDisabled={isDisabled} isFocused={isFocused} style={style}>
        <ActualInput
          value={value}
          readOnly={isDisabled}
          placeholder={placeholder}
          onKeyPress={this.onEnterPress}
          onChange={this.onChange}
          onFocus={() => this.setState({ isFocused: true })}
          onBlur={() => this.setState({ isFocused: false })}
          type={type}
        />
        {extraText && <ExtraTxt>{extraText}</ExtraTxt>}
      </Wrapper>
    );
  }

  componentWillUnmount(): void {
    const { hasDebounce } = this.props;
    hasDebounce && clearTimeout(this.debounce);
  }

  onEnterPress = ({ key }: { key: string }) => {
    const { onEnterPress } = this.props;
    if (key === 'Enter' && !!onEnterPress) {
      onEnterPress();
    }
  };

  onChange = ({ target }: { target: { value: string } }) => {
    const { hasDebounce, debounceTime, onChange } = this.props;
    if (hasDebounce) {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => onChange && onChange({ value: target.value }), debounceTime || DEFAULT_DEBOUNCE_TIME);
    } else {
      onChange && onChange({ value: target.value });
    }
  };
}

export default Input;
