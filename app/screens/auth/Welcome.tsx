import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router-dom';
import { CorneredContainer } from '../../components/common';
import { Button, Link } from '../../basicComponents';
import { bigInnerSideBar, laptop, power, setup, laptopWhite, powerWhite, setupWhite } from '../../assets/images';
import { smColors } from '../../vars';
import { RootState } from '../../types';
import { eventsService } from '../../infra/eventsService';

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
  background-color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
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
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
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

const Welcome = ({ history }: RouteComponentProps) => {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  const navigateToSetupGuide = () => eventsService.openExternalLink({ link: 'https://testnet.spacemesh.io/#/guide/setup' });

  const laptopImg = isDarkMode ? laptopWhite : laptop;
  const powerImg = isDarkMode ? powerWhite : power;
  const setupImg = isDarkMode ? setupWhite : setup;

  return (
    <CorneredContainer width={760} height={400} header="WELCOME" subHeader={subHeader} isDarkMode={isDarkMode}>
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
        <Link onClick={navigateToSetupGuide} text="SETUP GUIDE" />
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
};

export default Welcome;
