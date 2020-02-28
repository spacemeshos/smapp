// @flow
import { shell } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { initMining } from '/redux/node/actions';
import { CorneredContainer } from '/components/common';
import { ScreenErrorBoundary } from '/components/errorHandler';
import { StepsContainer, Button, SecondaryButton, Link, SmallHorizontalPanel } from '/basicComponents';
import { CommitmentSelector } from '/components/node';
import { chevronLeftWhite } from '/assets/images';
import { fileSystemService } from '/infra/fileSystemService';
import { nodeService } from '/infra/nodeService';
import { smColors } from '/vars';
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

const FolderNameWrapper = styled.div`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  height: 50px;
`;

const FolderName = styled.div`
  font-size: 20px;
  line-height: 25px;
  color: ${smColors.realBlack};
`;

const PermissionError = styled.div`
  font-size: 16px;
  line-height: 20px;
  color: ${smColors.red};
`;

const bntStyle = { position: 'absolute', bottom: 0, left: -35 };

function formatBytes(bytes) {
  if (bytes === 0) return 0;
  return parseFloat((bytes / 1073741824).toFixed(4));
}

type Props = {
  accounts: Account[],
  initMining: Action,
  status: Object,
  history: RouterHistory,
  location: { state?: { isOnlyNodeSetup: boolean, isWalletCreation: boolean } }
};

type State = {
  selectedFolder: string,
  hasPermissionError: boolean,
  freeSpace: number,
  subMode: 2 | 3,
  selectedCommitmentSize: number
};

class NodeSetup extends Component<Props, State> {
  isOnlyNodeSetup: boolean;

  steps: Array<string>;

  header: string;

  commitmentSize: number;

  formattedCommitmentSize: number;

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
      subMode: 2,
      selectedFolder: '',
      freeSpace: 0,
      hasPermissionError: false,
      selectedCommitmentSize: 0
    };
  }

  render() {
    const { status, location } = this.props;
    const { subMode, selectedFolder, hasPermissionError, selectedCommitmentSize } = this.state;
    const adjustedSubStep = this.isOnlyNodeSetup ? subMode % 2 : subMode - 1;
    const isNextBtnDisabled = (subMode === 2 && (!selectedFolder || hasPermissionError)) || (subMode === 3 && selectedCommitmentSize === 0) || !status;
    return (
      <Wrapper>
        <StepsContainer header={this.header} steps={this.steps} currentStep={adjustedSubStep} />
        <CorneredContainer width={650} height={400} header={this.steps[adjustedSubStep]}>
          <SmallHorizontalPanel />
          {location?.state?.isOnlyNodeSetup && <SecondaryButton onClick={this.handleBackBtn} img={chevronLeftWhite} imgWidth={10} imgHeight={15} style={bntStyle} />}
          {this.renderSubMode()}
          <Footer>
            <Link onClick={this.navigateToExplanation} text="LEARN MORE ABOUT SMESHING" />
            <Button onClick={this.nextAction} text="NEXT" isDisabled={isNextBtnDisabled} />
          </Footer>
        </CorneredContainer>
      </Wrapper>
    );
  }

  async componentDidMount() {
    this.commitmentSize = await nodeService.getCommitmentSize();
    this.formattedCommitmentSize = formatBytes(this.commitmentSize);
    this.setState({ selectedFolder: '', hasPermissionError: false, selectedCommitmentSize: 0 });
  }

  renderSubMode = () => {
    const { subMode, selectedFolder, hasPermissionError, freeSpace } = this.state;
    if (subMode === 2) {
      return (
        <>
          <SubHeader>
            --
            <br />
            Select folder you&#39;d like to use for smeshing.
            <br />
            {`You need to commit ${this.formattedCommitmentSize}GB of free space.`}
          </SubHeader>
          <FolderNameWrapper>
            <FolderName>{selectedFolder}</FolderName>
            {hasPermissionError && <PermissionError>Invalid folder, please select another</PermissionError>}
          </FolderNameWrapper>
          <Button onClick={this.openFolderSelectionDialog} text="Select folder" width={200} />
        </>
      );
    }
    return (
      <>
        <SubHeader>
          --
          <br />
          Set how much space on <DriveName>{selectedFolder}</DriveName> you would
          <br />
          like to commit for smeshing
        </SubHeader>
        <CommitmentSelector
          commitmentSize={this.formattedCommitmentSize}
          freeSpace={freeSpace}
          onClick={({ commitment }) => this.setState({ selectedCommitmentSize: commitment })}
        />
      </>
    );
  };

  setupAndInitMining = async () => {
    const { initMining, accounts, history } = this.props;
    // const { selectedFolder, selectedDriveIndex } = this.state;
    const { selectedFolder } = this.state;
    try {
      await initMining({
        logicalDrive: selectedFolder,
        commitmentSize: this.commitmentSize,
        address: accounts[0].publicKey
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

  openFolderSelectionDialog = async () => {
    try {
      const { selectedFolder, freeSpace } = await fileSystemService.selectPostFolder();
      this.setState({ selectedFolder, freeSpace: formatBytes(freeSpace), hasPermissionError: false });
    } catch (err) {
      if (err.error !== 'no folder selected') {
        this.setState({ hasPermissionError: true });
      }
    }
  };

  navigateToExplanation = () => shell.openExternal('https://testnet.spacemesh.io/#/guide/setup');

  navigateToNodeSetupGuide = () => shell.openExternal('https://testnet.spacemesh.io/#/guide/setup?id=step-2-full-node-amp-mining-setup');
}

const mapStateToProps = (state) => ({
  status: state.node.status,
  accounts: state.wallet.accounts
});

const mapDispatchToProps = {
  initMining
};

NodeSetup = connect<any, any, _, _, _, _>(mapStateToProps, mapDispatchToProps)(NodeSetup);

NodeSetup = ScreenErrorBoundary(NodeSetup);
export default NodeSetup;
