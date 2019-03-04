// @flow
import React from 'react';
import { smFonts, smColors } from '/vars';
import styled from 'styled-components';

const INPUT_PLACEHOLDER = 'Type here';

// $FlowStyledIssue
const StyledSmInput = styled.input`
  height: 44px;
  padding-left: 8px;
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
`;

const SmInput = (props: any) => {
  const { disabled, placeholder, hasError } = props;
  return <StyledSmInput {...props} hasError={hasError} disabled={!!disabled} placeholder={placeholder || INPUT_PLACEHOLDER} />;
};

export default SmInput;
