import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { CorneredContainer } from '../../components/common';
import { Button, Link, DropDown, Loader } from '../../basicComponents';
import { eventsService } from '../../infra/eventsService';
import { AppThDispatch, RootState } from '../../types';
import { setUiError } from '../../redux/ui/actions';
import { ExternalLinks } from '../../../shared/constants';
import { AuthPath } from '../../routerPaths';
import { AuthRouterParams } from './routerParams';
import Steps, { Step } from './Steps';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
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

const SwitchNetwork = ({ history, location }: AuthRouterParams) => {
  const dispatch: AppThDispatch = useDispatch();

  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const networksList = useSelector((state: RootState) => state.networks);
  const [networks, setNetworks] = useState({
    loading: false,
    networks: networksList,
  });
  const [showLoader, setLoader] = useState(false);

  console.log({ networks, networksList });

  const updateNetworks = () => {
    if (networks.loading) return;
    setNetworks({
      loading: true,
      networks: [],
    });
    eventsService
      .listNetworksWithGenesisID()
      .then(({ payload }) => {
        console.log({ payload });
        setNetworks({ loading: false, networks: payload || [] });
      })
      .catch((err) => console.error(err)); // eslint-disable-line no-console
  };

  // Auto request networks list update only on mount:
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(updateNetworks, []);

  const navigateToExplanation = () => window.open(ExternalLinks.SetupGuide);

  const selectItem = ({ index }) => setSelectedItemIndex(index);

  const hasAvailableNetworks = networks.networks.length > 0;
  const getDropDownData = () =>
    // eslint-disable-next-line no-nested-ternary
    networks.loading
      ? [{ label: 'LOADING... PLEASE WAIT', isDisabled: true }]
      : hasAvailableNetworks
      ? networks.networks.map(({ genesisID, netName }) => ({
          label: netName,
          description: genesisID?.length ? `(ID ${genesisID})` : '',
        }))
      : [{ label: 'NO NETWORKS AVAILABLE', isDisabled: true }];

  const goNext = (genesisID: string | undefined) => {
    const { creatingWallet, isWalletOnly, mnemonic } = location.state;
    if (creatingWallet) {
      if (isWalletOnly && genesisID?.length)
        return history.push(AuthPath.ConnectToAPI, {
          redirect: AuthPath.CreateWallet,
          genesisID,
          isWalletOnly,
          creatingWallet,
          mnemonic,
        });
      return history.push(AuthPath.CreateWallet, {
        genesisID,
        isWalletOnly,
        mnemonic,
      });
    }
    if (genesisID?.length && isWalletOnly) {
      return history.push(AuthPath.ConnectToAPI, {
        redirect: location?.state?.redirect,
        genesisID,
        isWalletOnly,
        creatingWallet,
        mnemonic,
      });
    }
    return history.push(location?.state?.redirect || AuthPath.Unlock);
  };

  const handleNext = async () => {
    const genesisID =
      networks.networks.length > selectedItemIndex
        ? networks.networks[selectedItemIndex].genesisID
        : '';
    setLoader(true);
    if (genesisID?.length) {
      try {
        await eventsService.switchNetwork(genesisID);
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
        if (err instanceof Error) {
          dispatch(setUiError(err));
        }
      }
    }

    return goNext(genesisID);
  };

  return showLoader ? (
    <Loader
      size={Loader.sizes.BIG}
      note="Please wait, connecting to Spacemesh network..."
    />
  ) : (
    <Wrapper>
      {!!location.state.creatingWallet && <Steps step={Step.SELECT_NETWORK} />}
      <CorneredContainer
        width={650}
        height={400}
        header="SPACEMESH NETWORK"
        subHeader="Select a public Spacemesh network for your wallet."
        tooltipMessage="test"
      >
        <RowColumn>
          <DropDown
            data={getDropDownData()}
            onClick={selectItem}
            selectedItemIndex={selectedItemIndex}
            rowHeight={40}
            isDisabled={!hasAvailableNetworks}
          />
        </RowColumn>
        <RowColumn>
          {!networks.loading && (
            <Link onClick={updateNetworks} text="REFRESH" />
          )}
        </RowColumn>

        <BottomPart>
          <Link onClick={navigateToExplanation} text="WALLET SETUP GUIDE" />
          {!hasAvailableNetworks && !networks.loading && (
            <Button
              onClick={handleNext}
              text="SKIP"
              isPrimary={false}
              style={{ marginLeft: 'auto', marginRight: '1em' }}
            />
          )}
          <Button
            onClick={handleNext}
            text="NEXT"
            isDisabled={!hasAvailableNetworks}
          />
        </BottomPart>
      </CorneredContainer>
    </Wrapper>
  );
};

export default SwitchNetwork;
