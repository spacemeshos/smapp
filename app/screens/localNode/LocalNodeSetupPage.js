// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { setLocalNodeStorage, getDrivesList, getAvailableSpace } from '/redux/localNode/actions';
import { BaseText, BoldText, LeftPaneInner, GrayText, LocalNodeBase, RightPaneSetup } from '/components/localNode';
import { SmButton, SmDropdown } from '/basicComponents';
import type { DropdownEntry } from '/basicComponents';
import type { Action } from '/types';
// import diskStorageService from '/infra/diskStorageService';

type SetupPageProps = {
  history: any,
  // eslint-disable-next-line react/no-unused-prop-types
  drives: any[],
  capacity: any,
  drive: any,
  availableDiskSpace: any,
  setLocalNodeStorage: Action,
  getDrivesList: Action,
  getAvailableSpace: Action
};
type SetupPageState = {
  drivesList: DropdownEntry[],
  allocatedSpaceList: DropdownEntry[],
  selectedDrive: ?DropdownEntry,
  selectedCapacity: ?DropdownEntry
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

const getReadableSpace = (spaceInBytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (spaceInBytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(spaceInBytes) / Math.log(1024)));
  return `${Math.round(spaceInBytes / 1024 ** i)} ${sizes[i]}`;
};

const getBytesfromGb = (Gb: number) => Gb * 1073741824;

const getAllocatedSpaceList = (availableDiskSpace: ?number, increment: number = getBytesfromGb(150)) => {
  const allocatedSpaceList = [];
  if (availableDiskSpace) {
    for (let i = increment; i < availableDiskSpace; i += increment) {
      allocatedSpaceList.push({
        id: i,
        label: getReadableSpace(i)
      });
    }
  }
  return allocatedSpaceList;
};

class LocalNodeSetupPage extends Component<SetupPageProps, SetupPageState> {
  state = {
    selectedCapacity: null,
    selectedDrive: null,
    drivesList: [],
    allocatedSpaceList: []
  };

  render() {
    return <LocalNodeBase header="Local Node Setup" leftPane={this.renderLeftPane()} rightPane={this.renderRightPane()} />;
  }

  componentDidMount() {
    const { getDrivesList, capacity, drive } = this.props;
    const { allocatedSpaceList, drivesList } = this.state;
    const selectedCapacityIndex = getElementIndex(allocatedSpaceList, capacity);
    const selectedDriveIndex = getElementIndex(drivesList, drive);
    this.handleSelectDrive({ index: selectedDriveIndex });
    this.handleSelectCapacity({ index: selectedCapacityIndex });
    getDrivesList();
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
    const { drivesList, allocatedSpaceList, selectedCapacity, selectedDrive } = this.state;
    const { availableDiskSpace } = this.props;
    const selectedCapacityIndex = getElementIndex(allocatedSpaceList, selectedCapacity);
    const selectedDriveIndex = getElementIndex(drivesList, selectedDrive);
    return (
      <LeftPaneInner>
        <LeftHeaderWrapper>
          <BoldText>Select Drive</BoldText>
        </LeftHeaderWrapper>
        <BorderlessLeftPaneRow>
          <SmDropdown data={drivesList} selectedItemIndex={selectedDriveIndex} onPress={this.handleSelectDrive} />
          {selectedDrive && (
            <SideLabelWrapper>
              <BaseText>You have {getReadableSpace(availableDiskSpace)} free on your drive</BaseText>
            </SideLabelWrapper>
          )}
        </BorderlessLeftPaneRow>
        <LeftHeaderWrapper>
          <BoldText>Choose how much storage to allocate for the local node</BoldText>
        </LeftHeaderWrapper>
        <BorderlessLeftPaneRow>
          <SmDropdown data={allocatedSpaceList} selectedItemIndex={selectedCapacityIndex} onPress={this.handleSelectCapacity} />
          {selectedCapacity && (
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
            <SmButton text="Start Setup" theme="orange" disabled={!(selectedCapacity && selectedDrive)} onPress={this.handleStartSetup} />
          </BorderlessLeftPaneRow>
        </GrayTextWrapper>
      </LeftPaneInner>
    );
  };

  static getDerivedStateFromProps(props: SetupPageProps) {
    const { drives, availableDiskSpace } = props;
    if (drives && drives.length) {
      return { drivesList: drives, allocatedSpaceList: getAllocatedSpaceList(availableDiskSpace) };
    }
    return {};
  }

  handleStartSetup = () => {
    const { setLocalNodeStorage, history } = this.props;
    const { selectedCapacity, selectedDrive } = this.state;
    setLocalNodeStorage({ capacity: selectedCapacity, drive: selectedDrive });
    history.push('/main/local-node/local-node-loading');
  };

  handleSelectDrive = ({ index }: { index: number }) => {
    const { getAvailableSpace } = this.props;
    const { drivesList } = this.state;
    const drive: any = drivesList && drivesList[index];
    drive && getAvailableSpace(drive.mountPoint);
    this.setState({ selectedDrive: drive });
  };

  handleSelectCapacity = ({ index }: { index: number }) => {
    const { allocatedSpaceList } = this.state;
    const capacity = allocatedSpaceList && allocatedSpaceList[index];
    this.setState({ selectedCapacity: capacity });
  };

  navigateToExplanation = () => {};

  changeLocalNodeRewardAddress = () => {};

  showComputationEffort = () => {};
}

const mapStateToProps = (state) => ({
  capacity: state.localNode.capacity,
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
