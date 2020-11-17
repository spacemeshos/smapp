import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { Banner } from '../../basicComponents';
import { smColors } from '../../vars';
import { RootState } from '../../types';

const Text = styled.div`
  margin: 0 15px;
  font-size: 13px;
  line-height: 17px;
  color: ${smColors.white};
`;

const InfoBanner = () => {
  const nodeIndicator = useSelector((state: RootState) => state.node.nodeIndicator);
  return (
    <Banner margin={'30px 0 30px 0'} color={nodeIndicator.color} visibility={!!nodeIndicator.hasError}>
      <Text>{nodeIndicator.message}</Text>
    </Banner>
  );
};

export default InfoBanner;
