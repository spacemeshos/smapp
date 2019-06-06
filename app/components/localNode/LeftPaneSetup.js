import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { setLocalNodeStorage, getDrivesList } from '/redux/localNode/actions';
import { smColors, localNodeModes } from '/vars';
import { SmButton, SmDropdown } from '/basicComponents';
import type { Action } from '/types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
`;

const SubHeader = styled.div`
  font-size: 16px;
  line-height: 22px;
  font-weight: bold;
  color: ${smColors.lighterBlack};
  margin-bottom: 20px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-bottom: 40px;
`;

const LabelWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex: 2;
  justify-content: flex-start;
  align-items: center;
  margin-left: 20px;
  font-size: 16px;
  color: ${smColors.lighterBlack};
`;

const BottomWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const GrayText = styled.span`
  font-size: 16px;
  line-height: 22px;
  color: ${smColors.lighterBlack50Alpha};
  margin-bottom: 20px;
`;

const FiatRateEstimation = styled(GrayText)`
  margin-bottom: 0;
  margin-left: 4px;
`;

// TODO: Test stub
const getProjectedSmcEarnings = (capacity: number) => {
  const smcPerByte = 0.0000000001; // arbitrary for test only
  return formatNumber(capacity * smcPerByte);
};

const formatNumber = (num?: number) => {
  if (!num) {
    return 0;
  }
  const formatter = new Intl.NumberFormat();
  return formatter.format(num.toFixed(2));
};

const getElementIndex = (elementsList: Volume[], element: Volume) => (element ? elementsList.findIndex((elem) => elem.id === element.id) : -1);

type CapacityAllocation = {
  id: number,
  label: string
};

type Volume = {
  id: string,
  mountPoint: string,
  label: string,
  availableDiskSpace: { bytes: number, readable: string },
  capacityAllocationsList: CapacityAllocation[]
};

type Props = {
  switchMode: (mode: number) => void,
  drives: Volume[],
  capacity: CapacityAllocation,
  drive: Volume,
  setLocalNodeStorage: Action,
  getDrivesList: Action,
  fiatRate: number
};

type State = {
  selectedDriveIndex: number,
  selectedCapacityIndex: number
};

class LeftPaneSetup extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { getDrivesList, drive, capacity, drives } = this.props;
    const selectedDriveIndex = getElementIndex(drives, drive);
    const selectedCapacityIndex = drive ? getElementIndex(drive.capacityAllocationsList, capacity) : -1;
    this.state = {
      selectedCapacityIndex,
      selectedDriveIndex
    };
    getDrivesList();
  }

  render() {
    const { drives, fiatRate } = this.props;
    const { selectedCapacityIndex, selectedDriveIndex } = this.state;

    return (
      <Wrapper>
        <SubHeader>Select Drive</SubHeader>
        <Row>
          <SmDropdown data={drives} selectedItemIndex={selectedDriveIndex} onPress={this.handleSelectDrive} />
          <LabelWrapper>{selectedDriveIndex !== -1 && `You have ${drives[selectedDriveIndex].availableDiskSpace.readable} free on your drive`}</LabelWrapper>
        </Row>
        <SubHeader>Choose how much storage to allocate for the local node</SubHeader>
        <Row>
          <SmDropdown
            data={selectedDriveIndex !== -1 && drives[selectedDriveIndex].capacityAllocationsList}
            selectedItemIndex={selectedCapacityIndex}
            onPress={this.handleSelectCapacity}
          />
          <LabelWrapper>
            {selectedCapacityIndex !== -1 && (
              <React.Fragment>
                earn ~ {getProjectedSmcEarnings(drives[selectedDriveIndex].capacityAllocationsList[selectedCapacityIndex].id)} SMC each week*{' '}
                <FiatRateEstimation> = {getProjectedSmcEarnings(fiatRate * drives[selectedDriveIndex].capacityAllocationsList[selectedCapacityIndex].id)} USD*</FiatRateEstimation>
              </React.Fragment>
            )}
          </LabelWrapper>
        </Row>
        <BottomWrapper>
          <GrayText>* estimated SMC may change based on how many nodes join the network with storage commitment.</GrayText>
          <GrayText>- You can always commit more storage at a later time</GrayText>
          <GrayText>- Setup will use the GPU and may take up to 48 hours</GrayText>
          <SmButton
            text="Start Setup"
            theme="orange"
            isDisabled={!(selectedCapacityIndex !== -1 && selectedDriveIndex !== -1)}
            onPress={this.handleStartSetup}
            style={{ width: 170, marginTop: 50 }}
          />
        </BottomWrapper>
      </Wrapper>
    );
  }

  handleStartSetup = () => {
    const { setLocalNodeStorage, drives, switchMode } = this.props;
    const { selectedCapacityIndex, selectedDriveIndex } = this.state;
    setLocalNodeStorage({ capacity: drives[selectedDriveIndex].capacityAllocationsList[selectedCapacityIndex], drive: drives[selectedDriveIndex] });
    switchMode(localNodeModes.PROGRESS);
  };

  handleSelectDrive = ({ index }: { index: number }) => {
    this.setState({ selectedDriveIndex: index, selectedCapacityIndex: -1 });
  };

  handleSelectCapacity = ({ index }: { index: number }) => this.setState({ selectedCapacityIndex: index });
}

const mapStateToProps = (state) => ({
  capacity: state.localNode.capacity,
  drive: state.localNode.drive,
  drives: state.localNode.drives,
  fiatRate: state.wallet.fiatRate
});

const mapDispatchToProps = {
  setLocalNodeStorage,
  getDrivesList
};

LeftPaneSetup = connect(
  mapStateToProps,
  mapDispatchToProps
)(LeftPaneSetup);

export default LeftPaneSetup;
