// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Tooltip, ErrorPopup } from '/basicComponents';
import { tooltip } from '/assets/images';
import { smColors } from '/vars';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const DdWrapper = styled.div`
  flex: 1;
  margin-right: 100px;
`;

// $FlowStyledIssue
const SelectorUpperPart = styled.div`
  position: absolute;
  z-index: 2;
  top: 0;
  bottom: 5px;
  left: 5px;
  right: 0;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  width: 160px;
  height: 120px;
  padding: 10px;
  cursor: inherit;
  &:hover {
    background-color: ${({ hasError }) => (hasError ? smColors.orange : smColors.realBlack)};
  }
  ${({ isSelected, hasError }) => (hasError ? `background-color: ${smColors.orange}` : `background-color: ${isSelected ? smColors.realBlack : smColors.darkGray}`)}
`;

// $FlowStyledIssue
const SelectorLowerPart = styled.div`
  position: absolute;
  z-index: 0;
  top: 5px;
  bottom: 0;
  left: 0;
  right: 5px;
  width: 160px;
  height: 120px;
  cursor: inherit;
  &:hover {
    border: 1px solid ${({ hasError }) => (hasError ? smColors.orange : smColors.realBlack)};
  }
  ${({ isSelected, hasError }) => (hasError ? `border: 1px solid ${smColors.orange}` : `border: 1px solid ${isSelected ? smColors.realBlack : smColors.darkGray}`)}
`;

const SelectorWrapper = styled.div`
  position: relative;
  width: 165px;
  height: 125px;
  cursor: pointer;
  &:active ${SelectorUpperPart} {
    transform: translate3d(-5px, 5px, 0);
    transition: transform 0.2s cubic-bezier;
    background-color: ${smColors.black};
  }
  &:active ${SelectorLowerPart} {
    border: 1px solid ${smColors.black};
  }
`;

const SelectorsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  cursor: inherit;
`;

const ComplexTextWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Text = styled.div`
  font-size: 13px;
  line-height: 17px;
  color: ${smColors.white};
  cursor: inherit;
`;

const TooltipIcon = styled.img`
  width: 13px;
  height: 13px;
`;

const CustomTooltip = styled(Tooltip)`
  top: -1px;
  right: -175px;
`;

// $FlowStyledIssue
const TooltipWrapper = styled.div`
  position: relative;
  margin-left: 5px;
  &:hover ${CustomTooltip} {
    display: block;
  }
`;

type Props = {
  onClick: Function,
  freeSpace: number,
  selectedItemIndex: number
};

type State = {
  hasInsufficientSpace: boolean
};

class CommitmentSelector extends Component<Props, State> {
  state = {
    hasInsufficientSpace: false
  };

  render() {
    const { hasInsufficientSpace } = this.state;
    return (
      <Wrapper>
        <HeaderWrapper>
          <DdWrapper />
          {hasInsufficientSpace && <ErrorPopup onClick={this.closeErrorPopup} text="This partition doesn't have enough free space, please select another" />}
        </HeaderWrapper>
        <SelectorsWrapper>{this.renderSelector()}</SelectorsWrapper>
      </Wrapper>
    );
  }

  renderSelector = () => {
    const { selectedItemIndex } = this.props;
    const { hasInsufficientSpace } = this.state;
    const selectors = [];
    for (let i = 1; i < 4; i += 1) {
      selectors.push(
        <SelectorWrapper onClick={() => this.handleClick({ index: i - 1 })} key={i} style={{ zIndex: 4 - i }}>
          <SelectorUpperPart hasError={hasInsufficientSpace && selectedItemIndex === 0} isSelected={selectedItemIndex === i - 1}>
            <TextWrapper>
              <ComplexTextWrapper>
                <Text>{200 * i + 5}GB</Text>
                <TooltipWrapper>
                  <TooltipIcon src={tooltip} />
                  <CustomTooltip text="The download of spacemesh requires 5GB of space in addition to the amount you choose to allocate for mining" />
                </TooltipWrapper>
              </ComplexTextWrapper>
              <Text>{10 * i} SMC/WEEK</Text>
            </TextWrapper>
          </SelectorUpperPart>
          <SelectorLowerPart />
        </SelectorWrapper>
      );
    }
    return selectors;
  };

  handleClick = ({ index }: { index: number }) => {
    const { freeSpace, onClick } = this.props;
    const totalRequiredSpace = 200 * index + 5;
    onClick({ index });
    if (freeSpace < totalRequiredSpace) {
      this.setState({ hasInsufficientSpace: true });
    }
  };

  closeErrorPopup = () => {
    const { onClick } = this.props;
    onClick({ index: -1 });
    this.setState({ hasInsufficientSpace: false });
  };
}

export default CommitmentSelector;
