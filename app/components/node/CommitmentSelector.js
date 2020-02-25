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
  ${({ isDisabled, hasError }) =>
    !isDisabled &&
    `&:hover {
    background-color: ${hasError ? smColors.orange : smColors.realBlack};
  }`}
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
  ${({ isDisabled, hasError }) =>
    !isDisabled &&
    `&:hover {
    border: 1px solid ${hasError ? smColors.orange : smColors.realBlack};
  }`}
  ${({ isSelected, hasError }) => (hasError ? `border: 1px solid ${smColors.orange}` : `border: 1px solid ${isSelected ? smColors.realBlack : smColors.darkGray}`)}
`;

const SelectorWrapper = styled.div`
  position: relative;
  width: 165px;
  height: 125px;
  ${({ isDisabled }) =>
    !isDisabled &&
    `cursor: pointer;
    &:active ${SelectorUpperPart} {
    transform: translate3d(-5px, 5px, 0);
    transition: transform 0.2s cubic-bezier;
    background-color: ${smColors.black};
  }
  &:active ${SelectorLowerPart} {
    border: 1px solid ${smColors.black};
  }`}
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
  onClick: ({ commitment: number }) => void,
  freeSpace: number,
  commitmentSize: number
};

type State = {
  selectedCommitmentIndex: number,
  hasInsufficientSpace: boolean
};

class CommitmentSelector extends Component<Props, State> {
  state = {
    selectedCommitmentIndex: 0,
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
    const { commitmentSize } = this.props;
    const { selectedCommitmentIndex, hasInsufficientSpace } = this.state;
    const selectors = [];
    // TODO: for Testnet 0.1 purposes only showing one valid space commitment
    for (let i = 0; i < 1; i += 1) {
      selectors.push(
        <SelectorWrapper onClick={() => this.handleClick({ index: i })} key={i} style={{ zIndex: 1 - i }} isDisabled={i !== 0}>
          <SelectorUpperPart hasError={hasInsufficientSpace && selectedCommitmentIndex === i} isSelected={selectedCommitmentIndex === i} isDisabled={i !== 0}>
            <TextWrapper>
              <Text>{commitmentSize * (i + 1)} GB</Text>
              <TooltipWrapper>
                <TooltipIcon src={tooltip} />
                <CustomTooltip text="The download of spacemesh requires 5GB of space in addition to the amount you choose to commit for smeshing" />
              </TooltipWrapper>
            </TextWrapper>
          </SelectorUpperPart>
          <SelectorLowerPart hasError={hasInsufficientSpace && selectedCommitmentIndex === i} isDisabled={i !== 0} />
        </SelectorWrapper>
      );
    }
    return selectors;
  };

  handleClick = ({ index }: { index: number }) => {
    const { commitmentSize, freeSpace, onClick } = this.props;
    const totalRequiredSpace = commitmentSize * (index + 1);
    onClick({ commitment: freeSpace < totalRequiredSpace ? 0 : totalRequiredSpace });
    this.setState({ selectedCommitmentIndex: index, hasInsufficientSpace: freeSpace < totalRequiredSpace });
  };

  closeErrorPopup = () => {
    const { onClick } = this.props;
    onClick({ commitment: 0 });
    this.setState({ selectedCommitmentIndex: -1, hasInsufficientSpace: false });
  };
}

export default CommitmentSelector;
