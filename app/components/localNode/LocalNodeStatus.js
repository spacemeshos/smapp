import React from 'react';
import styled from 'styled-components';
import { BaseText, BoldText, LeftPaneRow } from './LocalNodeCommonComponents';

const StatusSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
`;

const StatusRowSection = styled.div`
  width: 50%;
`;

// Test stub
const getTotalTimeRunning = () => {
  return '0 days, 0 hours, 1 minutes';
};

// Test stub
const getTotalEarnings = () => {
  return '0 Spacemesh coins';
};

// Test stub
const getUpcomingEarnings = () => {
  return '3 Spacemesh coins (due in 2 days)';
};

const LocalNodeStatus = () => {
  return (
    <StatusSection>
      <LeftPaneRow>
        <StatusRowSection>
          <BoldText>Total Time Running</BoldText>
        </StatusRowSection>
        <StatusRowSection>
          <BaseText>{getTotalTimeRunning()}</BaseText>
        </StatusRowSection>
      </LeftPaneRow>
      <LeftPaneRow>
        <StatusRowSection>
          <BoldText>Total earnings</BoldText>
        </StatusRowSection>
        <StatusRowSection>
          <BaseText>{getTotalEarnings()}</BaseText>
        </StatusRowSection>
      </LeftPaneRow>
      <LeftPaneRow>
        <StatusRowSection>
          <BoldText>Upcoming earnings</BoldText>
        </StatusRowSection>
        <StatusRowSection>
          <BaseText>{getUpcomingEarnings()}</BaseText>
        </StatusRowSection>
      </LeftPaneRow>
    </StatusSection>
  );
};

export default LocalNodeStatus;
