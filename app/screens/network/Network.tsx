import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { eventsService } from '../../infra/eventsService';
import { NetworkStatus } from '../../components/NetworkStatus';
import {
  Button,
  CustomTimeAgo,
  Link,
  Tooltip,
  WrapperWith2SideBars,
} from '../../basicComponents';
import { smColors } from '../../vars';
import { network } from '../../assets/images';
import { RootState } from '../../types';
import { getRemoteApi, isWalletOnly } from '../../redux/wallet/selectors';
import ErrorMessage from '../../basicComponents/ErrorMessage';
import SubHeader from '../../basicComponents/SubHeader';
import { goToSwitchNetwork } from '../../routeUtils';
import { AuthPath } from '../../routerPaths';
import { delay } from '../../../shared/utils';
import Address from '../../components/common/Address';
import {
  getFirstLayerInEpochFn,
  getTimestampByLayerFn,
  isGenesisPhase,
} from '../../redux/network/selectors';
import { NodeErrorType } from '../../../shared/types';
import { ExternalLinks } from '../../../shared/constants';
import {
  isLinux as isLinuxSelector,
  isWindows as isWindowsSelector,
} from '../../redux/ui/selectors';
import ErrorCheckListModal from '../modal/ErrorCheckListModal';

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
  border-bottom: ${({ theme }) =>
    `1px solid ${
      theme.isDarkMode ? smColors.white : smColors.darkGray10Alpha
    };`};
  &:last-child {
    border-bottom-color: transparent;
  }
`;

const DetailsText = styled.div`
  font-size: 16px;
  line-height: 20px;
  margin: 10px 0;
  color: ${({ theme }) => theme.color.contrast};
`;

const GrayText = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 14px;
  text-transform: uppercase;
  color: ${({ theme }) =>
    theme.isDarkMode ? smColors.white : smColors.dark75Alpha};
`;

const DetailsTextWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Network = ({ history }) => {
  const isWindows = useSelector(isWindowsSelector);
  const isLinux = useSelector(isLinuxSelector);
  const isWalletMode = useSelector(isWalletOnly);
  const startupStatus = useSelector(
    (state: RootState) => state.node.startupStatus
  );
  const status = useSelector((state: RootState) => state.node.status);
  const nodeError = useSelector((state: RootState) => state.node.error);
  const genesisID = useSelector(
    (state: RootState) => state.network.genesisID || ''
  );
  const netName = useSelector(
    (state: RootState) =>
      state.network.netName ||
      (genesisID === '' ? 'NOT CONNECTED' : 'UNKNOWN NETWORK NAME')
  );
  const [isCheckListModalOpened, setOpenCheckListModal] = useState(false);

  const getFirstLayerInEpoch = useSelector(getFirstLayerInEpochFn);
  const getTimestampByLayer = useSelector(getTimestampByLayerFn);
  const isGenesis = useSelector(isGenesisPhase);

  const genesisTime = useSelector(
    (state: RootState) => state.network.genesisTime
  );
  const remoteApi = useSelector(getRemoteApi);
  const [isRestarting, setRestarting] = useState(false);

  const requestNodeRestart = useCallback(async () => {
    setRestarting(true);
    await eventsService.restartNode();
    await delay(60 * 1000);
    // In case if Node restarts earlier the component will be
    // re-rendered and Restart button will disappear
    setRestarting(false);
  }, []);

  const requestSwitchApiProvider = () => {
    history.push(AuthPath.ConnectToAPI);
  };
  const isShowMissingLibsMessage = [
    NodeErrorType.OPEN_CL_NOT_INSTALLED,
    NodeErrorType.REDIST_NOT_INSTALLED,
  ].includes(nodeError?.type as NodeErrorType);

  const navigateToWindowsOpenCLInstallationGuide = () =>
    window.open(ExternalLinks.OpenCLWindowsInstallGuide);
  const navigateToUbuntuOpenCLInstallationGuide = () =>
    window.open(ExternalLinks.OpenCLUbuntuInstallGuide);
  const navigateToRedistInstallationGuide = () =>
    window.open(ExternalLinks.RedistWindowsInstallOfficialSite);

  const renderActionButton = () => {
    if (!nodeError) return null;

    return isWalletMode ? (
      <Button
        text="SWITCH API PROVIDER"
        width={200}
        isPrimary
        onClick={requestSwitchApiProvider}
        style={{ marginLeft: 'auto' }}
      />
    ) : (
      <Button
        text={isRestarting ? 'RESTARTING...' : 'RESTART NODE'}
        width={150}
        isPrimary
        onClick={requestNodeRestart}
        style={{ marginLeft: 'auto' }}
        isDisabled={isRestarting}
      />
    );
  };

  const renderNetworkDetails = () => (
    <DetailsWrap>
      <DetailsRow>
        <DetailsTextWrap>
          <DetailsText>Age</DetailsText>
          <Tooltip
            width={250}
            text="​​Elapsed time since the current Network genesis"
          />
        </DetailsTextWrap>
        <GrayText>
          <CustomTimeAgo time={genesisTime} />
        </GrayText>
      </DetailsRow>
      <DetailsRow>
        <DetailsTextWrap>
          <DetailsText>Genesis ID</DetailsText>
          <Tooltip
            width={250}
            text="Unique hash per network, generated from genesis time and a unique identifier"
          />
        </DetailsTextWrap>
        <GrayText>
          <Address isHex address={genesisID} hideExplorer />
        </GrayText>
      </DetailsRow>
      <DetailsRow>
        <DetailsTextWrap>
          <DetailsText>Status</DetailsText>
          <Tooltip width={250} text="Network Synchronization Status" />
        </DetailsTextWrap>
        <GrayText>
          <NetworkStatus
            startupStatus={startupStatus}
            status={status}
            error={nodeError}
            isGenesis={isGenesis}
            isRestarting={isRestarting}
            isWalletMode={isWalletMode}
            isShowMissingLibsMessage={isShowMissingLibsMessage}
          />
        </GrayText>
      </DetailsRow>
      {status && isGenesis ? (
        <DetailsRow>
          <DetailsTextWrap>
            <DetailsText>Genesis will end in</DetailsText>
            <Tooltip
              width={250}
              text="The genesis phase lasts for the first two epochs"
            />
          </DetailsTextWrap>
          <GrayText>
            <CustomTimeAgo
              time={getTimestampByLayer(getFirstLayerInEpoch(2))}
            />
          </GrayText>
        </DetailsRow>
      ) : (
        <>
          <DetailsRow>
            <DetailsTextWrap>
              <DetailsText>Current Layer</DetailsText>
              <Tooltip
                width={250}
                text="Most recent Layer number in this Network"
              />
            </DetailsTextWrap>
            <GrayText>{status?.topLayer || 0}</GrayText>
          </DetailsRow>
        </>
      )}
      <DetailsRow>
        <DetailsTextWrap>
          <DetailsText>Connection Type</DetailsText>
          <Tooltip
            width={250}
            text="Managed p2p if running a local node. Otherwise Remote API provider details"
          />
        </DetailsTextWrap>
        <GrayText>
          {isWalletMode
            ? `Remote API provider: ${remoteApi}`
            : 'Managed p2p node'}
        </GrayText>
      </DetailsRow>
      {!isWalletMode && (
        <DetailsRow>
          <DetailsTextWrap>
            <DetailsText>Connected neighbors</DetailsText>
            <Tooltip
              width={250}
              text="Spacemesh syncs database and participates in the network by communicating with other connected peers"
            />
          </DetailsTextWrap>
          <GrayText>{status?.connectedPeers || 0}</GrayText>
        </DetailsRow>
      )}
    </DetailsWrap>
  );

  const renderNoNetwork = () => (
    <DetailsWrap>
      <DetailsRow>
        <Button
          text="CHOOSE THE NETWORK"
          width={180}
          isPrimary
          onClick={() => goToSwitchNetwork(history, isWalletMode)}
        />
      </DetailsRow>
    </DetailsWrap>
  );

  const openLogFile = () => {
    eventsService.showFileInFolder({ isLogFile: true });
  };

  return (
    <>
      <WrapperWith2SideBars
        width={1000}
        header="NETWORK"
        headerIcon={network}
        style={{ minHeight: 485 }}
      >
        <SubHeader>
          {netName}
          {nodeError && (
            <>
              <ErrorMessage compact>
                {nodeError.msg || nodeError.stackTrace}
                {nodeError?.type === NodeErrorType.OPEN_CL_NOT_INSTALLED && (
                  <>
                    {isWindows && (
                      <Link
                        style={{ display: 'inline-block' }}
                        onClick={navigateToWindowsOpenCLInstallationGuide}
                        text="OPEN CL INSTALLATION GUIDE"
                      />
                    )}
                    {isLinux && (
                      <Link
                        style={{ display: 'inline-block' }}
                        onClick={navigateToUbuntuOpenCLInstallationGuide}
                        text="OPEN CL INSTALLATION GUIDE."
                      />
                    )}
                  </>
                )}
                {nodeError?.type === NodeErrorType.REDIST_NOT_INSTALLED && (
                  <Link
                    style={{ display: 'inline-block' }}
                    onClick={navigateToRedistInstallationGuide}
                    text="REDIST INSTALLATION GUIDE."
                  />
                )}
                {nodeError?.type === NodeErrorType.NOT_SPECIFIED && (
                  <Link
                    style={{ display: 'inline-block' }}
                    onClick={() => setOpenCheckListModal(true)}
                    text="OPEN CHECKLIST."
                  />
                )}
              </ErrorMessage>
            </>
          )}
        </SubHeader>
        <Container>
          {genesisID.length ? renderNetworkDetails() : renderNoNetwork()}
          <FooterWrap>
            {!isWalletMode && (
              <>
                <Link onClick={openLogFile} text="BROWSE LOG FILE" />
                <Tooltip
                  width={250}
                  text="Locate the go-spacemesh and app log files on your computer"
                />
              </>
            )}

            {renderActionButton()}
          </FooterWrap>
        </Container>
      </WrapperWith2SideBars>
      {isCheckListModalOpened && (
        <ErrorCheckListModal onClose={() => setOpenCheckListModal(false)} />
      )}
    </>
  );
};

export default Network;
