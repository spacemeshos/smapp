import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { CorneredContainer, BackButton } from '../../components/common';
import { StepsContainer, Button, Link, DropDown } from '../../basicComponents';
import { eventsService } from '../../infra/eventsService';
import { AppThDispatch, RootState } from '../../types';
import { smColors } from '../../vars';
import { setUiError } from '../../redux/ui/actions';
import { AuthRouterParams } from './routerParams';

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

type PublicServicesView = {
  label: string;
  text: string;
  ip: string;
  port: string;
};

const ConnectToApi = ({ history, location }: AuthRouterParams) => {
  const dispatch: AppThDispatch = useDispatch();
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const ddStyle = { border: `1px solid ${isDarkMode ? smColors.black : smColors.white}`, marginLeft: 'auto' };

  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const [publicServices, setPublicServices] = useState({ loading: true, services: [] as PublicServicesView[] });

  useEffect(() => {
    eventsService
      .listPublicServices()
      .then((services) =>
        setPublicServices({
          loading: false,
          services: services.map((service) => ({
            label: service.name,
            text: service.ip,
            ip: service.ip,
            port: service.port
          }))
        })
      )
      .catch((err) => console.error(err)); // eslint-disable-line no-console
  }, []);

  const navigateToExplanation = () => window.open('https://testnet.spacemesh.io/#/guide/setup');

  const selectItem = ({ index }) => setSelectedItemIndex(index);

  const renderAccElement = ({ label, text, isInDropDown }: { label: string; text: string; isInDropDown: boolean }) => (
    <AccItem key={label} isInDropDown={isInDropDown}>
      {text ? (
        <>
          {label} - <DropDownLink>{text}</DropDownLink>
        </>
      ) : (
        label
      )}
    </AccItem>
  );

  const getPublicServicesDropdownData = () => (publicServices.loading ? [{ label: 'LOADING... PLEASE WAIT', isDisabled: true }] : publicServices.services);

  const handleNext = () => {
    const { ip, port } = publicServices.services[selectedItemIndex];
    return eventsService
      .activateWalletManager({ ip, port })
      .then(() => history.push('/auth/wallet-type', { ip, port }))
      .catch((err) => {
        console.error(err); // eslint-disable-line no-console
        dispatch(setUiError(err));
      });
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
            data={getPublicServicesDropdownData()}
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
