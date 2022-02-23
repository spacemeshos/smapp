import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { eventsService } from '../../infra/eventsService';
import { getCurrentLayer, getNetworkDefinitions } from '../../redux/network/actions';
import { NetworkStatus } from '../../components/NetworkStatus';
import { WrapperWith2SideBars, Link, Tooltip, CustomTimeAgo, Button } from '../../basicComponents';
import { smColors } from '../../vars';
import { network } from '../../assets/images';
import { RootState } from '../../types';
import { getRemoteApi, isWalletOnly } from '../../redux/wallet/selectors';
import ErrorMessage from '../../basicComponents/ErrorMessage';
import SubHeader from '../../basicComponents/SubHeader';
import { goToSwitchNetwork } from '../../routeUtils';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  flex: 1;
`;

const DetailsWrap = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
`;

const DetailsRow = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: ${({ theme }) => `1px solid ${theme.isDarkMode ? smColors.white : smColors.darkGray10Alpha};`};
  &:last-child {
    border-bottom-color: transparent;
  }
`;

const DetailsText = styled.div`
  font-size: 16px;
  line-height: 20px;
  margin: 10px 0;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.realBlack)};
`;

const GrayText = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 14px;
  text-transform: uppercase;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.dark75Alpha)};
`;

const DetailsTextWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Network = ({ history }) => {
  const dispatch = useDispatch();

  const isWalletMode = useSelector(isWalletOnly);
  const status = useSelector((state: RootState) => state.node.status);
  const nodeError = useSelector((state: RootState) => state.node.error);
  const netId = useSelector((state: RootState) => state.network.netId || -1);
  const netName = useSelector((state: RootState) => state.network.netName || 'UNKNOWN NETWORK NAME');

  useEffect(() => {
    if (netId > -1) {
      dispatch(getCurrentLayer());
      dispatch(getNetworkDefinitions());
    }
  }, [netId, dispatch]);

  const genesisTime = useSelector((state: RootState) => state.network.genesisTime);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const remoteApi = useSelector(getRemoteApi);
  const [isRestarting, setRestarting] = useState(false);

  const requestNodeRestart = useCallback(async () => {
    setRestarting(true);
    await eventsService.restartNode();
    setRestarting(false);
  }, []);

  const requestSwitchApiProvider = () => {
    history.push('/auth/connect-to-api');
  };

  const renderActionButton = () => {
    if (!nodeError) return null;

    return isWalletMode ? (
      <Button text="SWITCH API PROVIDER" width={150} isPrimary onClick={requestSwitchApiProvider} style={{ marginLeft: 'auto' }} />
    ) : (
      <Button text={isRestarting ? 'RESTARTING...' : 'RESTART NODE'} width={150} isPrimary onClick={requestNodeRestart} style={{ marginLeft: 'auto' }} isDisabled={isRestarting} />
    );
  };

  const renderNetworkDetails = () => (
    <DetailsWrap>
      <DetailsRow>
        <DetailsTextWrap>
          <DetailsText>Age</DetailsText>
          <Tooltip width={250} text="tooltip age" isDarkMode={isDarkMode} />
        </DetailsTextWrap>
        <GrayText>
          <CustomTimeAgo time={genesisTime} />
        </GrayText>
      </DetailsRow>
      <DetailsRow>
        <DetailsTextWrap>
          <DetailsText>Status</DetailsText>
          <Tooltip width={250} text="tooltip Status" isDarkMode={isDarkMode} />
        </DetailsTextWrap>
        <GrayText>
          <NetworkStatus status={status} error={nodeError} isRestarting={isRestarting} isWalletMode={isWalletMode} />
        </GrayText>
      </DetailsRow>
      <DetailsRow>
        <DetailsTextWrap>
          <DetailsText>Current Layer</DetailsText>
          <Tooltip width={250} text="tooltip Current Layer" isDarkMode={isDarkMode} />
        </DetailsTextWrap>
        <GrayText>{status?.topLayer || 0}</GrayText>
      </DetailsRow>
      <DetailsRow>
        <DetailsTextWrap>
          <DetailsText>Verified Layer</DetailsText>
          <Tooltip width={250} text="tooltip Verified Layer" isDarkMode={isDarkMode} />
        </DetailsTextWrap>
        <GrayText>{status?.verifiedLayer || 0}</GrayText>
      </DetailsRow>
      <DetailsRow>
        <DetailsTextWrap>
          <DetailsText>Connection Type</DetailsText>
          <Tooltip width={250} text="tooltip Connection Type" isDarkMode={isDarkMode} />
        </DetailsTextWrap>
        <GrayText>{isWalletMode ? `Remote API provider: ${remoteApi}` : 'Managed p2p node'}</GrayText>
      </DetailsRow>
      {!isWalletMode && (
        <DetailsRow>
          <DetailsTextWrap>
            <DetailsText>Connected neighbors</DetailsText>
            <Tooltip width={250} text="tooltip Connected neighbors" isDarkMode={isDarkMode} />
          </DetailsTextWrap>
          <GrayText>8</GrayText>
        </DetailsRow>
      )}
    </DetailsWrap>
  );

  const renderNoNetwork = () => (
    <DetailsWrap>
      <DetailsRow>
        <Button text="CHOOSE THE NETWORK" width={150} isPrimary onClick={() => goToSwitchNetwork(history, isWalletMode)} />
      </DetailsRow>
    </DetailsWrap>
  );

  const openLogFile = () => {
    eventsService.showFileInFolder({ isLogFile: true });
  };

  return (
    <WrapperWith2SideBars width={1000} header="NETWORK" headerIcon={network} isDarkMode={isDarkMode}>
      <SubHeader>
        {netName}
        {nodeError && <ErrorMessage>{nodeError.msg}</ErrorMessage>}
      </SubHeader>
      <Container>
        {netId > -1 ? renderNetworkDetails() : renderNoNetwork()}
        <FooterWrap>
          {!isWalletMode && <Link onClick={openLogFile} text="BROWSE LOG FILE" />}
          <Tooltip width={250} text="tooltip BROWSE LOG FILE" isDarkMode={isDarkMode} />
          {renderActionButton()}
        </FooterWrap>
      </Container>
    </WrapperWith2SideBars>
  );
};

export default Network;
