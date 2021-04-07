import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router-dom';
import { CorneredContainer } from '../../components/common';
import { Button, Link, Tooltip } from '../../basicComponents';
import { eventsService } from '../../infra/eventsService';
import { bigInnerSideBar, posSmesher, networkPink, walletSecond } from '../../assets/images';
import { smColors } from '../../vars';
import { RootState } from '../../types';

const SideBar = styled.img`
  position: absolute;
  bottom: 0px;
  right: -40px;
  width: 25px;
  height: 140px;
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
  align-items: flex-end;
  position: relative;
`;

const LinkText = styled.span`
  color: ${smColors.blue};
  text-decoration: underline;
  margin-right: 15px;
  cursor: pointer;
  &:hover {
    color: ${smColors.darkerBlue};
  }
`;

const GreenText = styled.span`
  color: ${smColors.green};
  margin-left: 15px;
`;

const LearnMoreText = styled.div`
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
  margin-top: 20px;
`;

const ButtonMargin = styled.div`
  margin-left: 30px;
`;

const subHeader = (
  <RowText>
    <span>
      Thank you for installing the Spacemesh App for
      <GreenText>TweedleDee Testnet 0.1.0</GreenText>
      <br />
      <br />
      <span>Use this app to:</span>
      <br />
    </span>
  </RowText>
);

const Welcome = ({ history }: RouteComponentProps) => {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  const navigateToSetupGuide = () => eventsService.openExternalLink({ link: 'https://testnet.spacemesh.io/#/guide/setup' });

  return (
    <CorneredContainer width={760} height={400} header="WELCOME TO SPACEMESH" subHeader={subHeader} isDarkMode={isDarkMode}>
      <SideBar src={bigInnerSideBar} />
      <Indicator />
      <Row>
        <Icon src={walletSecond} />
        <RowText>Set up a wallet,</RowText>
      </Row>
      <Row>
        <Icon src={networkPink} />
        <RowText>join a network,</RowText>
      </Row>
      <Row>
        <Icon src={posSmesher} />
        <RowText>smesh and more</RowText>
      </Row>
      <LearnMoreText>
        <LinkText onClick={navigateToSetupGuide}>click here</LinkText>
        to learn more.
      </LearnMoreText>
      <BottomPart>
        <Link onClick={navigateToSetupGuide} text="SETUP GUIDE" />
        <ComplexLink>
          <Link onClick={() => history.push('/auth/restore')} text="RESTORE AN EXISTING WALLET" />
          <Tooltip width={250} text="tooltip" isDarkMode={isDarkMode} />
          <ButtonMargin>
            <Button text="SETUP" onClick={() => history.push('/auth/wallet-connection-type')} />
          </ButtonMargin>
        </ComplexLink>
      </BottomPart>
    </CorneredContainer>
  );
};

export default Welcome;
