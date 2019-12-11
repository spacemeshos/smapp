// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { checkNodeConnection } from '/redux/node/actions';
import { Banner, Link } from '/basicComponents';
import { closePopup } from '/assets/images';
import { smColors } from '/vars';
import type { Action } from '/types';

const CloseIcon = styled.img`
  width: 40px;
  height: 37px;
  margin: 0 5px;
  cursor: pointer;
`;

const Text = styled.div`
  margin-right: 10px;
  font-size: 13px;
  line-height: 17px;
  color: ${smColors.white};
`;

const linkStyle = { fontSize: 13, lineHeight: '17px', color: smColors.white };

type Props = {
  closeBanner: () => void,
  checkNodeConnection: Action
};

class OfflineBanner extends PureComponent<Props> {
  render() {
    const { closeBanner, checkNodeConnection } = this.props;
    return (
      <Banner color={smColors.orange}>
        <CloseIcon src={closePopup} onClick={closeBanner} />
        <Text>YOU&#39;RE OFFLINE: NODE WON&#39;T BE ABLE TO COMPLETE TRANSACTIONS. TO RECONNECT PLEASE </Text>
        <Link text="CLICK HERE" onClick={checkNodeConnection} style={linkStyle} />
      </Banner>
    );
  }
}

const mapDispatchToProps = {
  checkNodeConnection
};

OfflineBanner = connect<any, any, _, _, _, _>(null, mapDispatchToProps)(OfflineBanner);

export default OfflineBanner;
