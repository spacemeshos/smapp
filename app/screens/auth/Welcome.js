// @flow
import { shell } from 'electron';
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { CorneredContainer } from '/components/common';
import { Button, Link } from '/basicComponents';
import { bigInnerSideBar, laptop, power, setup, laptopWhite, powerWhite, setupWhite } from '/assets/images';
import { smColors } from '/vars';
import type { RouterHistory } from 'react-router-dom';

const isDarkModeOn = localStorage.getItem('dmMode') === 'true';
const backgroundColor = isDarkModeOn ? smColors.white : smColors.black;
const color = isDarkModeOn ? smColors.white : smColors.black;
const laptopImg = isDarkModeOn ? laptopWhite : laptop;
const powerImg = isDarkModeOn ? powerWhite : power;
const setupImg = isDarkModeOn ? setupWhite : setup;

const SideBar = styled.img`
  position: absolute;
  bottom: 0px;
  right: -30px;
  width: 15px;
  height: 55px;
`;

const Indicator = styled.div`
  position: absolute;
  top: 0;
  left: -30px;
  width: 16px;
  height: 16px;
  background-color: ${backgroundColor};
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 15px;
`;

const Icon = styled.img`
  display: block;
  width: 20px;
  height: 20px;
  margin-right: 15px;
`;

const RowText = styled.span`
  font-size: 16px;
  line-height: 20px;
  color: ${color};
`;

const BottomPart = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 20px;
`;

const ComplexLink = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
`;

const Text = styled.span`
  font-size: 14px;
  line-height: 17px;
  color: ${smColors.disabledGray};
  margin-right: 15px;
`;

const subHeader = (
  <RowText>
    <span>Thank you for downloading the Spacemesh App.</span>
    <br />
    <br />
    <span>This App lets you you join the Spacemesh decentralized Testnet,</span>
    <br />
    <span>use free disk space to earn Smesh, and make Smesh transactions using a built-in wallet.</span>
  </RowText>
);

type Props = {
  history: RouterHistory
};

class Welcome extends PureComponent<Props> {
  render() {
    const { history } = this.props;
    return (
      <CorneredContainer width={760} height={400} header="WELCOME" subHeader={subHeader}>
        <SideBar src={bigInnerSideBar} />
        <Indicator />
        <Row>
          <Icon src={laptopImg} />
          <RowText>Use a desktop computer, not a laptop.</RowText>
        </Row>
        <Row>
          <Icon src={powerImg} />
          <RowText>Leave your desktop computer on 24/7.</RowText>
        </Row>
        <Row>
          <Icon src={setupImg} />
          <RowText>You should start earning Smesh rewards in about 48 hours.</RowText>
        </Row>
        <BottomPart>
          <Link onClick={this.navigateToSetupGuide} text="SETUP GUIDE" />
          {
            // TODO: Spacemesh 0.1 does not offer a wallet-only mode
            // <ComplexLink>
            // eslint-disable-next-line no-irregular-whitespace
            //   <Text>NO DESKTOP?</Text>
            // eslint-disable-next-line no-irregular-whitespace
            //   <Link onClick={() => history.push('/auth/create', { withoutNode: true })} text="SETUP WALLET ONLY" />
            //   <TooltipWrapper>
            //     <TooltipIcon src={tooltip} />
            // eslint-disable-next-line no-irregular-whitespace
            //     <CustomTooltip text="set up only a wallet, you can set up the Smesher later" />
            //   </TooltipWrapper>
            // </ComplexLink>
          }
          <ComplexLink>
            <Text>GOT A WALLET?</Text>
            <Link onClick={() => history.push('/auth/restore')} text="RESTORE WALLET" />
          </ComplexLink>
          <Button text="SETUP" onClick={() => history.push('/auth/create', { withoutNode: false })} />
        </BottomPart>
      </CorneredContainer>
    );
  }

  navigateToSetupGuide = () => shell.openExternal('https://testnet.spacemesh.io/#/guide/setup');
}

export default Welcome;
