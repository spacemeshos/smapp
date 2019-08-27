// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Tooltip, ErrorPopup } from '/basicComponents';
import { tooltip } from '/assets/images';
import { smColors, nodeConsts } from '/vars';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
`;

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
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: inherit;
`;

const Text = styled.div`
  font-size: 20px;
  line-height: 35px;
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

const TooltipWrapper = styled.div`
  position: relative;
  margin-left: 5px;
  &:hover ${CustomTooltip} {
    display: block;
  }
`;

const ErrorPopupWrapper = styled.div`
  position: relative;
  width: 305px;
  height: 65px;
  margin: 10px auto 0;
`;

type Props = {
  onClick: ({ index: number }) => void,
  freeSpace: number
};

type State = {
  selectedCommitmentIndex: number,
  hasInsufficientSpace: boolean
};

class CommitmentSelector extends Component<Props, State> {
  state = {
    selectedCommitmentIndex: -1,
    hasInsufficientSpace: false
  };

  render() {
    const { hasInsufficientSpace } = this.state;
    return (
      <Wrapper>
        <SelectorsWrapper>{this.renderSelector()}</SelectorsWrapper>
        <ErrorPopupWrapper>
          {hasInsufficientSpace && <ErrorPopup onClick={this.closeErrorPopup} text="This partition doesn't have enough free space, please select another" />}
        </ErrorPopupWrapper>
      </Wrapper>
    );
  }

  renderSelector = () => {
    const { selectedCommitmentIndex, hasInsufficientSpace } = this.state;
    const selectors = [];
    for (let i = 0; i < 3; i += 1) {
      selectors.push(
        <SelectorWrapper onClick={() => this.handleClick({ index: i })} key={i} style={{ zIndex: 3 - i }}>
          <SelectorUpperPart hasError={hasInsufficientSpace && selectedCommitmentIndex === i} isSelected={selectedCommitmentIndex === i}>
            <TextWrapper>
              <Text>{nodeConsts.COMMITMENT_SIZE * (i + 1)} GB</Text>
              <TooltipWrapper>
                <TooltipIcon src={tooltip} />
                <CustomTooltip text="The download of spacemesh requires 5GB of space in addition to the amount you choose to allocate for mining" />
              </TooltipWrapper>
            </TextWrapper>
          </SelectorUpperPart>
          <SelectorLowerPart hasError={hasInsufficientSpace && selectedCommitmentIndex === i} />
        </SelectorWrapper>
      );
    }
    return selectors;
  };

  handleClick = ({ index }: { index: number }) => {
    const { freeSpace, onClick } = this.props;
    const totalRequiredSpace = nodeConsts.COMMITMENT_SIZE * (index + 1);
    onClick({ index: freeSpace < totalRequiredSpace ? 0 : totalRequiredSpace });
    this.setState({ selectedCommitmentIndex: index, hasInsufficientSpace: freeSpace < totalRequiredSpace });
  };

  closeErrorPopup = () => {
    const { onClick } = this.props;
    onClick({ index: -1 });
    this.setState({ selectedCommitmentIndex: -1, hasInsufficientSpace: false });
  };
}

export default CommitmentSelector;
