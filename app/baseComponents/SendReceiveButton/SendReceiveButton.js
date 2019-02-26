// @flow
/* eslint react/no-unused-prop-types: 0 */
import React from 'react';
import { smColors, smFonts } from '/vars';
import { sendImageSource, receiveImageSource, sendImageSourceDisabled, receiveImageSourceDisabled } from '/assets/images';
import styled from 'styled-components';

type SendReceiveButtonProps = {
  title: 'Send coins' | 'Receive coins',
  disabled?: boolean,
  onPress: () => void
};

// $FlowStyledIssue
const StyledRootButton = styled.div`
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  height: 90px;
  width: 244px;
  border: 1px solid ${({ disabled }) => (disabled ? smColors.borderGray : smColors.green)};
  borderradius: 2px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  &:hover {
    background-color: rgba(${smColors.greenRgb}, 0.1);
  }
  &:active {
    opacity: 0.8;
  }
`;

const StyledButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  user-select: none;
`;

const StyledImage = styled.img`
  height: 40px;
  width: 40px;
  margin-top: 4px;
`;

const StyledLabelWrapper = styled.div`
  margin: 10px;
`;

// $FlowStyledIssue
const StyledLabel = styled.span`
  font-family: ${smFonts.fontNormal16.fontFamily};
  font-size: ${smFonts.fontNormal16.fontSize};
  font-weight: ${smFonts.fontNormal16.fontWeight};
  color: ${({ disabled }) => (disabled ? smColors.borderGray : smColors.black)};
`;

const renderReceiveButtonElem = (props: SendReceiveButtonProps) => {
  const { title, disabled } = props;
  return (
    <StyledButton>
      <StyledImage src={getImageSource(props)} alt="Missing icon" />
      <StyledLabelWrapper>
        <StyledLabel disabled={disabled}>{title}</StyledLabel>
      </StyledLabelWrapper>
    </StyledButton>
  );
};

const getImageSource = (props: SendReceiveButtonProps) => {
  const { disabled, title } = props;
  if (disabled) {
    return title === 'Send coins' ? sendImageSourceDisabled : receiveImageSourceDisabled;
  } else {
    return title === 'Send coins' ? sendImageSource : receiveImageSource;
  }
};

const SendReceiveButton = (props: SendReceiveButtonProps) => {
  const { disabled, onPress } = props;
  return (
    <StyledRootButton disabled={disabled} onClick={disabled ? undefined : onPress}>
      {renderReceiveButtonElem(props)}
    </StyledRootButton>
  );
};

export default SendReceiveButton;
