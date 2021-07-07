import React from 'react';
import styled from 'styled-components';

import { smColors } from '../../vars';
import { version } from '../../../package.json';

const Container = styled.div`
  position: absolute;
  left: 32px;
  bottom: 25px;
  font-size: 11px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.lightGray : smColors.darkGray)};
`;

const Version = () => <Container>v{version}</Container>;

export default Version;
