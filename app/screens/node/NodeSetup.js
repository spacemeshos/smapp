// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { initMining } from '/redux/node/actions';
import { CorneredContainer, BackButton } from '/components/common';
import { ScreenErrorBoundary } from '/components/errorHandler';
import { StepsContainer, SmallHorizontalPanel } from '/basicComponents';
import { PoSModifyPostData, PoSDirectory, PoSSize, PoSProcessor, PoSSummary } from '/components/node';
import { posIcon } from '/assets/images';
import { formatBytes } from '/infra/utils';
import type { RouterHistory } from 'react-router-dom';
import type { Account, Action } from '/types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const headers = ['PROOF OF SPACE DATA', 'PROOF OF SPACE DIRECTORY', 'PROOF OF SPACE SIZE', 'PROOF OF SPACE PROCESSOR', 'PROOF OF SPACE SETUP'];
const subHeaders = [
  '',
  '',
  'Select how much free space to commit to Spacemesh.\nThe more space you commit, the higher your smeshing rewards will be.',
  'Select a supported graphic processor to use for creating your proof of space',
  'Review your proof of space data creation options.\nClick a link to go back and edit that item.'
];

type Props = {
  accounts: Account[],
  initMining: Action,
  status: Object,
  posDataPath: string,
  commitmentSize: string,
  history: RouterHistory,
  location: { state?: { modifyPostData: boolean } },
  isDarkModeOn: boolean
};

type State = {
  mode: number,
  folder: string,
  freeSpace: number,
  commitment: number,
  processor: Object,
  isPausedOnUsage: boolean
};

class NodeSetup extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { location } = props;
    this.state = {
      mode: location?.state?.modifyPostData ? 0 : 1,
      folder: props.posDataPath || '',
      isPausedOnUsage: false
    };
    this.formattedCommitmentSize = formatBytes(props.commitmentSize);
  }

  render() {
    const { location, isDarkModeOn } = this.props;
    const { mode } = this.state;
    const subHeader = mode !== 1 ? subHeaders[mode] : `Select a directory to save your proof og space data.\nMinimum ${this.formattedCommitmentSize} of free space is required`;
    const hasBackButton = location?.state?.modifyPostData || mode !== 1;
    return (
      <Wrapper>
        <StepsContainer header="SETUP PROOF OF SPACE" steps={['PROTECT WALLET', 'SETUP PROOF OF SPACE']} currentStep={1} isDarkModeOn={isDarkModeOn} />
        <CorneredContainer width={650} height={450} header={headers[mode]} headerIcon={posIcon} subHeader={subHeader}>
          <SmallHorizontalPanel isDarkModeOn={isDarkModeOn} />
          {hasBackButton && <BackButton action={this.handlePrevAction} />}
          {this.renderRightSection()}
        </CorneredContainer>
      </Wrapper>
    );
  }

  renderRightSection = () => {
    const { status, commitmentSize, isDarkModeOn } = this.props;
    const { mode, folder, freeSpace, commitment, processor, isPausedOnUsage } = this.state;
    const formattedCommitmentSize = formatBytes(commitmentSize);
    switch (mode) {
      case 0:
        return <PoSModifyPostData modify={this.handleNextAction} deleteData={() => {}} isDarkModeOn={isDarkModeOn} />;
      case 1:
        return (
          <PoSDirectory
            nextAction={this.handleNextAction}
            commitmentSize={formattedCommitmentSize}
            folder={folder}
            freeSpace={freeSpace}
            status={status}
            isDarkModeOn={isDarkModeOn}
          />
        );
      case 2:
        return <PoSSize nextAction={this.handleNextAction} folder={folder} freeSpace={freeSpace} commitment={commitment} status={status} isDarkModeOn={isDarkModeOn} />;
      case 3:
        return <PoSProcessor nextAction={this.handleNextAction} processor={processor} isPausedOnUsage={isPausedOnUsage} status={status} isDarkModeOn={isDarkModeOn} />;
      case 4:
        return (
          <PoSSummary
            folder={folder}
            commitment={commitment}
            processor={processor}
            isPausedOnUsage={isPausedOnUsage}
            nextAction={this.handleNextAction}
            switchMode={({ mode }) => this.setState({ mode })}
            status={status}
          />
        );
      default:
        return null;
    }
  };

  setupAndInitMining = async () => {
    const { initMining, accounts, commitmentSize, history } = this.props;
    const { folder, commitment, processor, isPausedOnUsage } = this.state;
    try {
      await initMining({ logicalDrive: folder, commitmentSize, address: accounts[0].publicKey, commitment, processor, isPausedOnUsage }); // TODO: use user selected commitment
      history.push('/main/node', { showIntro: true });
    } catch (error) {
      this.setState(() => {
        throw error;
      });
    }
  };

  handleNextAction = ({ folder, freeSpace, commitment, processor, isPausedOnUsage }) => {
    const { mode } = this.state;
    switch (mode) {
      case 0: {
        this.setState({ mode: 1 });
        break;
      }
      case 1: {
        this.setState({ mode: 2, folder, freeSpace });
        break;
      }
      case 2: {
        this.setState({ mode: 3, commitment });
        break;
      }
      case 3: {
        this.setState({ mode: 4, processor, isPausedOnUsage });
        break;
      }
      case 4: {
        this.setupAndInitMining();
        break;
      }
      default:
        break;
    }
  };

  handlePrevAction = () => {
    const { history } = this.props;
    const { mode } = this.state;
    if (mode === 0) {
      history.goBack();
    } else {
      this.setState({ mode: mode - 1 });
    }
  };
}

const mapStateToProps = (state) => ({
  status: state.node.status,
  posDataPath: state.node.posDataPath,
  commitmentSize: state.node.commitmentSize,
  accounts: state.wallet.accounts,
  isDarkModeOn: state.ui.isDarkMode
});

const mapDispatchToProps = {
  initMining
};

NodeSetup = connect<any, any, _, _, _, _>(mapStateToProps, mapDispatchToProps)(NodeSetup);

NodeSetup = ScreenErrorBoundary(NodeSetup);
export default NodeSetup;
