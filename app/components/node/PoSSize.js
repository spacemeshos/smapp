// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { Tooltip, DropDown } from '/basicComponents';
import { tooltip } from '/assets/images';
import { smColors } from '/vars';
import PoSFooter from './PoSFooter';

const isDarkModeOn = localStorage.getItem('dmMode') === 'true';

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
  &:first-child {
    margin-bottom: 10px;
  }
  &:last-child {
    margin-bottom: 0;
  }
`;

const Text = styled.div`
  font-size: 15px;
  line-height: 17px;
  color: ${smColors.black};
`;

const Dots = styled.div`
  flex: 1;
  flex-shrink: 1;
  overflow: hidden;
  margin: 0 5px;
  font-size: 15px;
  line-height: 17px;
  color: ${smColors.black};
`;

const RewardText = styled(Text)`
  color: ${({ selected }) => (selected ? smColors.green : smColors.orange)};
`;

const GreenText = styled(Text)`
  color: ${smColors.green};
`;

const TooltipIcon = styled.img`
  width: 13px;
  height: 13px;
`;

const CustomTooltip = styled(Tooltip)`
  top: -2px;
  left: -3px;
  width: 200px;
  background-color: ${smColors.disabledGray};
  border: 1px solid ${smColors.realBlack};
`;

const TooltipWrapper = styled.div`
  position: relative;
  margin-left: 5px;
  &:hover ${CustomTooltip} {
    display: block;
  }
`;

const CommitmentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 5px;
  cursor: inherit;
  opacity: 0.5;
  color: ${isDarkModeOn ? smColors.white : smColors.realBlack};
  &:hover {
    opacity: 1;
    color: ${isDarkModeOn ? smColors.lightGray : smColors.darkGray50Alpha};
  }
  ${({ isInDropDown }) =>
    isInDropDown &&
    `color: ${smColors.realBlack}; border-bottom: 1px solid ${smColors.disabledGray};
     &:hover {
      opacity: 1;
      color: ${smColors.darkGray50Alpha};
    }`}
`;

const Commitment = styled.div`
  font-family: SourceCodeProBold;
  font-size: 16px;
  line-height: 22px;
  cursor: inherit;
`;

const commitments = [{ size: '100 GB' }, { size: '200 GB' }, { size: '300 GB' }];
const ddStyle = { border: `1px solid ${isDarkModeOn ? smColors.white : smColors.black}`, marginLeft: 'auto', flex: '0 0 125px' };

type Props = {
  folder: string,
  commitment: string,
  freeSpace: number,
  nextAction: () => void,
  status: Object
};

type State = {
  selectedCommitmentIndex: number
};

class PoSSize extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      selectedCommitmentIndex: props.commitment ? commitments.findIndex((commitment) => commitment.size === props.commitment) : 0
    };
  }

  render() {
    const { folder, freeSpace, nextAction, status } = this.props;
    const { selectedCommitmentIndex } = this.state;
    return (
      <>
        <Row>
          <Text>Proof of space size</Text>
          <TooltipWrapper>
            <TooltipIcon src={tooltip} />
            <CustomTooltip text="Some text" />
          </TooltipWrapper>
          <Dots>.....................................................</Dots>
          <DropDown
            data={commitments}
            DdElement={({ size, isMain }) => this.renderDDRow({ size, isInDropDown: !isMain })}
            onPress={this.selectCommitment}
            selectedItemIndex={selectedCommitmentIndex}
            rowHeight={40}
            whiteIcon={isDarkModeOn}
            style={ddStyle}
          />
        </Row>
        <Row>
          <Text>Estimated coin reward</Text>
          <TooltipWrapper>
            <TooltipIcon src={tooltip} />
            <CustomTooltip text="Some text" />
          </TooltipWrapper>
          <Dots>.....................................................</Dots>
          <RewardText selected={selectedCommitmentIndex !== -1}>{selectedCommitmentIndex !== -1 ? '10 SMESH / MONTH' : '0 SMESH / MONTH'}</RewardText>
        </Row>
        <Row>
          <Text>PoS data folder</Text>
          <Dots>.....................................................</Dots>
          <GreenText>{folder}</GreenText>
        </Row>
        <Row>
          <Text>Free space</Text>
          <Dots>.....................................................</Dots>
          <GreenText>{freeSpace} GB</GreenText>
        </Row>
        <PoSFooter action={() => nextAction({ commitment: commitments[selectedCommitmentIndex].size })} isDisabled={selectedCommitmentIndex === -1 || !status} />
      </>
    );
  }

  renderDDRow = ({ size, isInDropDown }: { size: string, isInDropDown: boolean }) => (
    <CommitmentWrapper isInDropDown={isInDropDown}>
      <Commitment>{size}</Commitment>
    </CommitmentWrapper>
  );

  selectCommitment = ({ index }: { index: number }) => {
    this.setState({ selectedCommitmentIndex: index });
  };
}

export default PoSSize;
