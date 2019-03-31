import React, { Component } from 'react';
import styled from 'styled-components';
import { smColors, localNodeModes } from '/vars';
import { SmButton, SmDropdown } from '/basicComponents';
import type { Action } from '/types';

const BaseText = styled.span`
  font-size: 16px;
  font-weight: normal;
  line-height: 22px;
`;

const LeftPaneInner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
`;

const BoldText = styled(BaseText)`
  font-weight: bold;
`;

const LeftHeaderWrapper = styled.div`
  margin-bottom: 20px;
`;

const GrayTextWrapper = styled.div`
  min-height: 240px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const GrayText = styled(BaseText)`
  color: ${smColors.gray};
`;

const BorderlessLeftPaneRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-bottom: 40px;
`;

const SideLabelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 2;
  justify-content: center;
  margin-left: 20px;
`;

// Test stub
const getProjectedSmcEarnings = (capacity: number | string) => {
  if (typeof capacity === 'string') {
    return 4;
  } else {
    return +(capacity * 0.00000001).toFixed(2);
  }
};

const getElementIndex = (elementsList: any[], element: any) => (element ? elementsList.findIndex((elem) => elem.id === element.id) : -1);

type Props = {
  toMode: Funtion,
  drives: any[],
  capacity: any,
  capacityAllocationsList: any[],
  drive: any,
  availableDiskSpace: { bytes: number, readable: string },
  setLocalNodeStorage: Action,
  getDrivesList: Action,
  getFiatRate: Action,
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
    const { getFiatRate, getDrivesList, drive, capacity, drives, capacityAllocationsList } = this.props;
    const selectedDriveIndex = getElementIndex(drives, drive);
    const selectedCapacityIndex = getElementIndex(capacityAllocationsList, capacity);
    this.state = {
      selectedCapacityIndex,
      selectedDriveIndex
    };
    getDrivesList();
    getFiatRate();
  }

  render() {
    const { drives, capacityAllocationsList, availableDiskSpace, fiatRate } = this.props;
    const { selectedCapacityIndex, selectedDriveIndex } = this.state;

    return (
      <LeftPaneInner>
        <LeftHeaderWrapper>
          <BoldText>Select Drive</BoldText>
        </LeftHeaderWrapper>
        <BorderlessLeftPaneRow>
          <SmDropdown data={drives} selectedItemIndex={selectedDriveIndex} onPress={this.handleSelectDrive} />
          {selectedDriveIndex !== -1 && (
            <SideLabelWrapper>
              <BaseText>You have {availableDiskSpace && availableDiskSpace.readable} free on your drive</BaseText>
            </SideLabelWrapper>
          )}
        </BorderlessLeftPaneRow>
        <LeftHeaderWrapper>
          <BoldText>Choose how much storage to allocate for the local node</BoldText>
        </LeftHeaderWrapper>
        <BorderlessLeftPaneRow>
          <SmDropdown data={capacityAllocationsList} selectedItemIndex={selectedCapacityIndex} onPress={this.handleSelectCapacity} />
          {selectedCapacityIndex !== -1 && (
            <SideLabelWrapper>
              <BaseText>
                earn ~ {getProjectedSmcEarnings(capacityAllocationsList[selectedCapacityIndex].id)} SMC each week*{' '}
                <GrayText> = {fiatRate * capacityAllocationsList[selectedCapacityIndex].id} USD*</GrayText>
              </BaseText>
            </SideLabelWrapper>
          )}
        </BorderlessLeftPaneRow>
        <GrayTextWrapper>
          <BorderlessLeftPaneRow>
            <GrayText>* estimated SMC may change based on how many nodes join the network with storage commitment.</GrayText>
          </BorderlessLeftPaneRow>
          <BorderlessLeftPaneRow>
            <GrayText>- You can always commit more storage at a later time</GrayText>
          </BorderlessLeftPaneRow>
          <BorderlessLeftPaneRow>
            <GrayText>- Setup will use the GPU and may take up to 48 hours</GrayText>
          </BorderlessLeftPaneRow>
          <BorderlessLeftPaneRow>
            <SmButton text="Start Setup" theme="orange" isDisabled={!(selectedCapacityIndex !== -1 && selectedDriveIndex !== -1)} onPress={this.handleStartSetup} />
          </BorderlessLeftPaneRow>
        </GrayTextWrapper>
      </LeftPaneInner>
    );
  }

  handleStartSetup = () => {
    const { setLocalNodeStorage, drives, capacityAllocationsList, toMode } = this.props;
    const { selectedCapacityIndex, selectedDriveIndex } = this.state;
    setLocalNodeStorage({ capacity: capacityAllocationsList[selectedCapacityIndex], drive: drives[selectedDriveIndex] });
    toMode(localNodeModes.PROGRESS);
  };

  handleSelectDrive = ({ index }: { index: number }) => {
    const { getAvailableSpace, drives } = this.props;
    const drive: any = drives[index];
    getAvailableSpace(drive.mountPoint);
    this.setState({ selectedDriveIndex: index });
  };

  handleSelectCapacity = ({ index }: { index: number }) => this.setState({ selectedCapacityIndex: index });
}

export default LeftPaneSetup;
