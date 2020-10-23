// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Banner } from '/basicComponents';
// import { closePopup } from '/assets/images';
import { smColors } from '/vars';

// const CloseIcon = styled.img`
//   width: 40px;
//   height: 37px;
//   margin: 0 5px;
//   cursor: pointer;
// `;

// <CloseIcon src={closePopup} onClick={closeBanner} />

const Text = styled.div`
  margin: 0 15px;
  font-size: 13px;
  line-height: 17px;
  color: ${smColors.white};
`;

const EmptyBanner = styled.div`
  flex: 0 0 60px;
  position: relative;
  width: 785px;
  height: 60px;
  margin: 30px 0 30px 0;
`;

// const linkStyle = { fontSize: 13, lineHeight: '17px', color: smColors.white };

type Props = {
  nodeIndicator: Object
};

class InfoBanner extends Component<Props> {
  render() {
    const { nodeIndicator } = this.props;

    return nodeIndicator.hasError ? (
      <Banner margin={'30px 0 30px 0'} color={nodeIndicator.color}>
        <Text>{nodeIndicator.message}</Text>
      </Banner>
    ) : (
      <EmptyBanner />
    );
  }
}

const mapStateToProps = (state) => ({
  nodeIndicator: state.node.nodeIndicator
});

InfoBanner = connect<any, any, _, _, _, _>(mapStateToProps)(InfoBanner);

export default InfoBanner;
