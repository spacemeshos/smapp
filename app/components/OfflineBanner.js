// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { checkNodeConnection } from '/redux/node/actions';
import { Link } from '/basicComponents';
import { closePopup } from '/assets/images';
import { smColors } from '/vars';
import type { Action } from '/types';

const Wrapper = styled.div`
  position: absolute;
  top: 10px;
  left: calc(50% - 390px);
  width: 785px;
  height: 60px;
`;

const UpperPart = styled.div`
  position: absolute;
  top: 0;
  left: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: calc(100% - 5px);
  height: 55px;
  background-color: ${smColors.orange};
  z-index: 1;
`;

const LowerPart = styled.div`
  position: absolute;
  top: 5px;
  left: 0;
  width: calc(100% - 5px);
  height: 55px;
  border: 1px solid ${smColors.orange};
`;

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
      <Wrapper>
        <UpperPart>
          <CloseIcon src={closePopup} onClick={closeBanner} />
          <Text>YOU&#39;RE OFFLINE: NODE WON&#39;T BE ABLE TO COMPLETE TRANSACTIONS. TO RECONNECT PLEASE </Text>
          <Link text="CLICK HERE" onClick={checkNodeConnection} style={linkStyle} />
        </UpperPart>
        <LowerPart />
      </Wrapper>
    );
  }
}

const mapDispatchToProps = {
  checkNodeConnection
};

OfflineBanner = connect<any, any, _, _, _, _>(
  null,
  mapDispatchToProps
)(OfflineBanner);

export default OfflineBanner;
