import React from 'react';
import styled from 'styled-components';
import { Banner } from '../../basicComponents';
import { smColors } from '../../vars';

const Text = styled.div`
  margin: 0 15px;
  font-size: 13px;
  line-height: 17px;
  color: ${smColors.white};
`;

const InfoBanner = () => (
  <Banner margin={'30px 0 30px 0'} color={smColors.red}>
    <Text>Offline. Please quit and start the app again.</Text>
  </Banner>
);

export default InfoBanner;
