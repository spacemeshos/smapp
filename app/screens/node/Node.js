// @flow
import { shell } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { getUpcomingAwards } from '/redux/node/actions';
import { CorneredContainer } from '/components/common';
import { WrapperWith2SideBars, Link, Button } from '/basicComponents';
import { ScreenErrorBoundary } from '/components/errorHandler';
import { playIcon, pauseIcon } from '/assets/images';
import { smColors, nodeConsts } from '/vars';
import type { RouterHistory } from 'react-router-dom';
import type { Action } from '/types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const LogInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: visible;
  overflow-x: hidden;
`;

const LogEntry = styled.div`
  display: flex;
  flex-direction: column;
`;

const LogText = styled.div`
  font-size: 16px;
  line-height: 20px;
  color: ${smColors.black};
`;

const AwardText = styled(LogText)`
  color: ${smColors.green};
`;

const LogEntrySeparator = styled(LogText)`
  margin: 15px 0;
  line-height: 16px;
`;

const Text = styled.div`
  font-size: 16px;
  line-height: 23px;
  color: ${smColors.realBlack};
`;

const BoldText = styled(Text)`
  font-family: SourceCodeProBold;
  margin-top: 20px;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
  align-items: flex-end;
`;

const Status = styled.div`
  font-size: 16px;
  line-height: 20px;
  color: ${({ isConnected }) => (isConnected ? smColors.green : smColors.orange)};
  margin-bottom: 30px;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

const LeftText = styled.div`
  margin-right: 15px;
  font-size: 16px;
  line-height: 20px;
  color: ${smColors.realBlack};
`;

const RightText = styled.div`
  flex: 1;
  margin-right: 0;
  margin-left: 15px;
  text-align: right;
`;

const GreenText = styled(RightText)`
  color: ${smColors.green};
`;

const Dots = styled(LeftText)`
  flex-shrink: 1;
  overflow: hidden;
`;

type Props = {
  isConnected: boolean,
  miningStatus: number,
  timeTillNextAward: number,
  totalEarnings: number,
  getUpcomingAwards: Action,
  history: RouterHistory,
  location: { state?: { showIntro?: boolean } }
};

type State = {
  showIntro: boolean,
  isMiningPaused: boolean
};

class Node extends Component<Props, State> {
  getUpcomingAwardsInterval: IntervalID;

  constructor(props) {
    super(props);
    const { location } = props;
    this.state = {
      showIntro: !!location?.state?.showIntro,
      isMiningPaused: false
    };
  }

  render() {
    return (
      <Wrapper>
        <WrapperWith2SideBars width={650} height={480} header="SMESHER" style={{ marginRight: 10 }}>
          {this.renderMainSection()}
        </WrapperWith2SideBars>
        <CorneredContainer width={250} height={480} header="SMESHER LOG">
          <LogInnerWrapper>
            <LogEntry>
              <LogText>12.09.19 - 13:00</LogText>
              <LogText>Initializing</LogText>
            </LogEntry>
            <LogEntrySeparator>...</LogEntrySeparator>
            <LogEntry>
              <LogText>12.09.19 - 13:10</LogText>
              <AwardText>Network reward: 2SMH</AwardText>
            </LogEntry>
            <LogEntrySeparator>...</LogEntrySeparator>
            <LogEntry>
              <LogText>12.09.19 - 13:20</LogText>
              <LogText>Network checkup</LogText>
            </LogEntry>
            <LogEntrySeparator>...</LogEntrySeparator>
          </LogInnerWrapper>
        </CorneredContainer>
      </Wrapper>
    );
  }

  async componentDidMount() {
    const { isConnected, miningStatus, getUpcomingAwards } = this.props;
    if (isConnected && miningStatus === nodeConsts.IS_MINING) {
      await getUpcomingAwards();
      this.getUpcomingAwardsInterval = setInterval(getUpcomingAwards, nodeConsts.TIME_BETWEEN_LAYERS);
    }
  }

  componentWillUnmount(): * {
    this.getUpcomingAwardsInterval && clearInterval(this.getUpcomingAwardsInterval);
  }

  renderMainSection = () => {
    const { miningStatus } = this.props;
    const { showIntro } = this.state;
    if (showIntro) {
      return this.renderIntro();
    } else if (miningStatus === nodeConsts.NOT_MINING) {
      return this.renderPreSetup();
    }
    return this.renderNodeDashboard();
  };

