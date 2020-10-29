import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Banner } from '/basicComponents';
import { smColors } from '/vars';

const Text = styled.div`
  margin: 0 15px;
  font-size: 13px;
  line-height: 17px;
  color: ${smColors.white};
`;

type Props = {
  nodeIndicator: { hasError: boolean, color: string, message: string }
};

const InfoBanner = ({ nodeIndicator }: Props) => (
  <Banner margin={'30px 0 30px 0'} color={nodeIndicator.color} visibility={nodeIndicator.hasError}>
    <Text>{nodeIndicator.message}</Text>
  </Banner>
);

const mapStateToProps = (state) => ({
  nodeIndicator: state.node.nodeIndicator
});

const ConnectedInfoBanner = connect(mapStateToProps)(InfoBanner);

export default ConnectedInfoBanner;
