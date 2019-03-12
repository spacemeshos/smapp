// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setFullNodeStorage } from '/redux/fullNode/actions';
import styled from 'styled-components';
import {
  PageWrapper,
  LeftPane,
  RightPane,
  RightHeaderText,
  BaseText,
  BoldText,
  BaseImage,
  RightPaneInner,
  LeftPaneInner,
  ActionLink,
  RightHeaderWrapper,
  LeftHeaderWrapper,
  BorderlessLeftPaneRow,
  SideLabelWrapper,
  GrayTextWrapper,
  GrayText,
  ItemTextWrapper,
  LinkTextWrapper,
  ItemText,
  FullNodeHeaderText
} from './FullNodeJointStyles';
import { time, coin, noLaptop } from '/assets/images';
import { SmButton, SmDropdown } from '/basicComponents';
import type { DropdownEntry } from '/basicComponents';

type SeupPageProps = {
  history: any,
  setFullNodeStorage: Function
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
    text: 'Learn more about Spacemesh Full Node'
  },
  {
    id: 'changeFullNodeAddress',
    text: 'Change your awards full node address'
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
`;

class FullNodeSetupPage extends Component<SeupPageProps, SetupPageState> {
  state = {
    capacity: null,
    drive: null
  };

  render() {
    return [
      <div>
        <FullNodeHeaderText>Full Node Setup</FullNodeHeaderText>
      </div>,
      <PageWrapper>
        <LeftPane>{this.renderLeftPane()}</LeftPane>
        <RightPane>{this.renderRightPane()}</RightPane>
      </PageWrapper>
    ];
  }

  renderRightPane = () => (
    <RightPaneInner>
      <RightHeaderWrapper>
        <RightHeaderText>Full Node Setup Instructions</RightHeaderText>
      </RightHeaderWrapper>
      {rightPaneSetupModeList.map((setupListItem) => (
        <SettingModeListItem key={setupListItem.id}>
          <BaseImage src={setupListItem.iconSrc} />
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
              {' '}
              <BaseText>You have {getFreeSpace(drive.id)} free on your drive</BaseText>
            </SideLabelWrapper>
          )}
        </BorderlessLeftPaneRow>
        <LeftHeaderWrapper>
          <BoldText>Choose how much storage to allocate for the full node</BoldText>
        </LeftHeaderWrapper>
        <BorderlessLeftPaneRow>
          <SmDropdown data={capacityDropdownList} selectedId={capacity && capacity.id} onPress={(selection: DropdownEntry) => this.handleSelectCapacity(selection)} />
          {capacity && (
            <SideLabelWrapper>
              <BaseText>earn ~ {getProjectedSmcEarnings(capacity.id)} SMC each week*</BaseText>
              <GrayText> = {getFiatCurrencyEquivalent(capacity.id)} USD*</GrayText>
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
    const { setFullNodeStorage, history } = this.props;
    const { capacity, drive } = this.state;
    setFullNodeStorage({ capacity, drive });
    history.push('/root/full-node/full-node-loading');
  };

  handleSelectDrive = (selection: DropdownEntry) => {
    this.setState({ drive: selection });
  };

  handleSelectCapacity = (selection: DropdownEntry) => {
    this.setState({ capacity: selection });
  };

  handleLinkClick = (linkId: 'learnMore' | 'changeFullNodeAddress' | 'showComputerEffort') => {
    switch (linkId) {
      case 'learnMore':
        break;
      case 'changeFullNodeAddress':
        break;
      case 'showComputerEffort':
        break;
      default:
        break;
    }
  };
}

const mapDispatchToProps = {
  setFullNodeStorage
};

FullNodeSetupPage = connect(
  null,
  mapDispatchToProps
)(FullNodeSetupPage);

export default FullNodeSetupPage;
