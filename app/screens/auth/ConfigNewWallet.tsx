import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { createNewWallet } from '../../redux/wallet/actions';
import { CorneredContainer, BackButton } from '../../components/common';
import { StepsContainer, Input, Button, Link, Loader, ErrorPopup, SmallHorizontalPanel } from '../../basicComponents';
import { eventsService } from '../../infra/eventsService';
import { chevronRightBlack, chevronRightWhite } from '../../assets/images';
import { smColors, nodeConsts } from '../../vars';
import { RootState } from '../../types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const SubHeader = styled.div`
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.realBlack)};
`;

const UpperPart = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
`;

const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 15px;
`;

const Chevron = styled.img`
  width: 8px;
  height: 13px;
  margin-right: 10px;
  align-self: center;
`;

const ErrorSection = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  margin-left: 10px;
`;

const LoaderWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BottomPart = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

interface Props extends RouteComponentProps {
  location: {
    hash: string;
    pathname: string;
    search: string;
    state: { mnemonic?: string; withoutNode?: boolean };
  };
}

const ConfigNewWallet = ({ history, location }: Props) => {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  const navigateToExplanation = () => eventsService.openExternalLink({ link: 'https://testnet.spacemesh.io/#/guide/setup' });

  return (
    <Wrapper>
      <StepsContainer
        steps={['NEW WALLET SETUP', 'NEW WALLET SETUP']}
        header={'SETUP WALLET + SMESHER'}
        currentStep={0}
        isDarkMode={isDarkMode}
      />
      <CorneredContainer width={650} height={400} header="WALLET SETUP" subHeader='Select which features you like to setup' isDarkMode={isDarkMode} >
        <SmallHorizontalPanel isDarkMode={isDarkMode} />
        <BackButton action={history.goBack} />
        <BottomPart>
          <Link onClick={navigateToExplanation} text="WALLET GUIDE" />
          <Button onClick={() => {}} text="NEXT" />
        </BottomPart>
      </CorneredContainer>
    </Wrapper>
  );
};

export default ConfigNewWallet;
