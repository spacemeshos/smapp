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
  font-size: 13px;
  line-height: 17px;
  color: ${smColors.black};
  padding: 5px;
  width: 100%;
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
    text: 'HTTPS://SM.IO/API/V1'
  },
  {
    label: 'SPACEMESH COMMUNITY PUBIC SERVER',
    text: 'HTTPS://SM.IO/API/V2'
  }
];

const ConnectWallet = ({ history }: RouteComponentProps) => {
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const ddStyle = { border: `1px solid ${isDarkMode ? smColors.black : smColors.white}`, marginLeft: 'auto' };

  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const navigateToExplanation = () => eventsService.openExternalLink({ link: 'https://testnet.spacemesh.io/#/guide/setup' });
  const header = 'CONNECT TO SPACEMESH';

  const selectItem = ({ index }) => setSelectedItemIndex(index);

  const renderAccElement = ({ label, text, isInDropDown }: { label: string; text: string; isInDropDown: boolean }) => (
    <AccItem key={label} isInDropDown={isInDropDown}>
      {label} - <DropDownLink>{text}</DropDownLink>
    </AccItem>
  );

  return (
    <Wrapper>
      <StepsContainer steps={['SETUP WALLET', 'SETUP PROF OF SPACE']} header={''} currentStep={1} isDarkMode={isDarkMode} />
      <CorneredContainer
        width={650}
        height={400}
        header={header}
        subHeader="Select a Spacemesh API public service to connect you wallet to."
        tooltipMessage="test"
        isDarkMode={isDarkMode}
      >
        <SmallHorizontalPanel isDarkMode={isDarkMode} />
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
          <Button onClick={() => history.push('/auth/setup-wallet', { withoutNode: true })} text="NEXT" />
        </BottomPart>
      </CorneredContainer>
    </Wrapper>
  );
};

export default ConnectWallet;
