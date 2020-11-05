import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { SmesherIntro, SmesherLog } from '/components/node';
import { WrapperWith2SideBars, Button, ProgressBar } from '/basicComponents';
import { ScreenErrorBoundary } from '/components/errorHandler';
import { getFormattedTimestamp } from '/infra/utils';
import { posIcon, posSmesher, posDirectoryBlack, posDirectoryWhite } from '/assets/images';
import { smColors, nodeConsts } from '/vars';
import type { RouterHistory } from 'react-router-dom';
import type { TxList } from '/types';
// import type { Action } from '/types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const Text = styled.div`
  font-size: 15px;
  line-height: 20px;
  color: ${({ theme }) => (theme.isDarkModeOn ? smColors.white : smColors.realBlack)};
`;

const BoldText = styled(Text)`
  font-family: SourceCodeProBold;
`;

const SubHeader = styled(Text)`
  margin-bottom: 15px;
  color: ${smColors.green};
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: flex-end;
`;

const SmesherId = styled.span`
  color: ${smColors.blue};
`;

const Status = styled.span`
  color: ${({ status }) => (status ? smColors.green : smColors.orange)};
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const Dots = styled.div`
  flex: 1;
  flex-shrink: 1;
  overflow: hidden;
  margin: 0 5px;
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => (theme.isDarkModeOn ? smColors.white : smColors.realBlack)};
`;

const PosSmesherIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 5px;
`;

const PosFolderIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 5px;
`;

type Props = {
  status: Object,
  miningStatus: number,
  rewards: TxList,
  posDataPath: string,
  commitmentSize: number,
  networkId: string,
  isDarkModeOn: boolean,
  history: RouterHistory,
  location: { state?: { showIntro?: boolean } }
};

type State = {
  showIntro: boolean,
  isMiningPaused: boolean,
  showFireworks: boolean,
  copied: boolean
};

class Node extends Component<Props, State> {
  audio: any;

  constructor(props) {
    super(props);
    const { location } = props;
    this.state = {
      showIntro: !!location?.state?.showIntro
    };
  }

  render() {
    const { rewards, isDarkModeOn } = this.props;
    const smesherInitTimestamp = localStorage.getItem('smesherInitTimestamp');
    this.smesherInitTimestamp = smesherInitTimestamp ? getFormattedTimestamp(JSON.parse(smesherInitTimestamp)) : '';
    const smesherSmeshingTimestamp = localStorage.getItem('smesherSmeshingTimestamp');
    this.smesherSmeshingTimestamp = smesherSmeshingTimestamp ? getFormattedTimestamp(JSON.parse(smesherSmeshingTimestamp)) : '';
    return (
      <Wrapper>
        <WrapperWith2SideBars width={650} height={450} header="SMESHER" headerIcon={posIcon} isDarkModeOn={isDarkModeOn}>
          {this.renderMainSection()}
        </WrapperWith2SideBars>
        <SmesherLog rewards={rewards} initTimestamp={this.smesherInitTimestamp} smesherTimestamp={this.smesherSmeshingTimestamp} isDarkModeOn={isDarkModeOn} />
      </Wrapper>
    );
  }

  renderMainSection = () => {
    const { miningStatus, history, status, networkId, isDarkModeOn } = this.props;
    const { showIntro } = this.state;
    if (showIntro) {
      return <SmesherIntro hideIntro={() => this.setState({ showIntro: false })} isDarkModeOn={isDarkModeOn} />;
    } else if (miningStatus === nodeConsts.NOT_MINING) {
      return (
        <>
          <SubHeader>
            Smesher
            <SmesherId> 0x12344...244AF </SmesherId>
            <Status status={status}>{status ? 'ONLINE' : 'OFFLINE'} </Status>
            on Network {networkId}.
          </SubHeader>
          <TextWrapper>
            <PosSmesherIcon src={posSmesher} />
            <BoldText>Proof of Space Status</BoldText>
          </TextWrapper>
          <Text>Proof of Space data is not setup yet</Text>
          <br />
          <Button onClick={() => history.push('/main/node-setup')} text="SETUP PROOF OF SPACE" width={250} />
        </>
      );
    } else if (miningStatus === nodeConsts.MINING_UNSET) {
      return <Text>Please wait for smeshing status…</Text>;
    }
    return this.renderNodeDashboard();
  };

  renderNodeDashboard = () => {
    const { history, status, miningStatus, posDataPath, commitmentSize, networkId, isDarkModeOn } = this.props;
    const isCreatingPoSData = miningStatus === nodeConsts.IN_SETUP;
    return (
      <>
        <SubHeader>
          Smesher
          <SmesherId> 0x12344...244AF </SmesherId>
          <Status status={status}>{status ? 'ONLINE' : 'OFFLINE'} </Status>
          on Network {networkId}.
        </SubHeader>
        <br />
        <TextWrapper>
          <PosSmesherIcon src={posSmesher} />
          <BoldText>Proof of Space Status</BoldText>
        </TextWrapper>
        <TextWrapper>
          <PosFolderIcon src={isDarkModeOn ? posDirectoryWhite : posDirectoryBlack} />
          <Text>
            {posDataPath} with {commitmentSize}GB allocated
          </Text>
        </TextWrapper>
        <TextWrapper>
          <Text>Status</Text>
          <Dots>........................................</Dots>
          <Text>{isCreatingPoSData ? 'Creating PoS data' : 'Smeshing'}</Text>
        </TextWrapper>
        <TextWrapper>
          <Text>Started creating</Text>
          <Dots>........................................</Dots>
          <Text>{this.smesherInitTimestamp}</Text>
        </TextWrapper>
        <TextWrapper>
          <Text>Progress</Text>
          <Dots>........................................</Dots>
          <ProgressBar progress={0.3} />
          <Text> 30% 150GB / 200GB</Text>
        </TextWrapper>

        <TextWrapper>
          <Text>{isCreatingPoSData ? 'Estimated finish time' : 'Finished creating'}</Text>
          <Dots>........................................</Dots>
          <Text>{this.smesherSmeshingTimestamp}</Text>
        </TextWrapper>
        <Footer>
          <Button onClick={() => history.push('/main/node-setup', { modifyPostData: true })} text="MODIFY POST DATA" isPrimary={false} style={{ marginRight: 15 }} width={130} />
          {miningStatus === nodeConsts.IN_SETUP && <Button onClick={() => {}} text="PAUSE POST DATA GENERATION" isPrimary={false} width={200} />}
        </Footer>
      </>
    );
  };
}

const mapStateToProps = (state) => ({
  status: state.node.status,
  networkId: state.node.networkId,
  posDataPath: state.node.posDataPath,
  commitmentSize: state.node.commitmentSize,
  miningStatus: state.node.miningStatus,
  rewards: state.node.rewards,
  rewardsAddress: state.node.rewardsAddress,
  isDarkModeOn: state.ui.isDarkMode
});

Node = connect(mapStateToProps)(Node);

Node = ScreenErrorBoundary(Node);
export default Node;
