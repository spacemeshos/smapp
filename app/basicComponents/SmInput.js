// @flow
import React, { PureComponent } from 'react';
import { smFonts, smColors } from '/vars';
import styled from 'styled-components';

const INPUT_PLACEHOLDER = 'Type here';
const DEFAULT_DEBOUNCE_TIME = 500;

// $FlowStyledIssue
const Input = styled.input`
  height: 44px;
  padding: 0 10px;
  border-radius: 2px;
  color: ${({ disabled }) => (disabled ? smColors.textGray : smColors.black)};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  border: 1px solid ${smColors.borderGray};
  font-family: ${smFonts.fontNormal16.fontFamily};
  font-size: ${smFonts.fontNormal16.fontSize}px;
  font-weight: ${smFonts.fontNormal16.fontWeight};
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
  onChange: Function,
  disabled?: boolean,
  placeholder?: string,
  hasError?: boolean,
  hasDebounce?: boolean,
  debounceTime?: number
};

class SmInput extends PureComponent<Props> {
  debounce: any;

  render() {
    const { disabled, placeholder, hasError } = this.props;
    return <Input hasError={hasError} disabled={!!disabled} placeholder={placeholder || INPUT_PLACEHOLDER} onChange={this.onChange} />;
  }

  componentWillUnmount(): void {
    const { hasDebounce } = this.props;
    hasDebounce && clearTimeout(this.debounce);
  }

  onChange = ({ target }: { target: Object }) => {
    const { hasDebounce, debounceTime, onChange } = this.props;
    if (hasDebounce) {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => onChange({ value: target.value }), debounceTime || DEFAULT_DEBOUNCE_TIME);
    } else {
      onChange({ value: target.value });
    }
  };
}

export default SmInput;
