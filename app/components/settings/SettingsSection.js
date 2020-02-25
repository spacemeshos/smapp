// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { topLeftCorner, topRightCorner, bottomLeftCorner, bottomRightCorner } from '/assets/images';
import smColors from '/vars/colors';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  padding: 30px;
  background-color: ${smColors.black02Alpha};
`;

const TopLeftCorner = styled.img`
  position: absolute;
  top: -8px;
  left: -8px;
  width: 8px;
  height: 8px;
`;

const TopRightCorner = styled.img`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 8px;
  height: 8px;
`;

const BottomLeftCorner = styled.img`
  position: absolute;
  bottom: -8px;
  left: -8px;
  width: 8px;
  height: 8px;
`;

const BottomRightCorner = styled.img`
  position: absolute;
  bottom: -8px;
  right: -8px;
  width: 8px;
  height: 8px;
`;

const Header = styled.div`
  font-size: 42px;
  line-height: 55px;
  color: ${smColors.realBlack};
`;

const SubHeader = styled.div`
  font-size: 20px;
  line-height: 30px;
  color: ${smColors.realBlack};
  margin-bottom: 20px;
`;

type Props = {
  title: string,
  refProp: Object,
  children: any
};

class SettingsSection extends PureComponent<Props> {
  render() {
    const { refProp, title, children } = this.props;
    return (
      <Wrapper ref={refProp}>
        <Header>{title}</Header>
        <SubHeader>--</SubHeader>
        <TopLeftCorner src={topLeftCorner} />
        <TopRightCorner src={topRightCorner} />
        <BottomLeftCorner src={bottomLeftCorner} />
        <BottomRightCorner src={bottomRightCorner} />
        {children}
      </Wrapper>
    );
  }
}

export default SettingsSection;
