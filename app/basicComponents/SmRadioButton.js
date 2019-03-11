// @flow
import React from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';

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

const HoveredCenter = styled.div`
  display: none;
  position: absolute;
  top: 5px;
  left: 5px;
  height: 10px;
  width: 10px;
  border-radius: 6px;
  background-color: ${smColors.green30alpha};
`;

// $FlowStyledIssue
const Wrapper = styled.div`
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
    background-color: ${smColors.green10alpha};
  `};
  transition: all 0.12s linear;
  &:hover {
    background-color: ${smColors.hoverLightGreen};
  }
  &:hover ${HoveredCenter} {
    display: block;
  }
  &:active {
    background-color: ${smColors.actionLightGreen};
  }
`;

// $FlowStyledIssue
const RadioInner = styled.div`
  position: absolute;
  top: 10px;
  height: 20px;
  width: 20px;
  border-radius: 12px;
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

const LabelWrapper = styled.div`
  padding-left: 40px;
  padding-right: 12px;
  height: 44px;
`;

// $FlowStyledIssue
const LabelText = styled.span`
  font-size: 16px;
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
    <Wrapper onClick={() => (disabled ? undefined : onSelect({ id, label }))} disabled={disabled} selected={id === radioSelected}>
      <RadioInner selected={id === radioSelected}>
        <HoveredCenter />
      </RadioInner>
      <LabelWrapper>
        <LabelText disabled={disabled}>{label}</LabelText>
      </LabelWrapper>
    </Wrapper>
  );
};

export default SmRadioButton;
