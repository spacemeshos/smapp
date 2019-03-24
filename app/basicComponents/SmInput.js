// @flow
import React, { PureComponent } from 'react';
import { smColors } from '/vars';
import styled from 'styled-components';

const INPUT_PLACEHOLDER = 'Type here';
const DEFAULT_DEBOUNCE_TIME = 500;

// $FlowStyledIssue
const Input = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 10px;
  border-radius: 2px;
  color: ${({ isDisabled }) => (isDisabled ? smColors.gray : smColors.black)};
  opacity: ${({ isDisabled }) => (isDisabled ? 0.6 : 1)};
  border: 1px solid ${smColors.borderGray};
  font-size: 16px;
  &:focus {
    outline: none;
    border: 1px solid ${smColors.green};
  }
  transition: all 0.15s linear;
  ${({ hasError }) =>
    hasError &&
    `
    border: 1px solid ${smColors.red};
  `}
  outline: none;
`;

type Props = {
  onChange?: ({ value: string }) => void,
  isDisabled?: boolean,
  placeholder?: string,
  hasError?: boolean,
  hasDebounce?: boolean,
  debounceTime?: number,
  style?: Object
};

class SmInput extends PureComponent<Props> {
  debounce: any;

  render() {
    const { isDisabled, placeholder, hasError, style } = this.props;
    return <Input hasError={hasError} isDisabled={isDisabled} placeholder={placeholder || INPUT_PLACEHOLDER} onChange={this.onChange} style={style} />;
  }

  componentWillUnmount(): void {
    const { hasDebounce } = this.props;
    hasDebounce && clearTimeout(this.debounce);
  }

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

export default SmInput;
