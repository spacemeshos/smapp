// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { setLocalNodeStorage } from '/redux/localNode/actions';
import { BaseText, BoldText, LeftPaneInner, GrayText, LocalNodeBase, RightPaneSetup } from '/components/localNode';
import { SmButton, SmDropdown } from '/basicComponents';
import type { DropdownEntry } from '/basicComponents';
import type { Action } from '/types';

// TODO: Remove test stub
const drivesDDList: DropdownEntry[] = [
  {
    id: 'c',
    label: 'c:\\'
  },
  {
    id: 'd',
    label: 'd:\\'
  },
  {
    id: 'e',
    label: 'e:\\'
  },
  {
    id: 'f',
    label: 'f:\\'
  },
  {
    id: 'g',
    label: 'g:\\'
  }
];

// TODO: Remove test stub
const capacityDDList: DropdownEntry[] = [
  {
    id: 2,
    label: '2.0 GB'
  },
  {
    id: 4,
    label: '4.0 GB'
  },
  {
    id: 100,
    label: '100.0 GB '
  },
  {
    id: 1000,
    label: '1.0 TB'
  },
  {
    id: 2000,
    label: '2.0 TB'
  }
];

// TODO: Remove test stub
const getFreeSpace = (drive: number | string) => (drive && '500 GB') || '';

// TODO: Remove test stub
const getProjectedSmcEarnings = (capacity: number | string) => {
  if (typeof capacity === 'string') {
    return 4;
  } else {
    return +(capacity * 0.2).toFixed(2);
  }
};

// TODO: Remove test stub
const getFiatCurrencyEquivalent = (capacity: number | string) => (getProjectedSmcEarnings(capacity) * 6).toFixed(2);

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

type Props = {
  history: { push: (string) => void },
  setLocalNodeStorage: Action
};

type State = {
  selectedDriveIndex: number,
  selectedCapacityIndex: number
};

class LocalNodeSetupPage extends Component<Props, State> {
  state = {
    selectedDriveIndex: -1,
    selectedCapacityIndex: -1
  };

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
    const { selectedDriveIndex, selectedCapacityIndex } = this.state;
    const drive = selectedDriveIndex !== -1 ? drivesDDList[selectedDriveIndex] : null;
    const capacity = selectedCapacityIndex !== -1 ? capacityDDList[selectedCapacityIndex] : null;
    return (
      <LeftPaneInner>
        <LeftHeaderWrapper>
          <BoldText>Select Drive</BoldText>
        </LeftHeaderWrapper>
        <BorderlessLeftPaneRow>
          <SmDropdown data={drivesDDList} selectedItemIndex={selectedDriveIndex} onPress={({ index }: { index: number }) => this.handleSelectDrive({ index })} />
          <SideLabelWrapper>{drive && <BaseText>You have {getFreeSpace(drive.id)} free on your drive</BaseText>}</SideLabelWrapper>
        </BorderlessLeftPaneRow>
        <LeftHeaderWrapper>
          <BoldText>Choose how much storage to allocate for the local node</BoldText>
        </LeftHeaderWrapper>
        <BorderlessLeftPaneRow>
          <SmDropdown data={capacityDDList} selectedItemIndex={selectedCapacityIndex} onPress={({ index }: { index: number }) => this.handleSelectCapacity({ index })} />
          <SideLabelWrapper>
            {capacity && (
              <BaseText>
                earn ~ {getProjectedSmcEarnings(capacity.id)} SMC each week* <GrayText> = {getFiatCurrencyEquivalent(capacity.id)} USD*</GrayText>
              </BaseText>
            )}
          </SideLabelWrapper>
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
            <SmButton text="Start Setup" theme="orange" isDisabled={!capacity || !drive} onPress={this.handleStartSetup} />
          </BorderlessLeftPaneRow>
        </GrayTextWrapper>
      </LeftPaneInner>
    );
  };

  handleStartSetup = () => {
    const { setLocalNodeStorage, history } = this.props;
    const { selectedDriveIndex, selectedCapacityIndex } = this.state;
    setLocalNodeStorage({ drive: drivesDDList[selectedDriveIndex].label, capacity: capacityDDList[selectedCapacityIndex].label });
    history.push('/main/local-node/local-node-loading');
  };

  handleSelectDrive = ({ index }: { index: number }) => this.setState({ selectedDriveIndex: index });

  handleSelectCapacity = ({ index }: { index: number }) => this.setState({ selectedCapacityIndex: index });

  navigateToExplanation = () => {};

  changeLocalNodeRewardAddress = () => {};

  showComputationEffort = () => {};
}

const mapDispatchToProps = {
  setLocalNodeStorage
};

LocalNodeSetupPage = connect(
  null,
  mapDispatchToProps
)(LocalNodeSetupPage);

export default LocalNodeSetupPage;
