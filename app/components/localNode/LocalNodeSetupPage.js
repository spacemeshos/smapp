// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setLocalNodeStorage } from '/redux/localNode/actions';
import styled from 'styled-components';
import {
  RightHeaderText,
  BaseText,
  BoldText,
  BaseImage,
  RightPaneInner,
  LeftPaneInner,
  ActionLink,
  GrayText,
  ItemTextWrapper,
  LinkTextWrapper,
  ItemText
} from './LocalNodeJointStyles';
import { time, coin, noLaptop } from '/assets/images';
import { SmButton, SmDropdown } from '/basicComponents';
import type { DropdownEntry } from '/basicComponents';
import LocalNodeBase from './LocalNodeBase';

type SeupPageProps = {
  history: any,
  setLocalNodeStorage: Function
};
type SetupPageState = {
  drive: ?DropdownEntry,
  capacity: ?DropdownEntry
};

const selectDriveDropdownList: DropdownEntry[] = [
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

const capacityDropdownList: DropdownEntry[] = [
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
const getFreeSpace = (drive: number | string) => {
  return (drive && '500 GB') || '';
};

// Test stub
const getProjectedSmcEarnings = (capacity: number | string) => {
  if (typeof capacity === 'string') {
    return 4;
  } else {
    return +(capacity * 0.2).toFixed(2);
  }
};

// Test stub
const getFiatCurrencyEquivalent = (capacity: number | string) => {
  return (getProjectedSmcEarnings(capacity) * 6).toFixed(2);
};

const SettingModeListItem = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex: 1;
  min-width: 260px;
`;

const ItemImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: 12px;
`;

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

class LocalNodeSetupPage extends Component<SeupPageProps, SetupPageState> {
  state = {
    capacity: null,
    drive: null
  };

  render() {
    return <LocalNodeBase header="Local Node Setup" leftPane={this.renderLeftPane} rightPane={this.renderRightPane} />;
  }

  renderRightPane = () => (
    <RightPaneInner>
      <RightHeaderText>Local Node Setup Instructions</RightHeaderText>
      {rightPaneSetupModeList.map((setupListItem) => (
        <SettingModeListItem key={setupListItem.id}>
          <ItemImageWrapper>
            <BaseImage src={setupListItem.iconSrc} width={42} height={42} />
          </ItemImageWrapper>
          <ItemTextWrapper>
            <ItemText>{setupListItem.text}</ItemText>
          </ItemTextWrapper>
        </SettingModeListItem>
      ))}
      {rightPaneSetupModeLinks.map((setupLink) => (
        <LinkTextWrapper key={setupLink.id} onClick={() => this.handleLinkClick(setupLink.id)}>
          <ActionLink>{setupLink.text}</ActionLink>
        </LinkTextWrapper>
      ))}
    </RightPaneInner>
  );

  renderLeftPane = () => {
    const { drive, capacity } = this.state;
    return (
      <LeftPaneInner>
        <LeftHeaderWrapper>
          <BoldText>Select Drive</BoldText>
        </LeftHeaderWrapper>
        <BorderlessLeftPaneRow>
          <SmDropdown data={selectDriveDropdownList} selectedId={drive && drive.id} onPress={(selection: DropdownEntry) => this.handleSelectDrive(selection)} />
          {drive && (
            <SideLabelWrapper>
              <BaseText>You have {getFreeSpace(drive.id)} free on your drive</BaseText>
            </SideLabelWrapper>
          )}
        </BorderlessLeftPaneRow>
        <LeftHeaderWrapper>
          <BoldText>Choose how much storage to allocate for the local node</BoldText>
        </LeftHeaderWrapper>
        <BorderlessLeftPaneRow>
          <SmDropdown data={capacityDropdownList} selectedId={capacity && capacity.id} onPress={(selection: DropdownEntry) => this.handleSelectCapacity(selection)} />
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
            <SmButton text="Start Setup" theme="orange" disabled={!(capacity && drive)} onPress={this.handleStartSetup} />
          </BorderlessLeftPaneRow>
        </GrayTextWrapper>
      </LeftPaneInner>
    );
  };

  handleStartSetup = () => {
    const { setLocalNodeStorage, history } = this.props;
    const { capacity, drive } = this.state;
    setLocalNodeStorage({ capacity, drive });
    history.push('/root/local-node/local-node-loading');
  };

  handleSelectDrive = (selection: DropdownEntry) => {
    this.setState({ drive: selection });
  };

  handleSelectCapacity = (selection: DropdownEntry) => {
    this.setState({ capacity: selection });
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

const mapDispatchToProps = {
  setLocalNodeStorage
};

LocalNodeSetupPage = connect(
  null,
  mapDispatchToProps
)(LocalNodeSetupPage);

export default LocalNodeSetupPage;
