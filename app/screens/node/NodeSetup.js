// @flow
import { shell } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { initMining } from '/redux/node/actions';
import { CorneredContainer } from '/components/common';
import { ScreenErrorBoundary } from '/components/errorHandler';
import { StepsContainer, Button, SecondaryButton, Link, SmallHorizontalPanel } from '/basicComponents';
import { Carousel, CommitmentSelector } from '/components/node';
import { diskStorageService } from '/infra/diskStorageService';
import { chevronLeftWhite } from '/assets/images';
import { smColors, nodeConsts } from '/vars';
import type { RouterHistory } from 'react-router-dom';
import type { Account, Action } from '/types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
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

const EmptyState = styled.div`
  display: flex;
  flex-direction: row;
`;

const Text = styled.div`
  font-size: 14px;
  line-height: 18px;
  color: ${smColors.black};
`;

const bntStyle = { position: 'absolute', bottom: 0, left: -35 };

type Props = {
  accounts: Account[],
  initMining: Action,
  isConnected: boolean,
  history: RouterHistory,
  location: { state?: { isOnlyNodeSetup: boolean } }
};

type State = {
  drives: { id: string, label: string, mountPoint: string, availableDiskSpace: string }[],
  subMode: 2 | 3,
  selectedDriveIndex: number,
  selectedCommitmentSize: number
};

class NodeSetup extends Component<Props, State> {
  isOnlyNodeSetup: boolean;

  steps: Array<string>;

  header: string;

  constructor(props: Props) {
    super(props);
    const { location } = props;
    this.isOnlyNodeSetup = !!location?.state?.isOnlyNodeSetup;
    this.header = this.isOnlyNodeSetup ? 'SETUP SMESHER' : 'SETUP WALLET + SMESHER';
    this.steps = ['SELECT DRIVE', 'COMMIT SPACE'];
    if (!this.isOnlyNodeSetup) {
      this.steps = ['PROTECT WALLET'].concat(this.steps);
    }
    this.state = {
      drives: [],
      subMode: 2,
      selectedDriveIndex: -1,
      selectedCommitmentSize: 0
    };
  }

  render() {
    const { isConnected } = this.props;
    const { subMode, selectedDriveIndex, selectedCommitmentSize } = this.state;
    const adjustedSubStep = this.isOnlyNodeSetup ? subMode % 2 : subMode - 1;
    return (
      <Wrapper>
        <StepsContainer header={this.header} steps={this.steps} currentStep={adjustedSubStep} />
        <CorneredContainer width={650} height={400} header={this.steps[adjustedSubStep]}>
          <SmallHorizontalPanel />
          <SecondaryButton onClick={this.handleBackBtn} img={chevronLeftWhite} imgWidth={10} imgHeight={15} style={bntStyle} />
          {this.renderSubMode()}
          <Footer>
            <Link onClick={this.navigateToExplanation} text="LEARN MORE ABOUT SMESHING" />
            <Button
              onClick={this.nextAction}
              text="NEXT"
              isDisabled={(subMode === 2 && selectedDriveIndex === -1) || ((subMode === 3 && selectedCommitmentSize === 0) || !isConnected)}
            />
          </Footer>
        </CorneredContainer>
      </Wrapper>
    );
  }

  async componentDidMount() {
    const drives = await diskStorageService.getDriveList();
    const selectedDriveIndex = drives.length ? 0 : -1;
    const selectedCommitmentSize = drives.length ? nodeConsts.COMMITMENT_SIZE : 0;
    this.setState({ drives, selectedDriveIndex, selectedCommitmentSize });
  }

  renderSubMode = () => {
    const { subMode, drives, selectedDriveIndex } = this.state;
    if (subMode === 2) {
      return (
        <>
          <SubHeader>
            --
            <br />
            Select the hard drive you&#39;d like to use for smeshing
            <br />
            {`You will need at least ${nodeConsts.COMMITMENT_SIZE} GB free space to setup smeshing`}
          </SubHeader>
          {drives.length ? (
            <Carousel data={drives} onClick={({ index }) => this.setState({ selectedDriveIndex: index })} />
          ) : (
            <EmptyState>
              <Text>Insufficient disk space. You need a local hard drive with at least 256GB of free space to setup smeshing.</Text>
              <Link onClick={this.navigateToNodeSetupGuide} text="Learn more..." />
            </EmptyState>
          )}
        </>
      );
    }
    return (
      <>
        <SubHeader>
          --
          <br />
          Set how much space on <DriveName>{drives[selectedDriveIndex].label}</DriveName> you would
          <br />
          like to commit for smeshing
        </SubHeader>
        <CommitmentSelector freeSpace={drives[selectedDriveIndex].availableDiskSpace} onClick={({ index }) => this.setState({ selectedCommitmentSize: index })} />
      </>
    );
  };

  setupAndInitMining = async () => {
    const { initMining, accounts, history } = this.props;
    const { drives, selectedCommitmentSize, selectedDriveIndex } = this.state;
    try {
      await initMining({
        logicalDrive: drives[selectedDriveIndex].mountPoint,
        commitmentSize: selectedCommitmentSize * 1073741824,
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

  navigateToNodeSetupGuide = () => shell.openExternal('https://testnet.spacemesh.io/#/guide/setup?id=step-2-full-node-amp-mining-setup');
}

const mapStateToProps = (state) => ({
  isConnected: state.node.isConnected,
  accounts: state.wallet.accounts
});

const mapDispatchToProps = {
  initMining
};

NodeSetup = connect<any, any, _, _, _, _>(
  mapStateToProps,
  mapDispatchToProps
)(NodeSetup);

NodeSetup = ScreenErrorBoundary(NodeSetup);
export default NodeSetup;
