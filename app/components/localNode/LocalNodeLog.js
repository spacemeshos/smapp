// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';

// TODO: remove stub
const getRandomNumber = (maxValue: number) => Math.floor(Math.random() * Math.floor(maxValue));
const getTimestamp = () => new Date().toUTCString();
const generateLogEntry = (i: number) => {
  return { text: `${i} - ${getRandomNumber(i * 100)} - ${getTimestamp()} - Test log entry`, isReward: i % getRandomNumber(5) === 0 };
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  height: 60px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${smColors.borderGray};
`;

const Text = styled.span`
  font-size: 16px;
  line-height: 22px;
`;

const BoldText = styled(Text)`
  font-weight: bold;
`;

const ActionLink = styled(Text)`
  color: ${smColors.green};
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.6;
  }
`;

const LogWrapper = styled.div`
  max-height: 250px;
  overflow-y: scroll;
  overflow-x: hidden;
`;

const LogRow = styled.div`
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

// $FlowStyledIssue
const LogEntry = styled.div`
  font-size: 16px;
  line-height: 30px;
  color: ${({ isSpecial }) => (isSpecial ? smColors.green : smColors.lighterBlack)};
`;

type LogRecord = {
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
      <Wrapper>
        <Header>
          <BoldText>Local Node Log</BoldText>
          <ActionLink>View Full Log</ActionLink>
        </Header>
        <LogWrapper>{this.renderLog(log)}</LogWrapper>
      </Wrapper>
    );
  }

  // TODO: remove stub
  componentDidMount() {
    this.generateLog();
  }

  // TODO: remove stub
  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
  }

  renderLog = (log: LogRecord[]) =>
    log.map<LogRecord>((logEntry: LogRecord): any => (
      <LogRow key={logEntry.text}>
        <LogEntry isSpecial={logEntry.isReward}>{logEntry.text}</LogEntry>
      </LogRow>
    ));

  // TODO: remove stub
  generateLog = () => {
    let i = 0;
    this.timer = setInterval(() => {
      const { log } = this.state;
      this.setState({ log: [generateLogEntry(i), ...log] });
      i += 1;
    }, 3000);
  };
}

export default LocalNodeLog;
