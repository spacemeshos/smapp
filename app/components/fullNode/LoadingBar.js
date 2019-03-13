import React from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';
import { BoldText, BaseText } from './FullNodeJointStyles';
import { Loader, CheckDone } from '/basicComponents';

type LoadingBarProps = {
  isLoading: boolean,
  capacity: string,
  status: string
};

// $FlowStyledIssue
const LoadingBarContainer = styled.div`
  border: 1px solid ${smColors.green};
  height: 44px;
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  background-color: ${({ isReady }) => (isReady ? smColors.green : smColors.hoverLightGreen)};
`;

const CapacityWrapper = styled.div`
  border-right: 1px solid ${smColors.borderGray};
  padding: 14px;
`;
const LabelWrapper = styled.div`
  text-align: left;
  padding: 14px 30px;
  flex: 1;
`;
const LoadingSpinnerWrapper = styled.div`
  position: relative;
  padding: 8px;
`;

const CheckDoneWrapper = styled.div`
  padding: 18px;
`;

// $FlowStyledIssue
const CapacityText = styled(BoldText)`
  color: ${({ isReady }) => (isReady ? smColors.white : smColors.green)};
`;

// $FlowStyledIssue
const StatusText = styled(BaseText)`
  color: ${({ isReady }) => (isReady ? smColors.white : smColors.green)};
`;

const LoadingBar = (props: LoadingBarProps) => {
  const { capacity, status, isLoading } = props;
  return (
    <LoadingBarContainer isReady={!isLoading}>
      <CapacityWrapper>
        <CapacityText isReady={!isLoading}>{capacity}</CapacityText>
      </CapacityWrapper>
      <LabelWrapper isReady={!isLoading}>
        <StatusText>{status}</StatusText>
      </LabelWrapper>
      {isLoading && (
        <LoadingSpinnerWrapper>
          <Loader isLoading />
        </LoadingSpinnerWrapper>
      )}
      {!isLoading && (
        <CheckDoneWrapper>
          <CheckDone mode="white" />
        </CheckDoneWrapper>
      )}
    </LoadingBarContainer>
  );
};

export default LoadingBar;
