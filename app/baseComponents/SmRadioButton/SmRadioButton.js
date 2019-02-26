// @flow
import React from 'react';
import { smFonts, smColors } from '/vars';
import styled from 'styled-components';

export type RadioEntry = {
  id: number | string,
  label: string,
  disabled?: boolean
};

type SmRadioButtonProps = {
  ...RadioEntry,
  onSelect: (selection: any) => void,
  radioSelected: number | string
};

const StyledHoveredCenter = styled.div`
  display: none;
  position: absolute;
  top: 4px;
  left: 4px;
  height: 10px;
  width: 10px;
  border-radius: 6px;
  background-color: rgba(${smColors.greenRgb}, 0.2);
`;

const StyledAction = styled.div`
  &:hover {
    background-color: ${smColors.hoverLightGreen};
  }
  &:hover ${StyledHoveredCenter} {
    display: block;
  }
  &:active {
    background-color: ${smColors.actionLightGreen};
  }
`;

// $FlowStyledIssue
const StyledRadioWrapper = styled(StyledAction)`
  display: flex;
  flex-direction: row;
  position: relative;
  border: 1px solid ${smColors.borderGray};
  border-radius: 2px;
  cursor: pointer;
  ${({ disabled }) =>
    disabled &&
    `
      pointer-events: none;
      cursor: default;
  `};
  ${({ selected }) =>
    selected &&
    `
    border: 1px solid ${smColors.green};
    background-color: rgba(${smColors.greenRgb}, 0.1);
  `};
  transition: all 0.1s linear;
`;

// $FlowStyledIssue
const StyledRadioInner = styled.div`
  position: absolute;
  top: 12px;
  height: 20px;
  width: 20px;
  border-radius: 10px;
  margin-left: 12px;
  border: 1px solid ${smColors.borderGray};
  ${({ selected }) =>
    selected &&
    `
    border: 1px solid ${smColors.green};
    background-color: ${smColors.green};
  `};
  transition: all 0.3s linear;
`;

const StyledLabelWrapper = styled.div`
  padding-left: 40px;
  padding-right: 12px;
  height: 44px;
`;

// $FlowStyledIssue
const StyledLabelText = styled.span`
  font-family: ${smFonts.fontNormal16.fontFamily};
  font-size: ${smFonts.fontNormal16.fontSize}px;
  font-weight: ${smFonts.fontNormal16.fontWeight};
  color: ${smColors.black};
  line-height: 44px;
  ${({ disabled }) =>
    disabled &&
    `
      color: ${smColors.textGray};
  `};
`;

const SmRadioButton = (props: SmRadioButtonProps) => {
  const { disabled, radioSelected, id, label, onSelect } = props;
  return (
    <StyledRadioWrapper onClick={() => (disabled ? undefined : onSelect({ id, label }))} disabled={disabled} selected={id === radioSelected}>
      <StyledRadioInner selected={id === radioSelected}>
        <StyledHoveredCenter />
      </StyledRadioInner>
      <StyledLabelWrapper>
        <StyledLabelText disabled={disabled}>{label}</StyledLabelText>
      </StyledLabelWrapper>
    </StyledRadioWrapper>
  );
};

export default SmRadioButton;
