// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { getTotalEarnings, getUpcomingEarnings } from '/redux/localNode/actions';
import { smColors } from '/vars';
import type { Action } from '/types';

const formatNumber = (num?: number) => {
  if (!num) {
    return 0;
  }
  const formatter = new Intl.NumberFormat();
  return formatter.format(num);
};

const getCounterText = (counter: number) => {
  const days = Math.floor(counter / 1440);
  const hours = Math.floor(counter / 60) % 24;
  const minutes = counter % 60;
  return `${days} days, ${hours} hours, ${minutes} minutes`;
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;
`;

const Row = styled.div`
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid ${smColors.borderGray};
  &: first-child {
    border-top: 1px solid ${smColors.borderGray};
  }
`;

const Text = styled.div`
  flex: 1;
  font-size: 16px;
  color: ${smColors.darkGray};
  line-height: 22px;
`;

const LeftText = styled(Text)`
  font-weight: bold;
`;

type Props = {
  minutesRunning: number, // TODO: connect this with actual logic for time passed
  awardsDueIn: number, // TODO: connect this with actual logic for next reward layer time - genesis time
  getTotalEarnings: Action,
  getUpcomingEarnings: Action,
  totalEarnings: number,
  upcomingEarnings: number
};

class LocalNodeStatus extends Component<Props> {
  render() {
    const { totalEarnings, upcomingEarnings, minutesRunning, awardsDueIn } = this.props;

    return (
      <Wrapper>
        <Row>
          <LeftText>Total Time Running</LeftText>
          <Text>{getCounterText(minutesRunning || 0)}</Text>
        </Row>
        <Row>
          <LeftText>Total earnings</LeftText>
          <Text>{`${formatNumber(totalEarnings)} Spacemesh coins`}</Text>
        </Row>
        <Row>
          <LeftText>Upcoming earnings</LeftText>
          <Text>{`${formatNumber(upcomingEarnings)} Spacemesh coins${awardsDueIn ? ` (due in ${awardsDueIn} days)` : ''}`}</Text>
        </Row>
      </Wrapper>
    );
  }

  componentDidMount() {
    const { getTotalEarnings, getUpcomingEarnings } = this.props;
    getTotalEarnings();
    getUpcomingEarnings();
  }
}

const mapStateToProps = (state) => ({
  totalEarnings: state.localNode.totalEarnings,
  upcomingEarnings: state.localNode.upcomingEarnings
});

const mapDispatchToProps = {
  getTotalEarnings,
  getUpcomingEarnings
};

LocalNodeStatus = connect(
  mapStateToProps,
  mapDispatchToProps
)(LocalNodeStatus);

export default LocalNodeStatus;
