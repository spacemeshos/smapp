import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { setLocalNodeStorage, getDrivesList, getAvailableSpace } from '/redux/localNode/actions';
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

const GrayText = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${smColors.lighterBlack50Alpha};
  margin-bottom: 20px;
`;

// TODO: Test stub
const getProjectedSmcEarnings = (capacity: number | string) => {
  if (typeof capacity === 'string') {
    return 4;
  } else {
    return +(capacity * 0.00000001).toFixed(2);
  }
};

const getElementIndex = (elementsList: any[], element: any) => (element ? elementsList.findIndex((elem) => elem.id === element.id) : -1);

type Props = {
  switchMode: (mode: number) => void,
  drives: any[],
  capacity: any,
  capacityAllocationsList: any[],
  drive: any,
  availableDiskSpace: { bytes: number, readable: string },
  setLocalNodeStorage: Action,
  getDrivesList: Action,
  getAvailableSpace: Action,
  fiatRate: number
};

type State = {
  selectedDriveIndex: number,
  selectedCapacityIndex: number
};

class LeftPaneSetup extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { getDrivesList, drive, capacity, drives, capacityAllocationsList } = this.props;
    const selectedDriveIndex = getElementIndex(drives, drive);
    const selectedCapacityIndex = getElementIndex(capacityAllocationsList, capacity);
    this.state = {
      selectedCapacityIndex,
      selectedDriveIndex
    };
    getDrivesList();
  }

  render() {
    const { drives, capacityAllocationsList, availableDiskSpace, fiatRate } = this.props;
    const { selectedCapacityIndex, selectedDriveIndex } = this.state;

    return (
      <Wrapper>
        <SubHeader>Select Drive</SubHeader>
        <Row>
          <SmDropdown data={drives} selectedItemIndex={selectedDriveIndex} onPress={this.handleSelectDrive} />
          <LabelWrapper>{selectedDriveIndex !== -1 && `You have ${availableDiskSpace && availableDiskSpace.readable} free on your drive`}</LabelWrapper>
        </Row>
        <SubHeader>Choose how much storage to allocate for the local node</SubHeader>
        <Row>
          <SmDropdown data={capacityAllocationsList} selectedItemIndex={selectedCapacityIndex} onPress={this.handleSelectCapacity} />
          <LabelWrapper>
            {selectedCapacityIndex !== -1 && (
              <React.Fragment>
                earn ~ {getProjectedSmcEarnings(capacityAllocationsList[selectedCapacityIndex].id)} SMC each week*{' '}
                <GrayText> = {fiatRate * capacityAllocationsList[selectedCapacityIndex].id} USD*</GrayText>
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
    const { setLocalNodeStorage, drives, capacityAllocationsList, switchMode } = this.props;
    const { selectedCapacityIndex, selectedDriveIndex } = this.state;
    setLocalNodeStorage({ capacity: capacityAllocationsList[selectedCapacityIndex], drive: drives[selectedDriveIndex] });
    switchMode(localNodeModes.PROGRESS);
  };

  handleSelectDrive = ({ index }: { index: number }) => {
    const { getAvailableSpace, drives } = this.props;
    const drive: any = drives[index];
    getAvailableSpace(drive.mountPoint);
    this.setState({ selectedDriveIndex: index });
  };

  handleSelectCapacity = ({ index }: { index: number }) => this.setState({ selectedCapacityIndex: index });
}

const mapStateToProps = (state) => ({
  capacity: state.localNode.capacity,
  capacityAllocationsList: state.localNode.capacityAllocationsList,
  drive: state.localNode.drive,
  drives: state.localNode.drives,
  availableDiskSpace: state.localNode.availableDiskSpace,
  fiatRate: state.wallet.fiatRate
});

const mapDispatchToProps = {
  setLocalNodeStorage,
  getDrivesList,
  getAvailableSpace
};

LeftPaneSetup = connect(
  mapStateToProps,
  mapDispatchToProps
)(LeftPaneSetup);

export default LeftPaneSetup;
