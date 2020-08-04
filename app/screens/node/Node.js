// @flow
import { shell } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { getUpcomingRewards } from '/redux/node/actions';
import { SmesherLog } from '/components/node';
import { WrapperWith2SideBars, Link, Button, ProgressBar } from '/basicComponents';
import { ScreenErrorBoundary } from '/components/errorHandler';
import { eventsService } from '/infra/eventsService';
import { getFormattedTimestamp } from '/infra/utils';
import { fireworks } from '/assets/images';
import { smColors, nodeConsts } from '/vars';
import type { RouterHistory } from 'react-router-dom';
import type { TxList } from '/types';
// import type { Action } from '/types';

const isDarkModeOn = localStorage.getItem('dmMode') === 'true';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const Text = styled.div`
  font-size: 15px;
  line-height: 20px;
  color: ${isDarkModeOn ? smColors.white : smColors.realBlack};
`;

const BoldText = styled(Text)`
  font-family: SourceCodeProBold;
`;

const GreenText = styled(Text)`
  color: ${smColors.green};
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: flex-end;
`;

const Footer1 = styled(Footer)`
  justify-content: space-between;
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
  margin-bottom: 20px;
`;

const Dots = styled.div`
  flex: 1;
  flex-shrink: 1;
  overflow: hidden;
  margin: 0 5px;
  font-size: 16px;
  line-height: 20px;
  color: ${isDarkModeOn ? smColors.white : smColors.realBlack};
`;

const Fireworks = styled.img`
  position: absolute;
  top: -40px;
  max-width: 100%;
  max-height: 100%;
  cursor: inherit;
`;

const inlineLinkStyle = { display: 'inline', fontSize: '16px', lineHeight: '20px' };

