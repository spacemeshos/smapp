// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { createPosData, deletePosData } from '/redux/smesher/actions';
import { CorneredContainer, BackButton } from '/components/common';
import { ScreenErrorBoundary } from '/components/errorHandler';
import { StepsContainer, SmallHorizontalPanel } from '/basicComponents';
import { PoSModifyPostData, PoSDirectory, PoSSize, PoSProvider, PoSSummary } from '/components/node';
import { posIcon } from '/assets/images';
import { formatBytes } from '/infra/utils';
import type { RouterHistory } from 'react-router-dom';
import type { Account, Action, NodeStatus } from '/types';

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
  createPosData: Action,
  deletePosData: Action,
  status: NodeStatus,
  dataDir: string,
  commitmentSize: number,
  minCommitmentSize: number,
  history: RouterHistory,
  location: { state?: { modifyPostData: boolean } }
};

type State = {
  mode: number,
  dataDir: string,
  freeSpace: number,
  commitment: number,
  provider: { id: number, model: string, computeApi: string, performance: number },
  throttle: boolean
};

class NodeSetup extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { location } = props;
    this.state = {
      mode: location?.state?.modifyPostData ? 0 : 1,
      dataDir: props.dataDir || '',
      commitment: props.commitmentSize || 0,
      throttle: false
    };
    this.mode1Subheader = `Select a directory to save your proof of space data.\nMinimum ${formatBytes(props.minCommitmentSize)} of free space is required`;
  }

  render() {
    const { location } = this.props;
    const { mode } = this.state;
    const subHeader = mode !== 1 ? subHeaders[mode] : this.mode1Subheader;
    const hasBackButton = location?.state?.modifyPostData || mode !== 1;
    return (
      <Wrapper>
        <StepsContainer header="SETUP PROOF OF SPACE" steps={['PROTECT WALLET', 'SETUP PROOF OF SPACE']} currentStep={1} />
        <CorneredContainer width={650} height={450} header={headers[mode]} headerIcon={posIcon} subHeader={subHeader}>
          <SmallHorizontalPanel />
          {hasBackButton && <BackButton action={this.handlePrevAction} />}
          {this.renderRightSection()}
        </CorneredContainer>
      </Wrapper>
    );
  }

  renderRightSection = () => {
    const { status, minCommitmentSize } = this.props;
    const { mode, dataDir, freeSpace, commitment, provider, throttle } = this.state;
    switch (mode) {
      case 0:
        return <PoSModifyPostData modify={this.handleNextAction} deleteData={this.deletePosData} />;
      case 1:
        return <PoSDirectory nextAction={this.handleNextAction} minCommitmentSize={minCommitmentSize} dataDir={dataDir} status={status} />;
      case 2:
        return <PoSSize nextAction={this.handleNextAction} dataDir={dataDir} freeSpace={freeSpace} commitment={commitment} status={status} />;
      case 3:
        return <PoSProvider nextAction={this.handleNextAction} provider={provider} throttle={throttle} status={status} />;
      case 4:
        return (
          <PoSSummary
            dataDir={dataDir}
            commitment={commitment}
            provider={provider}
            throttle={throttle}
            nextAction={this.handleNextAction}
            switchMode={({ mode }) => this.setState({ mode })}
            status={status}
          />
        );
      default:
        return null;
    }
  };

  handleNextAction = ({ dataDir, freeSpace, commitment, provider, throttle }) => {
    const { mode } = this.state;
    switch (mode) {
      case 0: {
        this.setState({ mode: 1 });
        break;
      }
      case 1: {
        this.setState({ mode: 2, dataDir, freeSpace });
        break;
      }
      case 2: {
        this.setState({ mode: 3, commitment });
        break;
      }
      case 3: {
        this.setState({ mode: 4, provider, throttle });
        break;
      }
      case 4: {
        this.startCreatingPosData();
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

  startCreatingPosData = async () => {
    const { createPosData, accounts, history } = this.props;
    const { dataDir, commitment, provider, throttle } = this.state;
    try {
      await createPosData({ coinbase: accounts[0].publicKey, dataDir, commitmentSize: commitment, throttle, provider });
      history.push('/main/node', { showIntro: true });
    } catch (error) {
      this.setState(() => {
        throw error;
      });
    }
  };

  deletePosData = async () => {
    const { deletePosData, history } = this.props;
    await deletePosData();
    history.push('/main/wallet/');
  };
}

const mapStateToProps = (state) => ({
  status: state.node.status,
  dataDir: state.smesher.dataDir,
  commitmentSize: state.smesher.commitmentSize,
  minCommitmentSize: state.smesher.minCommitmentSize,
  accounts: state.wallet.accounts
});

const mapDispatchToProps = {
  createPosData,
  deletePosData
};

NodeSetup = connect<any, any, _, _, _, _>(mapStateToProps, mapDispatchToProps)(NodeSetup);

NodeSetup = ScreenErrorBoundary(NodeSetup);
export default NodeSetup;
