// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';

const HoveredCenter = styled.div`
  display: none;
  position: absolute;
  top: 4px;
  left: 4px;
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: ${smColors.green10alpha};
  cursor: inherit;
`;

// $FlowStyledIssue
const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 15px;
  border: 1px solid ${({ isSelected }) => (isSelected ? smColors.green : smColors.borderGray)};
  border-radius: 2px;
  cursor: ${({ isDisabled }) => (isDisabled ? 'default' : 'pointer')};
  background-color: ${smColors.white};
  opacity: ${({ isDisabled }) => (isDisabled ? 0.6 : 1)};
  transition: all 0.12s linear;
  &:hover {
    background-color: ${smColors.green10alpha};
  }
  &:hover ${HoveredCenter} {
    display: block;
  }
`;

// $FlowStyledIssue
const RadioInner = styled.div`
  position: relative;
  height: 20px;
  width: 20px;
  margin-right: 20px;
  border-radius: 50%;
  border: 1px solid ${smColors.borderGray};
  background-color: ${({ isSelected }) => (isSelected ? smColors.green : smColors.white)};
  transition: all 0.3s linear;
  cursor: inherit;
`;

// $FlowStyledIssue
const SelectedCircle = styled.div`
  display: ${({ isSelected }) => (isSelected ? 'block' : 'none')};
  position: absolute;
  top: 6px;
  left: 6px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${smColors.white};
`;

// $FlowStyledIssue
const LabelText = styled.span`
  font-size: 16px;
  color: ${({ isDisabled }) => (isDisabled ? smColors.gray : smColors.darkGray)};
  line-height: 22px;
  cursor: inherit;
`;

const AdditionalText = styled(LabelText)`
  margin-left: auto;
`;

export type RadioEntry = {
  label: string,
  additionalText?: string,
  isDisabled?: boolean
};

type Props = {
  ...RadioEntry,
  onSelect?: ({ index: number }) => void,
  isSelected: boolean,
  style?: Object
};

class SmRadioButton extends PureComponent<Props> {
  render() {
    const { onSelect, isDisabled, isSelected, label, additionalText, style } = this.props;
    return (
      <Wrapper onClick={isDisabled ? null : onSelect} isDisabled={isDisabled} isSelected={isSelected} style={style}>
        <RadioInner isSelected={isSelected}>
          <HoveredCenter />
          <SelectedCircle isSelected={isSelected} />
        </RadioInner>
        <LabelText isDisabled={isDisabled}>{label}</LabelText>
        {!!additionalText && <AdditionalText>{additionalText}</AdditionalText>}
      </Wrapper>
    );
  }
}

export default SmRadioButton;
