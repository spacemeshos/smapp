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

// const linkStyle = { fontSize: 13, lineHeight: '17px', color: smColors.white };

type Props = {
  status: Object
};

class InfoBanner extends Component<Props> {
  startUpDelay = 5; // eslint-disable-line react/sort-comp

  noPeersCounter = 0; // eslint-disable-line react/sort-comp

  render() {
    const { status } = this.props;
    let color;
    let text;
    if (!status) {
      if (this.startUpDelay === 15) {
        color = smColors.red;
        text = 'Offline. Please quit and start the app again.';
      }
    } else if (!status.peers) {
      this.startUpDelay = 0;
      if (this.noPeersCounter === 15) {
        color = smColors.red;
        text = "Can't connect to the p2p network.";
      } else {
        color = smColors.orange;
        text = 'Connecting to the p2p network...';
        this.noPeersCounter += 1;
      }
    } else if (!status.synced) {
      this.startUpDelay = 0;
      this.noPeersCounter = 0;
      color = smColors.orange;
      text = `Syncing the mesh... Layer ${status.syncedLayer || 0} / ${status.currentLayer}`;
    } else {
      this.startUpDelay = 0;
      this.noPeersCounter = 0;
      color = smColors.blue;
      text = `Synced with the mesh. Current layer ${status.currentLayer}. Verified layer ${status.verifiedLayer}`;
    }
    return color ? (
      <Banner top={20} color={color}>
        <Text>{text}</Text>
      </Banner>
    ) : null;
  }

  shouldComponentUpdate(nextProps: Props) {
    const { status } = this.props;
    if (status === null && nextProps.status === null) {
      this.startUpDelay += 1;
    }
    return nextProps.status !== status || this.startUpDelay === 15;
  }
}

const mapStateToProps = (state) => ({
  status: state.node.status
});

InfoBanner = connect<any, any, _, _, _, _>(mapStateToProps)(InfoBanner);

export default InfoBanner;
