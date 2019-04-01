import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { smColors } from '/vars';

const getRandomNumber = (maxValue: number) => Math.floor(Math.random() * Math.floor(maxValue));
const getTimestamp = () => new Date().toUTCString();
const generateLogEntry = (i: number) => {
  return { id: i, text: `${i} - ${getRandomNumber(i * 100)} - ${getTimestamp()} - Test log entry`, isReward: i % getRandomNumber(5) === 0 };
};

const Actionable = css`
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.6;
  }
`;

const LeftPaneRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 22px 0;
  border-bottom: 1px solid ${smColors.borderGray};
  width: inherit;
  height: 62px;
`;

const BaseText = styled.span`
  font-size: 16px;
  font-weight: normal;
  line-height: 22px;
`;

const BoldText = styled(BaseText)`
  font-weight: bold;
`;

const ActionLink = styled(BaseText)`
  user-select: none;
  color: ${smColors.green};
  cursor: pointer;
  ${Actionable}
`;

const LogSection = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: inherit;
  position: relative;
`;

const LogRowSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const LogEntryWrapper = styled.div`
  height: 44px;
  line-height: 44px;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LogRow = styled(LeftPaneRow)`
  border-bottom: none;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
`;

const LogRowInner = styled.div`
  height: 100%;
  width: 100%;
`;

// $FlowStyledIssue
const LogEntry = styled(BaseText)`
  color: ${({ reward }) => (reward ? smColors.green : smColors.black)};
`;

const BottomGradient = styled.div`
  position: absolute;
  width: 100%;
  height: 44px;
  bottom: 0;
  background-image: linear-gradient(transparent, white);
`;

type LogRecord = {
  id: any,
  text: string,
  isReward: boolean
};

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
