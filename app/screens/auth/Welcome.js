// @flow
import { shell } from 'electron';
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { CorneredContainer } from '/components/common';
import { Button, Link, Tooltip } from '/basicComponents';
import { bigInnerSideBar, laptop, power, setup, tooltip } from '/assets/images';
import { smColors } from '/vars';
import type { RouterHistory } from 'react-router-dom';

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
  background-color: ${smColors.black};
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
  color: ${smColors.black};
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
  color: ${smColors.darkGray};
  margin-right: 5px;
`;

const TooltipIcon = styled.img`
  width: 13px;
  height: 13px;
`;

const CustomTooltip = styled(Tooltip)`
  top: -2px;
  right: -175px;
`;

// $FlowStyledIssue
const TooltipWrapper = styled.div`
  position: absolute;
  top: -4px;
  right: -14px;
  &:hover ${CustomTooltip} {
    display: block;
  }
`;

const subHeader = (
  <span>
    <span>Thank you for downloading the spacemesh mining app</span>
    <br />
    <span>This app will be use free disk space from your computer to mine SMC,</span>
    <br />
    <span>so you can make transactions and test our technology</span>
    <br />
    <span>We`re happy to have you on our testnet</span>
  </span>
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
          <Icon src={laptop} />
          <RowText>Don&#39;t use a laptop, only use a desktop</RowText>
        </Row>
        <Row>
          <Icon src={power} />
          <RowText>Leave your desktop on 24/7, at least until setup is fully complete</RowText>
        </Row>
        <Row>
          <Icon src={setup} />
          <RowText>Setup will use the GPU and may take up to 48 hours</RowText>
        </Row>
        <BottomPart>
          <Link onClick={this.navigateToSetupGuide} text="SETUP GUIDE" />
          <ComplexLink>
            <Text>NO DESKTOP?</Text>
            <Link onClick={() => history.push('/auth/create', { withoutNode: true })} text="SETUP WALLET ONLY" />
            <TooltipWrapper>
              <TooltipIcon src={tooltip} />
              <CustomTooltip text="set up a light version now, you can set up the miner later" />
            </TooltipWrapper>
          </ComplexLink>
          <ComplexLink>
            <Text>GOT A WALLET?</Text>
            <Link onClick={() => history.push('/auth/restore')} text="RESTORE HERE" />
          </ComplexLink>
          <Button text="SETUP" onClick={() => history.push('/auth/create', { withoutNode: false })} />
        </BottomPart>
      </CorneredContainer>
    );
  }

  navigateToSetupGuide = () => shell.openExternal('https://testnet.spacemesh.io/#/guide/setup');
}

export default Welcome;
