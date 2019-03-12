import React, { Component } from 'react';
import { BoldText, LogSection, LogRowSection, LogRow, LogEntryWrapper, LogEntry, LogRowInner, LeftPaneRow, ActionLink } from './FullNodeJointStyles';

export type LogRecord = {
  id: any,
  text: string,
  isReward: boolean
};

const getRandomNumber = (maxValue: numbner) => Math.floor(Math.random() * Math.floor(maxValue));
const getTimestamp = () => new Date().toUTCString();
const generateLogEntry = (i: number) => {
  return { id: i, text: `${i} - ${getRandomNumber(i * 100)} - ${getTimestamp()} - Test log entry`, isReward: i % getRandomNumber(5) === 0 };
};

class FullNodeLog extends Component<{}, { log: LogRecord[] }> {
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
            <BoldText>Full Node Log</BoldText>
            <ActionLink>View Full Log</ActionLink>
          </LogRowSection>
        </LeftPaneRow>
        {this.renderLog(log)}
      </LogSection>
    );
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

  componentDidMount() {
    this.generateLog();
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  // Test stub
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

export default FullNodeLog;
