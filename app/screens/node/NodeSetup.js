// @flow
import { shell } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { initMining } from '/redux/node/actions';
import { CorneredContainer } from '/components/common';
import { ScreenErrorBoundary } from '/components/errorHandler';
import { StepsContainer, Button, SecondaryButton, Link } from '/basicComponents';
import { Carousel, CommitmentSelector } from '/components/node';
import { diskStorageService } from '/infra/diskStorageService';
import { smallHorizontalSideBar, chevronLeftWhite } from '/assets/images';
import { smColors } from '/vars';
import type { Action } from '/types';
import type { RouterHistory } from 'react-router-dom';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const SideBar = styled.img`
  position: absolute;
  top: -30px;
  right: 0;
  width: 55px;
  height: 15px;
`;

const BottomPart = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

const DriveName = styled.span`
  color: ${smColors.darkerGreen};
`;

type Props = {
  initMining: Action,
  history: RouterHistory,
  location: { state?: { isOnlyNodeSetup: boolean } }
};

type State = {
  drives: { id: string, label: string, availableDiskSpace: { bytes: number, readable: string }, capacityAllocationsList: { id: number, label: string }[] }[],
  subMode: 2 | 3,
  selectedDriveIndex: number,
  selectedCapacityIndex: number
};

class NodeSetup extends Component<Props, State> {
  isOnlyNodeSetup: boolean;

  steps: Array<string>;

  constructor(props: Props) {
    super(props);
    const { location } = props;
    this.isOnlyNodeSetup = location?.state?.isOnlyNodeSetup;
    this.steps = ['SELECT DRIVE', 'ALLOCATE SPACE'];
    if (!this.isOnlyNodeSetup) {
      this.steps = ['SETUP WALLET + MINER', 'PROTECT WALLET'].concat(this.steps);
    }
    this.state = {
      drives: [],
      subMode: 2,
      selectedDriveIndex: -1,
      selectedCapacityIndex: -1
    };
  }

  render() {
    const { drives, subMode, selectedDriveIndex, selectedCapacityIndex } = this.state;
    return (
      <Wrapper>
        <StepsContainer steps={this.steps} currentStep={this.isOnlyNodeSetup ? subMode % 2 : subMode} />
        <CorneredContainer width={650} height={400} header={this.steps[subMode]} subHeader={this.renderSubHeader(subMode)}>
          <SideBar src={smallHorizontalSideBar} />
          <SecondaryButton onClick={this.handleBackBtn} img={chevronLeftWhite} imgWidth={10} imgHeight={15} style={{ position: 'absolute', bottom: 0, left: -35 }} />
          {subMode === 2 && drives.length && (
            <Carousel data={drives} selectedItemIndex={selectedDriveIndex} onClick={({ index }) => this.setState({ selectedDriveIndex: index })} />
          )}
          {subMode === 3 && (
            <CommitmentSelector
              freeSpace={drives[selectedDriveIndex].availableDiskSpace.readable.split(' ')[0]}
              onClick={({ index }) => this.setState({ selectedCapacityIndex: index })}
              selectedItemIndex={selectedCapacityIndex}
            />
          )}
          <BottomPart>
            <Link onClick={this.navigateToExplanation} text="SETUP GUIDE" />
            <Button onClick={this.nextAction} text="NEXT" isDisabled={(subMode === 2 && selectedDriveIndex === -1) || (subMode === 3 && selectedCapacityIndex === -1)} />
          </BottomPart>
        </CorneredContainer>
      </Wrapper>
    );
  }

  componentDidMount() {
    this.getDrivesList();
  }

  renderSubHeader = (subMode: number) => {
    const { drives, selectedDriveIndex } = this.state;
    return subMode === 2 ? (
      <span>
        select the hard drive you&#39;d like to use for mining
        <br />
        You will need at least 160 GB free space to setup miner
      </span>
    ) : (
      <div>
        Allocate how much space on <DriveName>{drives[selectedDriveIndex].label} HARD DRIVE</DriveName> you would
        <br />
        like the mining node to use
      </div>
    );
  };

  getDrivesList = async () => {
    const drives = await diskStorageService.getDriveList();
    this.setState({ drives });
  };

  setupAndInitMining = async () => {
    const { initMining, history } = this.props;
    const { drives, selectedCapacityIndex, selectedDriveIndex } = this.state;
    try {
      await initMining({ capacity: drives[selectedDriveIndex].capacityAllocationsList[selectedCapacityIndex], drive: drives[selectedDriveIndex] });
      history.push('/main/node', { showIntro: true });
    } catch (error) {
      this.setState(() => {
        throw error;
      });
    }
  };

  handleBackBtn = () => {
    const { history } = this.props;
    const { subMode } = this.state;
    if (subMode === 2) {
      history.goBack();
    } else {
      this.setState({ subMode: 2 });
    }
  };

  nextAction = () => {
    const { subMode } = this.state;
    if (subMode === 2) {
      this.setState({ subMode: 3 });
    } else if (subMode === 3) {
      this.setupAndInitMining();
    }
  };

  navigateToExplanation = () => shell.openExternal('https://testnet.spacemesh.io/#/guide/setup');
}

const mapDispatchToProps = {
  initMining
};

NodeSetup = connect<any, any, _, _, _, _>(
  null,
  mapDispatchToProps
)(NodeSetup);

NodeSetup = ScreenErrorBoundary(NodeSetup, true);
export default NodeSetup;
