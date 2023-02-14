import React from 'react';
import styled from 'styled-components';
import { CorneredContainer } from '../../components/common';
import { SubHeader } from '../../components/common/CorneredContainer';
import { Button, Link, Tooltip } from '../../basicComponents';
import {
  bigInnerSideBar,
  posSmesher,
  networkPink,
  walletSecond,
} from '../../assets/images';
import { smColors } from '../../vars';
import { AuthPath } from '../../routerPaths';
import { ExternalLinks } from '../../../shared/constants';
import { AuthRouterParams } from './routerParams';

const SideBar = styled.img`
  position: absolute;
  bottom: 0;
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
  background-color: ${({ theme: { color } }) => color.primary};
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 0.66em;
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
  color: ${({ theme: { color } }) => color.primary};
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

const LearnMoreText = styled.div`
  color: ${({ theme: { color } }) => color.primary};
  margin-top: 20px;
  margin-bottom: auto;
`;

const ButtonMargin = styled.div`
  margin-left: 30px;
`;

const SubHeaderExt = styled(SubHeader)`
  margin-bottom: 0;
`;

const Welcome = ({ history }: AuthRouterParams) => {
  const navigateToSetupGuide = () => window.open(ExternalLinks.SetupGuide);

  return (
    <CorneredContainer width={760} height={400} header="WELCOME TO SPACEMESH">
      <SubHeaderExt>
        <RowText>
          <span>
            Thank you for installing the Spacemesh App.
            <br />
            <br />
            <span>Use this app to:</span>
            <br />
          </span>
        </RowText>
      </SubHeaderExt>
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
          <Link
            onClick={() => history.push(AuthPath.Recover)}
            text="OPEN AN EXISTING WALLET"
          />
          <Tooltip width={140} text="Locate a file or restore from 12 words" />
          <ButtonMargin>
            <Button
              text="SETUP"
              onClick={() => history.push(AuthPath.ConnectionType)}
            />
          </ButtonMargin>
        </ComplexLink>
      </BottomPart>
    </CorneredContainer>
  );
};

export default Welcome;