type Props = {
  status: Object,
  miningStatus: number,
  // timeTillNextAward: number,
  rewards: TxList,
  // getUpcomingRewards: Action,
  posDataPath: string,
  commitmentSize: number,
  networkId: string,
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
  getUpcomingAwardsInterval: IntervalID;

  fireworksTimeout: TimeoutID;

  audio: any;

  constructor(props) {
    super(props);
    const { location } = props;
    this.state = {
      showIntro: !!location?.state?.showIntro,
      showFireworks: !!location?.state?.showIntro
    };
  }

  render() {
    const { rewards } = this.props;
    const smesherInitTimestamp = localStorage.getItem('smesherInitTimestamp');
    this.smesherInitTimestamp = smesherInitTimestamp ? getFormattedTimestamp(JSON.parse(smesherInitTimestamp)) : '';
    const smesherSmeshingTimestamp = localStorage.getItem('smesherSmeshingTimestamp');
    this.smesherSmeshingTimestamp = smesherSmeshingTimestamp ? getFormattedTimestamp(JSON.parse(smesherSmeshingTimestamp)) : '';
    return (
      <Wrapper>
        <WrapperWith2SideBars width={650} height={450} header="SMESHER">
          {this.renderMainSection()}
        </WrapperWith2SideBars>
        <SmesherLog rewards={rewards} initTimestamp={this.smesherInitTimestamp} smesherTimestamp={this.smesherSmeshingTimestamp} />
      </Wrapper>
    );
  }

  async componentDidMount() {
    //   const { status, miningStatus, getUpcomingRewards } = this.props;
    //   if (status?.synced && miningStatus === nodeConsts.IS_MINING) {
    //     await getUpcomingRewards();
    //     this.getUpcomingAwardsInterval = setInterval(getUpcomingRewards, 30000);
    //   }
    const audioPath = await eventsService.getAudioPath();
    this.audio = new Audio(audioPath);
  }

  componentDidUpdate() {
    const { rewards } = this.props;
    const playedAudio = localStorage.getItem('playedAudio');
    this.audio.loop = false;
    if (rewards && rewards.length === 1 && !playedAudio) {
      this.audio.play();
    }
  }

  componentWillUnmount() {
    // this.getUpcomingAwardsInterval && clearInterval(this.getUpcomingAwardsInterval);
    this.fireworksTimeout && clearTimeout(this.fireworksTimeout);
  }

  renderMainSection = () => {
    const { miningStatus, history } = this.props;
    const { showIntro, showFireworks } = this.state;
    if (showIntro) {
      return showFireworks ? this.renderFireworks() : this.renderIntro();
    } else if (miningStatus === nodeConsts.NOT_MINING) {
      return (
        <>
          <BoldText>Proof of Space Status</BoldText>
          <br />
          <Text>Proof of Space data is not setup yet</Text>
          <br />
          <Button onClick={() => history.push('/main/node-setup')} text="SETUP POS" width={175} />
        </>
      );
    } else if (miningStatus === nodeConsts.MINING_UNSET) {
      return (
        <>
          <BoldText>SMESHER</BoldText>
          <br />
          <Text>Please wait for smeshing status…</Text>
          <Footer1>
            <Link onClick={this.navigateToMiningGuide} text="SMESHING GUIDE" />
          </Footer1>
        </>
      );
    }
    return this.renderNodeDashboard();
  };

  renderFireworks = () => {
    this.fireworksTimeout = setTimeout(() => {
      this.setState({ showFireworks: false });
    }, 1500);
    return <Fireworks key="fireworks" src={fireworks} />;
  };

  renderIntro = () => {
    return (
      <>
        <BoldText>Your proof of space data is being created!</BoldText>
        <Text>* You will get a desktop notification when the setup is complete</Text>
        <Text>* Your app will start smeshing automatically when the setup is complete</Text>
        <br />
        <br />
        <BoldText>Important</BoldText>
        <Text>* Leave your computer on 24/7 to finish setup and start smeshing</Text>
        <Text>
          * <Link onClick={this.navigateToPreventComputerSleep} text="Disable your computer from going to sleep" style={inlineLinkStyle} />
        </Text>
        <Text>
          * <Link onClick={this.navigateToNetConfigGuide} text="Configure your network to accept incoming app connections." style={inlineLinkStyle} />
        </Text>
        <Footer1>
          <Link onClick={this.navigateToMiningGuide} text="SMESHING GUIDE" />
          <Button onClick={() => this.setState({ showIntro: false })} text="GOT IT" width={175} />
        </Footer1>
      </>
    );
  };

  renderNodeDashboard = () => {
    const { history, status, miningStatus, posDataPath, commitmentSize, networkId } = this.props;
    const isCreatingPoSData = miningStatus === nodeConsts.IN_SETUP;
    return (
      <>
        <GreenText>
          Smesher
          <SmesherId> 0x12344...244AF </SmesherId>
          <Status status={status}>{status ? 'ONLINE' : 'OFFLINE'} </Status>
          on Network {networkId}.
        </GreenText>
        <br />
        <BoldText>Proof of Space Status</BoldText>
        <br />
        <Text>
          {posDataPath} with {commitmentSize}GB allocated
        </Text>
        <br />
        <br />
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
          <ProgressBar progress={30} />
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

  navigateToMiningGuide = () => shell.openExternal('https://testnet.spacemesh.io/#/guide/setup');

  navigateToNetConfigGuide = () => shell.openExternal('https://testnet.spacemesh.io/#/netconfig');

  navigateToPreventComputerSleep = () => shell.openExternal('https://testnet.spacemesh.io/#/no_sleep');
}

const mapStateToProps = (state) => ({
  status: state.node.status,
  networkId: state.node.networkId,
  posDataPath: state.node.posDataPath,
  commitmentSize: state.node.commitmentSize,
  miningStatus: state.node.miningStatus,
  timeTillNextAward: state.node.timeTillNextAward,
  rewards: state.node.rewards,
  rewardsAddress: state.node.rewardsAddress
});

const mapDispatchToProps = {
  getUpcomingRewards
};

Node = connect<any, any, _, _, _, _>(mapStateToProps, mapDispatchToProps)(Node);

Node = ScreenErrorBoundary(Node);
export default Node;
