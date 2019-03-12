import React from 'react';
import { BaseText, BoldText, StatusSection, StatusRowSection, LeftPaneRow } from './FullNodeJointStyles';

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

const FullNodeStatus = () => {
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

export default FullNodeStatus;
