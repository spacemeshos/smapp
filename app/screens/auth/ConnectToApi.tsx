import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { CorneredContainer, BackButton } from '../../components/common';
import { StepsContainer, Button, Link, SmallHorizontalPanel, DropDown } from '../../basicComponents';
import { eventsService } from '../../infra/eventsService';
import { RootState } from '../../types';
import { smColors } from '../../vars';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const DropDownLink = styled.span`
  color: ${smColors.blue};
  cursor: pointer;
`;

const RowColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const BottomPart = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

const AccItem = styled.div<{ isInDropDown: boolean }>`
  width: 100%;
  padding: 5px;
  line-height: 17px;
  font-size: 13px;
  text-transform: uppercase;
  color: ${smColors.black};
  cursor: inherit;
  ${({ isInDropDown }) => isInDropDown && `opacity: 0.5; border-bottom: 1px solid ${smColors.disabledGray};`}
  &:hover {
    opacity: 1;
    color: ${smColors.darkGray50Alpha};
  }
`;

const publicServices = [
  {
    label: 'SPACEMESH COMMUNITY PUBIC SERVER',
    text: 'HTTPS://SM.IO/API/V1',
    ip: 'https://sm.io/api/v1',
    port: ''
  },
  {
    label: 'SPACEMESH COMMUNITY PUBIC SERVER',
    text: 'HTTPS://SM.IO/API/V2',
    ip: 'https://sm.io/api/v2',
    port: ''
  }
];

const ConnectToApi = ({ history }: RouteComponentProps) => {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const ddStyle = { border: `1px solid ${isDarkMode ? smColors.black : smColors.white}`, marginLeft: 'auto' };

  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const navigateToExplanation = () => window.open('https://testnet.spacemesh.io/#/guide/setup');

  const selectItem = ({ index }) => setSelectedItemIndex(index);

  const renderAccElement = ({ label, text, isInDropDown }: { label: string; text: string; isInDropDown: boolean }) => (
    <AccItem key={label} isInDropDown={isInDropDown}>
      {label} - <DropDownLink>{text}</DropDownLink>
    </AccItem>
  );

  const handleNext = async () => {
    const response = await eventsService.activateWalletManager({ ip: publicServices[selectedItemIndex].text, port: '' });
    if (response.activated) {
      const { ip, port } = publicServices[selectedItemIndex];
      history.push('/auth/wallet-type', { ip, port });
    } else {
      throw response.error;
    }
  };

  return (
    <Wrapper>
      <StepsContainer steps={['NEW WALLET SETUP', 'NEW WALLET TYPE', 'PROTECT WALLET']} currentStep={0} isDarkMode={isDarkMode} />
      <CorneredContainer
        width={650}
        height={400}
        header="CONNECT TO SPACEMESH"
        subHeader="Select a Spacemesh API public service to connect you wallet to."
        tooltipMessage="test"
        isDarkMode={isDarkMode}
      >
        <RowColumn>
          <DropDown
            data={publicServices}
            onClick={selectItem}
            DdElement={({ label, text, isMain }) => renderAccElement({ label, text, isInDropDown: !isMain })}
            selectedItemIndex={selectedItemIndex}
            rowHeight={40}
            style={ddStyle}
            bgColor={smColors.white}
          />
        </RowColumn>

        <BackButton action={history.goBack} />
        <BottomPart>
          <Link onClick={navigateToExplanation} text="WALLET SETUP GUIDE" />
          <Button onClick={handleNext} text="NEXT" />
        </BottomPart>
      </CorneredContainer>
    </Wrapper>
  );
};

export default ConnectToApi;
