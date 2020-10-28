// @flow
import React, { Component } from 'react';
import type { RouterHistory } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { ScreenErrorBoundary } from '/components/errorHandler';
import { WrapperWith2SideBars, Link, NetworkIndicator, Tooltip, ProgressBar } from '/basicComponents';
import { smColors } from '/vars';
import { network } from '/assets/images';
import { getFormattedTimestamp } from '/infra/utils';
import { eventsService } from '/infra/eventsService';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
`;

const DetailsWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterWrap = styled.div`
  display: flex;
  flex-direction: row;
`;

const Message = styled.div`
  display: flex;
  flex-direction: row;
  color: ${({ color }) => color};
`;

const DetailsRow = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: ${({ isLast, theme }) => (isLast ? `0px` : `1px solid ${theme.isDarkModeOn ? smColors.white : smColors.darkGray10Alpha};`)};
`;

const DetailsText = styled.div`
  font-size: 16px;
  line-height: 20px;
  margin: 10px 0;
  color: ${({ theme }) => (theme.isDarkModeOn ? smColors.white : smColors.realBlack)};
`;

const GrayText = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 14px;
  text-transform: uppercase;
  color: ${isDarkModeOn ? smColors.white : smColors.dark75Alpha};
`;

const DetailsTextWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Progress = styled.div`
  display: flex;
  flex-direction: column;
  width: 100px;
  margin-left: 20px;
`;

const ProgressLabel = styled.div`
  margin-left: 10px;
`;

type Props = {
  genesisTime: string,
  status: Object,
  nodeIndicator: Object,
  history: RouterHistory
};

class Network extends Component<Props> {
  render() {
    const { status, nodeIndicator, genesisTime } = this.props;

    const networkName = 'TweedleDee 0.1.0';

    return (
      <WrapperWith2SideBars width={1000} height={500} header="NETWORK" headerIcon={network} subHeader={networkName}>
        <Container>
          <Message color={nodeIndicator.color}>{nodeIndicator.message}</Message>
          <DetailsWrap>
            <DetailsRow>
              <DetailsTextWrap>
                <DetailsText>Age</DetailsText>
                <Tooltip width="250" text="tooltip age" />
              </DetailsTextWrap>
              <GrayText>{getFormattedTimestamp(genesisTime)}</GrayText>
            </DetailsRow>
            <DetailsRow>
              <DetailsTextWrap>
                <DetailsText>Status</DetailsText>
                <Tooltip width="250" text="tooltip Status" />
              </DetailsTextWrap>
              <GrayText>{nodeIndicator.hasError ? this.renderStatus() : this.renderSyncingStatus()}</GrayText>
            </DetailsRow>
            <DetailsRow>
              <DetailsTextWrap>
                <DetailsText>Current Layer</DetailsText>
                <Tooltip width="250" text="tooltip Current Layer" />
              </DetailsTextWrap>
              <GrayText>{status.currentLayer}</GrayText>
            </DetailsRow>
            <DetailsRow>
              <DetailsTextWrap>
                <DetailsText>Verified Layer</DetailsText>
                <Tooltip width="250" text="tooltip Verified Layer" />
              </DetailsTextWrap>
              <GrayText>{status.verifiedLayer}</GrayText>
            </DetailsRow>
            <DetailsRow>
              <DetailsTextWrap>
                <DetailsText>Connection Type</DetailsText>
                <Tooltip width="250" text="tooltip Connection Type" />
              </DetailsTextWrap>
              <GrayText>Managed p2p node</GrayText>
            </DetailsRow>
            <DetailsRow>
              <DetailsTextWrap>
                <DetailsText>Connected neighbors</DetailsText>
                <Tooltip width="250" text="tooltip Connected neighbors" />
              </DetailsTextWrap>
              <GrayText>8</GrayText>
            </DetailsRow>
          </DetailsWrap>
          <FooterWrap>
            <Link onClick={this.navigateToChangeNetwork} text="CHANGE NETWORK" />
            <Tooltip width="250" text="tooltip CHANGE NETWORK" />
            <Link onClick={this.openLogFile} text="BROWSE LOG FILE" style={{ marginLeft: '50px' }} />
            <Tooltip width="250" text="tooltip BROWSE LOG FILE" />
          </FooterWrap>
        </Container>
      </WrapperWith2SideBars>
    );
  }

  renderSyncingStatus = () => {
    const { nodeIndicator, status } = this.props;
    const progress = this.getSyncLabelPercentage(status) / 10;
    return (
      <>
        <NetworkIndicator color={nodeIndicator.color} />
        <ProgressLabel>{nodeIndicator.statusText}</ProgressLabel>
        <ProgressLabel>{this.getSyncLabelPercentage(status)}%</ProgressLabel>
        <ProgressLabel>{`${status.syncedLayer || 0} / ${status.currentLayer}`}</ProgressLabel>
        <Progress>
          <ProgressBar progress={progress} />
        </Progress>
      </>
    );
  };

  renderStatus = () => {
    const { nodeIndicator } = this.props;
    return (
      <>
        <NetworkIndicator color={nodeIndicator.color} />
        <ProgressLabel>{nodeIndicator.statusText}</ProgressLabel>
      </>
    );
  };

  getSyncLabelPercentage = (status) => {
    return `${Math.round((status.syncedLayer * 100) / status.currentLayer)}`;
  };

  openLogFile = () => {
    eventsService.showFileInFolder({ isBackupFile: true });
  };

  navigateToChangeNetwork = () => {
    const { history } = this.props;
    history.push('/main/settings/', { currentSettingIndex: 3 });
  };
}

const mapStateToProps = (state) => ({
  status: state.node.status,
  genesisTime: state.node.genesisTime,
  nodeIndicator: state.node.nodeIndicator
});

Network = connect(mapStateToProps)(Network);
Network = ScreenErrorBoundary(Network);
export default Network;
