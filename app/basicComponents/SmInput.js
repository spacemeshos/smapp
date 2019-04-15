// @flow
import React, { PureComponent } from 'react';
import { smColors } from '/vars';
import styled from 'styled-components';

const INPUT_PLACEHOLDER = 'Type here';
const DEFAULT_DEBOUNCE_TIME = 500;

// $FlowStyledIssue
const Wrapper = styled.div`
  width: 100%;
  height: ${({ isErrorMsgEnabled }) => (isErrorMsgEnabled ? '64' : '44')}px;
  display: flex;
  flex-direction: column;
`;

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

const ErrorMsg = styled.div`
  height: 20px;
  line-height: 20px;
  color: ${smColors.red};
  font-size: 14px;
`;

type Props = {
  onChange?: ({ value: string }) => void,
  defaultValue?: string,
  isDisabled?: boolean,
  placeholder?: string,
  isErrorMsgEnabled?: boolean,
  errorMsg?: ?string,
  hasDebounce?: boolean,
  debounceTime?: number,
  wrapperStyle?: Object,
  style?: Object,
  type?: string
};

class SmInput extends PureComponent<Props> {
  debounce: any;

  static defaultProps = {
    isErrorMsgEnabled: true
  };

  render() {
    const { defaultValue, isDisabled, placeholder, errorMsg, isErrorMsgEnabled, wrapperStyle, style, type } = this.props;
    return (
      <Wrapper isErrorMsgEnabled={isErrorMsgEnabled} style={wrapperStyle}>
        <Input
          defaultValue={defaultValue}
          hasError={errorMsg}
          readOnly={isDisabled}
          placeholder={placeholder || INPUT_PLACEHOLDER}
          onChange={this.onChange}
          style={style}
          type={type}
        />
        {isErrorMsgEnabled && <ErrorMsg>{errorMsg || ''}</ErrorMsg>}
      </Wrapper>
    );
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
