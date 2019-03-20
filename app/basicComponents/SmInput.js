// @flow
import React, { PureComponent } from 'react';
import { smColors } from '/vars';
import styled from 'styled-components';

const INPUT_PLACEHOLDER = 'Type here';
const DEFAULT_DEBOUNCE_TIME = 500;

const Wrapper = styled.div`
  width: 100%;
`;

// $FlowStyledIssue
const Input = styled.input`
  height: 44px;
  width: calc(100% - 20px);
  padding: 0 10px;
  border-radius: 2px;
  color: ${({ disabled }) => (disabled ? smColors.textGray : smColors.black)};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
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

const ErrorsSection = styled.div`
  height: 0;
`;

const ErrorMessageWrapper = styled.div`
  line-height: 18px;
`;

const ErrorMessage = styled.div`
  color: ${smColors.red};
  font-size: 14px;
`;

type Props = {
  onChange: Function,
  disabled?: boolean,
  placeholder?: string,
  errorMessage?: ?string,
  hasDebounce?: boolean,
  debounceTime?: number
};

class SmInput extends PureComponent<Props> {
  debounce: any;

  render() {
    const { disabled, placeholder, errorMessage } = this.props;
    return (
      <Wrapper>
        <Input key="input-elem" hasError={errorMessage} disabled={!!disabled} placeholder={placeholder || INPUT_PLACEHOLDER} onChange={this.onChange} />
        <ErrorsSection key="error-elem">
          {errorMessage && (
            <ErrorMessageWrapper>
              <ErrorMessage>{errorMessage}</ErrorMessage>
            </ErrorMessageWrapper>
          )}
        </ErrorsSection>
      </Wrapper>
    );
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
