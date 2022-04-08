import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { CorneredContainer } from '../../components/common';
import { Button, Link, DropDown, Loader } from '../../basicComponents';
import { eventsService } from '../../infra/eventsService';
import { AppThDispatch, RootState } from '../../types';
import { smColors } from '../../vars';
import { setUiError } from '../../redux/ui/actions';
import { getNetworkDefinitions } from '../../redux/network/actions';
import { AuthPath } from '../../routerPaths';
import { AuthRouterParams } from './routerParams';
import Steps, { Step } from './Steps';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const DropDownLink = styled.a`
  color: ${smColors.blue};
  cursor: pointer;
`;

const RowColumn = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1em;
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

const SwitchNetwork = ({ history, location }: AuthRouterParams) => {
  const dispatch: AppThDispatch = useDispatch();
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const ddStyle = { border: `1px solid ${isDarkMode ? smColors.black : smColors.white}`, marginLeft: 'auto' };

  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [networks, setNetworks] = useState({ loading: false, networks: [] as { netId: number; netName: string; explorer?: string }[] });
  const [showLoader, setLoader] = useState(false);

  const updateNetworks = () => {
    if (networks.loading) return;
    setNetworks({
      loading: true,
      networks: [],
    });
    eventsService
      .listNetworks()
      .then((nets) =>
        setNetworks({
          loading: false,
          networks: nets,
        })
      )
      .catch((err) => console.error(err)); // eslint-disable-line no-console
  };

  // Auto request networks list update only on mount:
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(updateNetworks, []);

  const navigateToExplanation = () => window.open('https://testnet.spacemesh.io/#/guide/setup');

  const selectItem = ({ index }) => setSelectedItemIndex(index);

  const openExplorer = (explorer: string) => {
    window.open(explorer.concat(isDarkMode ? '?dark' : ''), '_blank');
  };

  const renderAccElement = ({ label, explorer, netId, isMain }: { label: string; explorer: string; netId: number; isMain: boolean }) => (
    <AccItem key={label} isInDropDown={!isMain}>
      {netId > 0 ? (
        <>
          {label}
          (ID&nbsp;
          <DropDownLink onClick={() => openExplorer(explorer)} target="_blank">
            {netId}
          </DropDownLink>
          )
        </>
      ) : (
        label
      )}
    </AccItem>
  );

  const hasAvailableNetworks = networks.networks.length > 0;
  const getDropDownData = () =>
    // eslint-disable-next-line no-nested-ternary
    networks.loading
      ? [{ label: 'LOADING... PLEASE WAIT', netId: -1, isDisabled: true }]
      : hasAvailableNetworks
      ? networks.networks.map(({ netId, netName, explorer }) => ({ label: netName, netId, explorer }))
      : [{ label: 'NO NETWORKS AVAILABLE', netId: -1, isDisabled: true }];

  const goNext = (netId: number) => {
    const { creatingWallet, isWalletOnly } = location.state;
    if (creatingWallet) {
      if (netId === -1) return history.push(AuthPath.CreateWallet, { netId, isWalletOnly });
      if (isWalletOnly) return history.push(AuthPath.ConnectToAPI, { redirect: AuthPath.CreateWallet, netId, isWalletOnly, creatingWallet });
      return history.push(AuthPath.CreateWallet, { netId, isWalletOnly });
    }
    if (netId > -1 && isWalletOnly) {
      return history.push(AuthPath.ConnectToAPI, { redirect: location?.state?.redirect, netId, isWalletOnly, creatingWallet });
    }
    return history.push(location?.state?.redirect || AuthPath.Unlock);
  };

  const handleNext = async () => {
    const netId = networks.networks.length > selectedItemIndex ? networks.networks[selectedItemIndex].netId : -1;
    setLoader(true);
    if (netId > -1) {
      try {
        await eventsService.switchNetwork(netId);
        await dispatch(getNetworkDefinitions());
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
        if (err instanceof Error) {
          dispatch(setUiError(err));
        }
      }
    }
    return goNext(netId);
  };

  return showLoader ? (
    <Loader size={Loader.sizes.BIG} isDarkMode={isDarkMode} note="Please wait, connecting to Spacemesh network..." />
  ) : (
    <Wrapper>
      {!!location.state.creatingWallet && <Steps step={Step.SELECT_NETWORK} isDarkMode={isDarkMode} />}
      <CorneredContainer
        width={650}
        height={400}
        header="SPACEMESH NETWORK"
        subHeader="Select a public Spacemesh network for your wallet."
        tooltipMessage="test"
        isDarkMode={isDarkMode}
      >
        <RowColumn>
          <DropDown
            data={getDropDownData()}
            onClick={selectItem}
            DdElement={renderAccElement}
            selectedItemIndex={selectedItemIndex}
            rowHeight={40}
            style={ddStyle}
            bgColor={smColors.white}
            isDisabled={!hasAvailableNetworks}
          />
        </RowColumn>
        <RowColumn>{!networks.loading && <Link onClick={updateNetworks} text="REFRESH" />}</RowColumn>

        <BottomPart>
          <Link onClick={navigateToExplanation} text="WALLET SETUP GUIDE" />
          {!hasAvailableNetworks && !networks.loading && <Button onClick={handleNext} text="SKIP" isPrimary={false} style={{ marginLeft: 'auto', marginRight: '1em' }} />}
          <Button onClick={handleNext} text="NEXT" isDisabled={!hasAvailableNetworks} />
        </BottomPart>
      </CorneredContainer>
    </Wrapper>
  );
};

export default SwitchNetwork;
