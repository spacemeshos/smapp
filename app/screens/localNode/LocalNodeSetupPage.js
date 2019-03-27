// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setLocalNodeStorage, getDrivesList, getAvailableSpace } from '/redux/localNode/actions';
import styled from 'styled-components';
import { BaseText, BoldText, LeftPaneInner, GrayText, LocalNodeBase, RightPaneSetup } from '/components/localNode';
import { time, coin, noLaptop } from '/assets/images';
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
  // eslint-disable-next-line react/no-unused-prop-types
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

const rightPaneSetupModeList = [
  {
    id: 1,
    iconSrc: coin,
    text: 'Join the Spacemesh p2p network and get awarded'
  },
  {
    id: 2,
    iconSrc: time,
    text: 'Leave your desktop computer on 24/7'
  },
  {
    id: 3,
    iconSrc: noLaptop,
    text: 'Do not use a laptop. Only desktop'
  },
  {
    id: 4,
    iconSrc: time,
    text: 'On the Spacemesh network, storage replaces "Proof of Work"'
  }
];

const rightPaneSetupModeLinks = [
  {
    id: 'learnMore',
    text: 'Learn more about Spacemesh Local Node'
  },
  {
    id: 'changeLocalNodeAddress',
    text: 'Change your awards Local Node address'
  },
  {
    id: 'showComputerEffort',
    text: 'Show computer effort'
  }
];

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

const LeftHeaderWrapper = styled.div`
  padding: 12px 0;
  margin-top: 12px;
`;

const BorderlessLeftPaneRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding: 12px 0;
`;

const SideLabelWrapper = styled.div`
  height: 44px;
  padding-left: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
    return <LocalNodeBase header="Local Node Setup" leftPane={this.renderLeftPane} rightPane={this.renderRightPane} />;
  }

  renderRightPane = () => <RightPaneSetup itemsList={rightPaneSetupModeList} linksList={rightPaneSetupModeLinks} handleLinkClick={this.handleLinkClick} />;

  renderLeftPane = () => {
    const { drivesList, allocatedSpaceList, selectedCapacity, selectedDrive } = this.state;
    const { drive, capacity } = this.props;
    const { availableDiskSpace } = this.props;
    return (
      <LeftPaneInner>
        <LeftHeaderWrapper>
          <BoldText>Select Drive</BoldText>
        </LeftHeaderWrapper>
        <BorderlessLeftPaneRow>
          <SmDropdown data={drivesList} selectedId={drive && drive.id} onPress={(selection: DropdownEntry) => this.handleSelectDrive(selection)} />
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
          <SmDropdown data={allocatedSpaceList} selectedId={capacity && capacity.id} onPress={(selection: DropdownEntry) => this.handleSelectCapacity(selection)} />
          {capacity && (
            <SideLabelWrapper>
              <BaseText>
                earn ~ {getProjectedSmcEarnings(capacity.id)} SMC each week* <GrayText> = {getFiatCurrencyEquivalent(capacity.id)} USD*</GrayText>
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

  componentDidMount() {
    const { getDrivesList, capacity, drive } = this.props;
    this.handleSelectDrive(drive);
    this.handleSelectCapacity(capacity);
    getDrivesList();
  }

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

  handleSelectDrive = (selection: DropdownEntry) => {
    const { getAvailableSpace } = this.props;
    const { drivesList } = this.state;
    const drive: any = selection && drivesList && drivesList.find((drive) => drive.id === selection.id);
    drive && getAvailableSpace(drive.mountPoint);
    this.setState({ selectedDrive: selection });
  };

  handleSelectCapacity = (selection: DropdownEntry) => {
    this.setState({ selectedCapacity: selection });
  };

  handleLinkClick = (linkId: 'learnMore' | 'changeLocalNodeAddress' | 'showComputerEffort') => {
    switch (linkId) {
      case 'learnMore':
        break;
      case 'changeLocalNodeAddress':
        break;
      case 'showComputerEffort':
        break;
      default:
        break;
    }
  };
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
