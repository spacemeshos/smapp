import React, { Component } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';
import { BoldText, LeftPaneRow, ActionLink, BaseText } from './LocalNodeCommonComponents';

type LogRecord = {
  id: any,
  text: string,
  isReward: boolean
};

const getRandomNumber = (maxValue: number) => Math.floor(Math.random() * Math.floor(maxValue));
const getTimestamp = () => new Date().toUTCString();
const generateLogEntry = (i: number) => {
  return { id: i, text: `${i} - ${getRandomNumber(i * 100)} - ${getTimestamp()} - Test log entry`, isReward: i % getRandomNumber(5) === 0 };
};

export const LogSection = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: inherit;
  position: relative;
`;

export const LogRowSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

export const LogEntryWrapper = styled.div`
  height: 44px;
  line-height: 44px;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const LogRow = styled(LeftPaneRow)`
  border-bottom: none;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
`;

export const LogRowInner = styled.div`
  height: 100%;
  width: 100%;
`;

// $FlowStyledIssue
export const LogEntry = styled(BaseText)`
  color: ${({ reward }) => (reward ? smColors.green : smColors.black)};
`;

export const BottomGradient = styled.div`
  position: absolute;
  width: 100%;
  height: 44px;
  bottom: 0;
  background-image: linear-gradient(transparent, white);
`;

class LocalNodeLog extends Component<{}, { log: LogRecord[] }> {
  timer: any;

  state = {
    log: []
  };

  render() {
    const { log } = this.state;
    return (
      <LogSection>
        <LeftPaneRow>
          <LogRowSection>
            <BoldText>Local Node Log</BoldText>
            <ActionLink>View Full Log</ActionLink>
          </LogRowSection>
        </LeftPaneRow>
        {this.renderLog(log)}
        <BottomGradient />
      </LogSection>
    );
  }

  componentDidMount() {
    this.generateLog(); // TODO: remove stab
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer); // TODO: remove stab
    }
  }

  renderLog = (log: LogRecord[]) => (
    <LogRow>
      <LogRowInner>
        {log.map((logEntry: LogRecord) => (
          <LogEntryWrapper key={logEntry.id}>
            <LogEntry reward={logEntry.isReward}>{logEntry.text}</LogEntry>
          </LogEntryWrapper>
        ))}
      </LogRowInner>
    </LogRow>
  );

  // TODO: remove stab
  generateLog = () => {
    let i = 0;
    this.timer = setInterval(() => {
      this.setState((prevState) => {
        return { log: [generateLogEntry(i), ...prevState.log] };
      });
      i += 1;
    }, 3000);
  };
}

export default LocalNodeLog;