  renderIntro = () => {
    return [
      <BoldText key="1">Success! You are now a Spacemesh Testnet member!</BoldText>,
      <Text key="2">* You will get a desktop notification about your smeshing rewards in about 48 hours</Text>,
      <Text key="3">* You can close this window and choose to keep smeshing the background</Text>,
      <BoldText key="4">Important</BoldText>,
      <Text key="5">* Leave your computer on 24/7 to smesh and to earn smeshing rewards</Text>,
      <Text key="6">
        *{' '}
        <Link onClick={this.navigateToPreventComputerSleep} text="Disable your computer from going to sleep" style={{ display: 'inline', fontSize: '16px', lineHeight: '20px' }} />
      </Text>,
      <Text key="7">
        * Configure your network to accept incoming app connections.
        <Link onClick={this.navigateToNetConfigGuide} text="Learn more." style={{ display: 'inline', fontSize: '16px', lineHeight: '20px' }} />
      </Text>,
      <Text key="8" style={{ display: 'flex', flexDirection: 'row' }}>
        *&nbsp;
        <Link onClick={this.navigateToMiningGuide} text="Learn more about smeshing" style={{ fontSize: '16px', lineHeight: '20px' }} />
      </Text>,
      <Footer key="footer">
        <Link onClick={this.navigateToMiningGuide} text="SMESHING GUIDE" />
        <Button onClick={() => this.setState({ showIntro: false })} text="GOT IT" width={175} />
      </Footer>
    ];
  };

  renderPreSetup = () => {
    const { history } = this.props;
    return [
      <BoldText key="1">You are not smeshing yet.</BoldText>,
      <br key="2" />,
      <Text key="3">Setup smeshing to earn Smesh rewards</Text>,
      <br key="4" />,
      <br key="5" />,
      <Text key="6">{`Setup requires ${nodeConsts.COMMITMENT_SIZE} GB of free disk space`}</Text>,
      <Text key="7">Once set up is complete, You should start earning Smesh rewards for smeshing in about 48 hours</Text>,
      <Footer key="footer">
        <Link onClick={this.navigateToMiningGuide} text="SMESHING GUIDE" />
        <Button onClick={() => history.push('/main/node-setup', { isOnlyNodeSetup: true })} text="BEGIN SETUP" width={175} />
      </Footer>
    ];
  };

  renderNodeDashboard = () => {
    const { isConnected, timeTillNextAward, totalEarnings } = this.props;
    const { isMiningPaused } = this.state;
    return [
      <Status key="status" isConnected={isConnected}>
        {isConnected ? 'Your Smesher is online' : 'Not connected!'}
      </Status>,
      <TextWrapper key="1">
        <LeftText>Upcoming reward in</LeftText>
        <Dots>....................................</Dots>
        <RightText>{Math.floor(timeTillNextAward / 1000)} min</RightText>
      </TextWrapper>,
      <TextWrapper key="2">
        <LeftText>Total Rewards</LeftText>
        <Dots>....................................</Dots>
        <GreenText>{totalEarnings} SMH</GreenText>
      </TextWrapper>,
      <Footer key="footer">
        <Link onClick={this.navigateToMiningGuide} text="SMESHING GUIDE" />
        <Button
          onClick={this.pauseResumeMining}
          text={isMiningPaused ? 'RESUME SMESHING' : 'PAUSE SMESHING'}
          width={175}
          imgPosition="before"
          img={isMiningPaused ? playIcon : pauseIcon}
          isDisabled
        />
      </Footer>
    ];
  };

  pauseResumeMining = () => {};

  navigateToMiningGuide = () => shell.openExternal('https://testnet.spacemesh.io/#/guide/setup');

  navigateToNetConfigGuide = () => shell.openExternal('https://testnet.spacemesh.io/#/netconfig');

  navigateToPreventComputerSleep = () => shell.openExternal('https://testnet.spacemesh.io/#/no_sleep');
}

const mapStateToProps = (state) => ({
  isConnected: state.node.isConnected,
  miningStatus: state.node.miningStatus,
  timeTillNextAward: state.node.timeTillNextAward,
  totalEarnings: state.node.totalEarnings
});

const mapDispatchToProps = {
  getUpcomingAwards
};

Node = connect<any, any, _, _, _, _>(
  mapStateToProps,
  mapDispatchToProps
)(Node);

Node = ScreenErrorBoundary(Node);
export default Node;
