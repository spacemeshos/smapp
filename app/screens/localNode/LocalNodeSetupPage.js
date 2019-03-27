// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { setLocalNodeStorage, getDrivesList, getAvailableSpace } from '/redux/localNode/actions';
import { BaseText, BoldText, LeftPaneInner, GrayText, LocalNodeBase, RightPaneSetup } from '/components/localNode';
import { SmButton, SmDropdown } from '/basicComponents';
import type { Action } from '/types';

type SetupPageProps = {
  history: any,
  drives: any[],
  capacity: any,
  capacityAllocationsList: any[],
  drive: any,
  availableDiskSpace: { bytes: number, readable: string },
  setLocalNodeStorage: Action,
  getDrivesList: Action,
  getAvailableSpace: Action
};

type SetupPageState = {
  selectedDriveIndex: number,
  selectedCapacityIndex: number
};

// Test stub
const getProjectedSmcEarnings = (capacity: number | string) => {
  if (typeof capacity === 'string') {
    return 4;
  } else {
    return +(capacity * 0.00000001).toFixed(2);
  }
};

// Test stub
const getFiatCurrencyEquivalent = (capacity: number | string) => {
  const SMC_TO_USD_RATIO = 0.2;
  return (getProjectedSmcEarnings(capacity) * SMC_TO_USD_RATIO).toFixed(2);
};

const getElementIndex = (elementsList: any[], element: any) => (element ? elementsList.findIndex((elem) => elem.id === element.id) : -1);

const LeftHeaderWrapper = styled.div`
  margin-bottom: 20px;
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

const GrayTextWrapper = styled.div`
  min-height: 240px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

class LocalNodeSetupPage extends Component<SetupPageProps, SetupPageState> {
  constructor(props: SetupPageProps) {
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
    return <LocalNodeBase header="Local Node Setup" leftPane={this.renderLeftPane()} rightPane={this.renderRightPane()} />;
  }

  renderRightPane = () => {
    const links = [
      {
        text: 'Learn more about Spacemesh Local Node',
        onClick: this.navigateToExplanation
      },
      {
        text: 'Change your awards Local Node address',
        onCLick: this.changeLocalNodeRewardAddress
      },
      {
        text: 'Show computer effort',
        onClick: this.showComputationEffort
      }
    ];
    return <RightPaneSetup links={links} />;
  };

  renderLeftPane = () => {
    const { drives, capacityAllocationsList, availableDiskSpace } = this.props;
    const { selectedCapacityIndex, selectedDriveIndex } = this.state;
    const selectedDrive = drives && drives[selectedDriveIndex];
    const selectedCapacity = capacityAllocationsList && capacityAllocationsList[selectedCapacityIndex];

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
                earn ~ {getProjectedSmcEarnings(selectedCapacity.id)} SMC each week* <GrayText> = {getFiatCurrencyEquivalent(selectedCapacity.id)} USD*</GrayText>
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
            <SmButton text="Start Setup" theme="orange" isDisabled={!(selectedCapacity && selectedDrive)} onPress={this.handleStartSetup} />
          </BorderlessLeftPaneRow>
        </GrayTextWrapper>
      </LeftPaneInner>
    );
  };

  handleStartSetup = () => {
    const { setLocalNodeStorage, history, drives, capacityAllocationsList } = this.props;
    const { selectedCapacityIndex, selectedDriveIndex } = this.state;
    setLocalNodeStorage({ capacity: capacityAllocationsList[selectedCapacityIndex], drive: drives[selectedDriveIndex] });
    history.push('/main/local-node/local-node-loading');
  };

  handleSelectDrive = ({ index }: { index: number }) => {
    const { getAvailableSpace, drives } = this.props;
    const drive: any = drives[index];
    getAvailableSpace(drive.mountPoint);
    this.setState({ selectedDriveIndex: index });
  };

  handleSelectCapacity = ({ index }: { index: number }) => this.setState({ selectedCapacityIndex: index });

  navigateToExplanation = () => {};

  changeLocalNodeRewardAddress = () => {};

  showComputationEffort = () => {};
}

const mapStateToProps = (state) => ({
  capacity: state.localNode.capacity,
  capacityAllocationsList: state.localNode.capacityAllocationsList,
  drive: state.localNode.drive,
  drives: state.localNode.drives,
  availableDiskSpace: state.localNode.availableDiskSpace
});

const mapDispatchToProps = {
  setLocalNodeStorage,
  getDrivesList,
  getAvailableSpace
};

LocalNodeSetupPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(LocalNodeSetupPage);

export default LocalNodeSetupPage;
