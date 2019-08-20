// @flow
import { shell } from 'electron';
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { getTotalAwards, getUpcomingAward } from '/redux/node/actions';
import { CorneredContainer } from '/components/common';
import { WrapperWith2SideBars, Link, Button } from '/basicComponents';
import { ScreenErrorBoundary } from '/components/errorHandler';
import { playIcon, pauseIcon } from '/assets/images';
import { smColors } from '/vars';
import type { RouterHistory } from 'react-router-dom';
// import type { Action } from '/types';

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

const RewardText = styled(LogText)`
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

// $FlowStyledIssue
const Status = styled.div`
  font-size: 16px;
  line-height: 20px;
  color: ${({ isConnected }) => (isConnected ? smColors.green : smColors.orange)};
  margin-bottom: 30px;
`;

const ComplexTextWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  &:before {
    content: '';
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 0;
    line-height: 0;
    border-bottom: 1px dotted ${smColors.realBlack};
  }
`;

const TruncatedText = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const NonShrinkableText = styled(Text)`
  flex-shrink: 0;
`;

const NonShrinkableGreenText = styled(Text)`
  flex-shrink: 0;
  color: ${smColors.green};
`;

type Props = {
  isConnected: boolean,
  isMining: boolean,
  timeTillNextReward: number, // TODO: connect this with actual logic for next reward layer time - genesis time
  // getTotalAwards: Action,
  // getUpcomingAward: Action,
  totalEarnings: number,
  totalRunningTime: number,
  history: RouterHistory,
  location: { state?: { showIntro?: boolean } }
};

type State = {
  showIntro: boolean,
  isMiningPaused: boolean
};

class Node extends Component<Props, State> {
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
        <WrapperWith2SideBars width={650} height={480} header="SPACEMESH MINER" style={{ marginRight: 10 }}>
          {this.renderMainSection()}
        </WrapperWith2SideBars>
        <CorneredContainer width={250} height={480} header="MINER LOG">
          <LogInnerWrapper>
            <LogEntry>
              <LogText>12.09.19 - 13:00</LogText>
              <LogText>Initializing</LogText>
            </LogEntry>
            <LogEntrySeparator>...</LogEntrySeparator>
            <LogEntry>
              <LogText>12.09.19 - 13:10</LogText>
              <RewardText>Network reward: 2SMC</RewardText>
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
    // const { getTotalAwards, getUpcomingAward } = this.props;
    try {
      // await getTotalAwards();
      // await getUpcomingAward();
    } catch (error) {
      this.setState(() => {
        throw error;
      });
    }
  }

  renderMainSection = () => {
    const { isMining } = this.props;
    const { showIntro } = this.state;
    if (showIntro) {
      return this.renderIntro();
    } else if (!isMining) {
      return this.renderPreSetup();
    }
    return this.renderNodeDashboard();
  };

  renderIntro = () => {
    return [
      <BoldText key="1">Success! You are now a Spacemesh testnet member!</BoldText>,
      <Text key="2">* You will receive a desktop notification about your mining rewards</Text>,
      <Text key="3">* You can close this app, Mining still happens in the background</Text>,
      <BoldText key="4">Important:</BoldText>,
      <Text key="5">* Leave your computer on 24/7 to mine</Text>,
      <Text key="6">* Disable your computer from going to sleep</Text>,
      <Text key="7" style={{ display: 'flex', flexDirection: 'row' }}>
        *&nbsp;
        <Link onClick={this.navigateToMiningGuide} text="Learn more about Spacemesh Mining" style={{ fontSize: '16px', lineHeight: '20px' }} />
      </Text>,
      <Footer key="footer">
        <Link onClick={this.navigateToMiningGuide} text="MINING GUIDE" />
        <Button onClick={() => this.setState({ showIntro: false })} text="GOT IT" width={175} />
      </Footer>
    ];
  };

  renderPreSetup = () => {
    const { history } = this.props;
    return [
      <BoldText key="1">You are not mining yet.</BoldText>,
      <br key="2" />,
      <Text key="3">You can start earning SMC to your wallet as soon as you complete the setup</Text>,
      <br key="4" />,
      <br key="5" />,
      <Text key="6">This setup uses 5 GB and takes just a few minutes to complete</Text>,
      <Footer key="footer">
        <Link onClick={this.navigateToMiningGuide} text="MINING GUIDE" />
        <Button onClick={() => history.push('/main/node-setup', { isOnlyNodeSetup: true })} text="BEGIN SETUP" width={175} />
      </Footer>
    ];
  };

  renderNodeDashboard = () => {
    const { isConnected, totalRunningTime, timeTillNextReward, totalEarnings } = this.props;
    const { isMiningPaused } = this.state;
    return [
      <Status key="status" isConnected={isConnected}>
        {isConnected ? 'Connected!' : 'Not connected!'}
      </Status>,
      <ComplexTextWrapper key="1">
        <TruncatedText>Total time running</TruncatedText>
        <NonShrinkableText>{totalRunningTime}</NonShrinkableText>
      </ComplexTextWrapper>,
      <ComplexTextWrapper key="2">
        <TruncatedText>Upcoming reward in</TruncatedText>
        <NonShrinkableText>{timeTillNextReward}</NonShrinkableText>
      </ComplexTextWrapper>,
      <ComplexTextWrapper key="3" style={{ marginTop: '20px' }}>
        <TruncatedText>Total Rewards</TruncatedText>
        <NonShrinkableGreenText>{totalEarnings}</NonShrinkableGreenText>
      </ComplexTextWrapper>,
      <Footer key="footer">
        <Link onClick={this.navigateToMiningGuide} text="MINING GUIDE" />
        <Button
          onClick={this.pauseResumeMining}
          text={isMiningPaused ? 'RESUME MINING' : 'PAUSE MINING'}
          width={175}
          imgPosition="before"
          img={isMiningPaused ? playIcon : pauseIcon}
        />
      </Footer>
    ];
  };

  pauseResumeMining = () => {};

  navigateToMiningGuide = () => shell.openExternal('https://testnet.spacemesh.io/#/guide/setup');
}

const mapStateToProps = (state) => ({
  isConnected: state.node.isConnected,
  isMining: state.node.isMining,
  totalEarnings: state.node.totalEarnings,
  totalRunningTime: state.node.totalRunningTime
});

const mapDispatchToProps = {
  getTotalAwards,
  getUpcomingAward
};

Node = connect<any, any, _, _, _, _>(
  mapStateToProps,
  mapDispatchToProps
)(Node);

Node = ScreenErrorBoundary(Node);
export default Node;
