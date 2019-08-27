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
import { smColors, nodeConsts } from '/vars';
import type { RouterHistory } from 'react-router-dom';
import type { Account, Action } from '/types';

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

const SubHeader = styled.div`
  margin-bottom: 20px;
  font-size: 16px;
  line-height: 20px;
  color: ${smColors.black};
`;

const Footer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

const DriveName = styled.span`
  color: ${smColors.darkerGreen};
`;

const bntStyle = { position: 'absolute', bottom: 0, left: -35 };

type Props = {
  accounts: Account[],
  initMining: Action,
  history: RouterHistory,
  location: { state?: { isOnlyNodeSetup: boolean } }
};

type State = {
  drives: { id: string, label: string, mountPoint: string, availableDiskSpace: string }[],
  subMode: 2 | 3,
  selectedDriveIndex: number,
  selectedCommitmentIndex: number
};

class NodeSetup extends Component<Props, State> {
  isOnlyNodeSetup: boolean;

  steps: Array<string>;

  constructor(props: Props) {
    super(props);
    const { location } = props;
    this.isOnlyNodeSetup = !!location?.state?.isOnlyNodeSetup;
    this.steps = ['SELECT DRIVE', 'ALLOCATE SPACE'];
    if (!this.isOnlyNodeSetup) {
      this.steps = ['SETUP WALLET + MINER', 'PROTECT WALLET'].concat(this.steps);
    }
    this.state = {
      drives: [],
      subMode: 2,
      selectedDriveIndex: -1,
      selectedCommitmentIndex: -1
    };
  }

  render() {
    const { subMode, selectedDriveIndex, selectedCommitmentIndex } = this.state;
    const adjustedSubStep = this.isOnlyNodeSetup ? subMode % 2 : subMode;
    return (
      <Wrapper>
        <StepsContainer steps={this.steps} currentStep={adjustedSubStep} />
        <CorneredContainer width={650} height={400} header={this.steps[adjustedSubStep]}>
          <SideBar src={smallHorizontalSideBar} />
          <SecondaryButton onClick={this.handleBackBtn} img={chevronLeftWhite} imgWidth={10} imgHeight={15} style={bntStyle} />
          {this.renderSubMode()}
          <Footer>
            <Link onClick={this.navigateToExplanation} text="SETUP GUIDE" />
            <Button onClick={this.nextAction} text="NEXT" isDisabled={(subMode === 2 && selectedDriveIndex === -1) || (subMode === 3 && selectedCommitmentIndex === -1)} />
          </Footer>
        </CorneredContainer>
      </Wrapper>
    );
  }

  async componentDidMount() {
    const drives = await diskStorageService.getDriveList();
    this.setState({ drives });
  }

  renderSubMode = () => {
    const { subMode, drives, selectedDriveIndex } = this.state;
    if (subMode === 2) {
      return (
        <React.Fragment>
          <SubHeader>
            --
            <br />
            select the hard drive you&#39;d like to use for mining
            <br />
            You will need at least 160 GB free space to setup miner
          </SubHeader>
          {drives.length ? <Carousel data={drives} onClick={({ index }) => this.setState({ selectedDriveIndex: index })} /> : null}
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <SubHeader>
          --
          <br />
          Allocate how much space on <DriveName>{drives[selectedDriveIndex].label} HARD DRIVE</DriveName> you would
          <br />
          like the mining node to use
        </SubHeader>
        <CommitmentSelector freeSpace={drives[selectedDriveIndex].availableDiskSpace} onClick={({ index }) => this.setState({ selectedCommitmentIndex: index })} />
      </React.Fragment>
    );
  };

  setupAndInitMining = async () => {
    const { initMining, accounts, history } = this.props;
    const { drives, selectedCommitmentIndex, selectedDriveIndex } = this.state;
    try {
      await initMining({
        logicalDrive: drives[selectedDriveIndex].mountPoint,
        commitmentSize: nodeConsts.COMMITMENT_SIZE * selectedCommitmentIndex * 1000000000,
        address: accounts[0].pk
      });
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

const mapStateToProps = (state) => ({
  accounts: state.wallet.accounts
});

const mapDispatchToProps = {
  initMining
};

NodeSetup = connect<any, any, _, _, _, _>(
  mapStateToProps,
  mapDispatchToProps
)(NodeSetup);

NodeSetup = ScreenErrorBoundary(NodeSetup, true);
export default NodeSetup;
