import React from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';

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
