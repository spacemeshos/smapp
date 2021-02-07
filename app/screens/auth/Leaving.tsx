import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { CorneredContainer, BackButton } from '../../components/common';
import { Button, Link, Tooltip } from '../../basicComponents';
import { eventsService } from '../../infra/eventsService';
import { bigInnerSideBar } from '../../assets/images';

import { smColors } from '../../vars';
import { RootState } from '../../types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const ComplexLink = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  justify-content: space-between;
  flex: 1;
  margin-right: 10px;
`;

const Text = styled.span`
  font-size: 14px;
  line-height: 17px;
  color: ${smColors.disabledGray};
  margin-right: 0px;
`;

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
  align-items: baseline;
`;

const BottomPart = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

const Leaving = ({ history }: RouteComponentProps) => {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  const navigateToSetupGuide = () => eventsService.openExternalLink({ link: 'https://testnet.spacemesh.io/#/guide/setup' });

  const header = 'LEAVING SETUP';

  return (
    <Wrapper>
      <CorneredContainer width={760} height={400} header={header} subHeader="Are you sure you want to quit the setup?" isDarkMode={isDarkMode}>
        <SideBar src={bigInnerSideBar} />
        <Indicator />
        <BackButton action={history.goBack} />
        <BottomPart>
          <ComplexLink>
            <Link onClick={navigateToSetupGuide} text="SETUP GUIDE" />
            <Row>
              <Text>DON`T HAVE A DESKTOP?</Text>
              <Link onClick={() => history.push('/auth/restore')} text="SETUP WALLET ONLY" />
              <Tooltip width={100} text="SETUP WALLET ONLY" isDarkMode={isDarkMode} />
            </Row>
          </ComplexLink>
          <Button text="LEAVE SETUP" onClick={() => history.push('/auth/welcome', { withoutNode: false })} />
        </BottomPart>
      </CorneredContainer>
    </Wrapper>
  );
};

export default Leaving;
