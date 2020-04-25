// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Banner } from '/basicComponents';
import { smColors } from '/vars';

const Text = styled.div`
  flex: 1;
  font-size: 13px;
  line-height: 17px;
  color: ${smColors.white};
  text-align: center;
`;

type Props = {};

class LoggedOutBanner extends PureComponent<Props> {
  render() {
    return (
      <Banner margin={'0 0 30px 0'} color={smColors.blue}>
        <Text>YOU ARE LOGGED OUT FROM YOUR WALLET</Text>
      </Banner>
    );
  }
}

export default LoggedOutBanner;
