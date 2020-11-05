// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { CorneredContainer } from '/components/common';
import { getFormattedTimestamp, formatSmidge } from '/infra/utils';
import { smColors } from '/vars';
import type { TxList } from '/types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: visible;
  overflow-x: hidden;
  margin-left: 10px;
  padding: 0 10px;
`;

const LogEntry = styled.div`
  display: flex;
  flex-direction: column;
`;

const LogText = styled.div`
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => (theme.isDarkModeOn ? smColors.white : smColors.black)};
`;

const AwardText = styled(LogText)`
  color: ${smColors.green};
`;

const LogEntrySeparator = styled(LogText)`
  margin: 15px 0;
  line-height: 16px;
`;

type Props = {
  initTimestamp: string,
  smeshingTimestamp: string,
  rewards: TxList,
  isDarkModeOn: boolean
};

class SmesherLog extends PureComponent<Props> {
  render() {
    const { initTimestamp, smeshingTimestamp, rewards, isDarkModeOn } = this.props;
    return (
      <CorneredContainer width={310} height={450} header="SMESHER LOG" isDarkModeOn={isDarkModeOn}>
        <Wrapper>
          {initTimestamp ? (
            <>
              <LogEntry>
                <LogText>{initTimestamp}</LogText>
                <LogText>Initializing smesher</LogText>
              </LogEntry>
              <LogEntrySeparator>...</LogEntrySeparator>
            </>
          ) : null}
          {smeshingTimestamp ? (
            <>
              <LogEntry>
                <LogText>{smeshingTimestamp}</LogText>
                <LogText>Started smeshing</LogText>
              </LogEntry>
              <LogEntrySeparator>...</LogEntrySeparator>
            </>
          ) : null}
          {rewards &&
            rewards.map((reward, index) => (
              <div key={`reward${index}`}>
                <LogEntry>
                  <LogText>{getFormattedTimestamp(reward.timestamp)}</LogText>
                  <AwardText>Smeshing reward: {formatSmidge(reward.amount)}</AwardText>
                  <AwardText>Smeshing fee reward: {formatSmidge(reward.fee)}</AwardText>
                </LogEntry>
                <LogEntrySeparator>...</LogEntrySeparator>
              </div>
            ))}
        </Wrapper>
      </CorneredContainer>
    );
  }
}

export default SmesherLog;
