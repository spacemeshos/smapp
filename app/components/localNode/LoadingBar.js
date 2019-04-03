import React from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';
import { Loader, CheckIcon } from '/basicComponents';

// $FlowStyledIssue
const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  border: 1px solid ${smColors.darkGreen};
  background-color: ${({ isLoading }) => (isLoading ? smColors.hoverLightGreen : smColors.green)};
`;

// $FlowStyledIssue
const CapacityText = styled.div`
  font-size: 16px;
  line-height: 22px;
  font-weight: bold;
  color: ${({ isLoading }) => (isLoading ? smColors.green : smColors.white)};
  padding: 0 20px 0 10px;
  border-right: 1px solid ${smColors.borderGray};
`;

// $FlowStyledIssue
const StatusText = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${({ isLoading }) => (isLoading ? smColors.green : smColors.white)};
  text-align: center;
  padding: 0 25px;
`;

const IconWrapper = styled.div`
  margin-left: auto;
  margin-right: 15px;
`;

const CheckIconEnlarged = styled(CheckIcon)`
  height: 16px;
  width: 20px;
`;

type LoadingBarProps = {
  isLoading: boolean,
  capacity: string,
  status: string
};

const LoadingBar = (props: LoadingBarProps) => {
  const { capacity, status, isLoading } = props;
  return (
    <Wrapper isLoading={isLoading}>
      <CapacityText isLoading={isLoading}>{capacity}</CapacityText>
      <StatusText isLoading={isLoading}>{status}</StatusText>
      <IconWrapper>{isLoading ? <Loader /> : <CheckIconEnlarged mode="white" />}</IconWrapper>
    </Wrapper>
  );
};

export default LoadingBar;
