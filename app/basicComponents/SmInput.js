// @flow
import React, { PureComponent } from 'react';
import { smColors } from '/vars';
import styled from 'styled-components';

const INPUT_PLACEHOLDER = 'Type here';
const DEFAULT_DEBOUNCE_TIME = 500;

const Wrapper = styled.div`
  height: 64px;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

// $FlowStyledIssue
const Input = styled.input`
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

const ErrorsSection = styled.div`
  position: relative;
  height: 20px;
  line-height: 20px;
`;

const ErrorMessage = styled.div`
  color: ${smColors.red};
  font-size: 14px;
`;

type Props = {
  onChange?: ({ value: string }) => void,
  isDisabled?: boolean,
  placeholder?: string,
  errorMessage?: ?string,
  hasDebounce?: boolean,
  debounceTime?: number,
  style?: Object
};

class SmInput extends PureComponent<Props> {
  debounce: any;

  render() {
    const { isDisabled, placeholder, errorMessage, style } = this.props;
    return (
      <Wrapper>
        <Input hasError={errorMessage} isDisabled={!!isDisabled} placeholder={placeholder || INPUT_PLACEHOLDER} onChange={this.onChange} style={style} />
        <ErrorsSection>{errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}</ErrorsSection>
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
