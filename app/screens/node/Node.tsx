import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import { SmesherIntro, SmesherLog } from '../../components/node';
import {
  WrapperWith2SideBars,
  Button,
  Link,
  ColorStatusIndicator,
} from '../../basicComponents';
import { hideSmesherLeftPanel, setUiError } from '../../redux/ui/actions';
import { formatBytes, getFormattedTimestamp } from '../../infra/utils';
import {
  posIcon,
  posSmesher,
  posDirectoryWhite,
  pauseIcon,
  playIcon,
  walletSecond,
  posSmesherOrange,
} from '../../assets/images';
import { smColors } from '../../vars';
import { BITS, RootState } from '../../types';
import {
  HexString,
  NodeStatus,
  PostSetupState,
  RewardsInfo,
} from '../../../shared/types';
import { isWalletOnly } from '../../redux/wallet/selectors';
import * as SmesherSelectors from '../../redux/smesher/selectors';
import { pauseSmeshing, resumeSmeshing } from '../../redux/smesher/actions';
import SubHeader from '../../basicComponents/SubHeader';
import ErrorMessage from '../../basicComponents/ErrorMessage';
import { eventsService } from '../../infra/eventsService';
import { ExternalLinks } from '../../../shared/constants';
import Address, { AddressType } from '../../components/common/Address';
import { AuthPath, MainPath } from '../../routerPaths';
import { getGenesisID } from '../../redux/network/selectors';
import {
  timestampByLayer,
  epochByLayer,
  nextEpochTime,
} from '../../../shared/layerUtils';
import { convertBytesToMiB } from '../../../shared/utils';
import NodeEventActivityRow from './NodeEventActivityRow';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const Text = styled.div`
  font-size: 14px;
  display: flex;
  line-height: 20px;
  color: ${({ theme }) => theme.color.contrast};
  &.progress {
    min-width: 170px;
  }
`;

const EventText = styled(Text)`
  display: block;
  text-align: left;
  flex-grow: 1;
  overflow: hidden;
  height: 1.4em;
  white-space: nowrap;
  text-overflow: ellipsis;

  & > * {
    display: inline-block;
  }
`;

const ProgressError = styled.div`
  color: ${smColors.red};
  font-size: 15px;
  display: flex;
  line-height: 20px;
  &.progress {
    min-width: 170px;
  }
`;

const BoldText = styled(Text)`
  font-weight: 800;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: flex-end;
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: flex-start;
`;

const SmesherId = styled.span`
  display: inline-block;
  margin: 0 5px;
`;

const StatusSpan = styled.span<{ status?: NodeStatus | null }>`
  display: inline-block;
  color: ${({ status }) => (status ? smColors.green : smColors.orange)};
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
  justify-content: space-between;
  width: 100%;

  & > ${ColorStatusIndicator} {
    margin-right: 1em;
  }
`;

const TextWrapperFirst = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
  justify-content: flex-start;
  width: 100%;
`;

const LineWrap = styled.div`
  position: relative;
  width: 100%;
  &:after {
    position: absolute;
    bottom: 5px;
    content: '';
    left: 0;
    width: 100%;
    height: 1px;
    background: ${({ theme }) =>
      theme.isDarkMode ? smColors.disabledGray10Alpha : smColors.black};
  }
`;

const EventsWrap = styled(LineWrap)`
  margin-bottom: 2em;
`;

const PosSmesherIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 5px;
`;

const PosDirLink = styled.span`
  display: flex;
  cursor: pointer;

  &:hover span,
  &:focus span {
    text-decoration: none;
  }
`;

const PosFolderIcon = styled.img.attrs(
  ({
    theme: {
      icons: { posDirectory },
    },
  }) => ({
    src: posDirectory,
  })
)`
  width: 20px;
  height: 20px;
  margin-right: 5px;
  cursor: pointer;
`;

const PathDir = styled.span`
  color: ${smColors.blue};
  text-decoration: underline;
  cursor: pointer;
`;

interface Props extends RouteComponentProps {
  location: {
    hash: string;
    pathname: string;
    search: string;
    state: { showIntro?: boolean };
  };
}

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 25px;
`;

const Icon = styled.img`
  display: flex;
  width: 20px;
  height: 20px;
  margin-right: 5px;
`;

const IconSmesher = styled.img`
  display: flex;
  width: 40px;
  height: 25px;
  margin-right: 5px;
  color: ${smColors.darkOrange};
`;

const RowText = styled.div<{ weight: number }>`
  display: flex;
  font-size: 16px;
  font-weight: ${({ weight }) => weight};
  line-height: 20px;
  color: ${({ color }) => color};
`;

const BottomPart = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

const BottomActionSection = styled.div`
  position: relative;
  display: flex;
`;

const TooltipText = styled.div`
  margin: 10px;
  font-size: 10px;
  line-height: 13px;
  color: ${({
    theme: {
      popups: {
        states: { error },
      },
    },
  }) => error.color};
`;

const TooltipWrapper = styled.div`
  position: absolute;
  left: 0;
  width: 100px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: ${({
    theme: {
      popups: {
        states: { error },
      },
    },
  }) => error.backgroundColor};
  ${({ theme }) => `border-radius: ${theme.box.radius}px;`}
`;

const CustomTooltip = styled((props: { text: string }) => (
  <TooltipWrapper {...props}>
    <TooltipText>{props.text}</TooltipText>
  </TooltipWrapper>
))<{ closePosition?: boolean }>``;

const ButtonWrapper = styled.div`
  position: relative;
  ${CustomTooltip} {
    display: none;
  }
  &:hover {
    ${CustomTooltip} {
      display: block;
    }
  }
`;

const ERR_MESSAGE_ERR_STATE =
  'PoS initialization failed. Try to delete it and re-initialize.';
const ERR_MESSAGE_NODE_ERROR =
  'The Node is not syncing. Please check the Network tab';

const SmesherStatus = ({
  smesherId,
  status,
  networkName,
}: {
  smesherId: HexString;
  status: NodeStatus | null;
  networkName: string;
}) => (
  <SubHeader>
    Smesher
    <SmesherId>
      <Address type={AddressType.SMESHER} address={smesherId} isHex />
    </SmesherId>
    is&nbsp;
    <StatusSpan status={status}> {status ? 'ONLINE' : ' OFFLINE'} </StatusSpan>
    &nbsp;on {networkName}.
  </SubHeader>
);

const ERROR_MESSAGE = 'Node is not connected. Check Network tab.';

const Node = ({ history, location }: Props) => {
  const [showIntro, setShowIntro] = useState(location?.state?.showIntro);
  const nodeError = useSelector((state: RootState) => state.node.error);
  const curNet = useSelector(getGenesisID);
  const status = useSelector((state: RootState) => state.node.status);
  const networkName = useSelector((state: RootState) => state.network.netName);
  const smesherId = useSelector((state: RootState) => state.smesher.smesherId);
  const coinbase = useSelector((state: RootState) => state.smesher.coinbase);
  const posDataPath = useSelector((state: RootState) => state.smesher.dataDir);
  const smesherConfig = useSelector((state: RootState) => state.smesher.config);
  const maxFileSize = useSelector(
    (state: RootState) => state.smesher.maxFileSize
  );

  const rewards = useSelector((state: RootState) =>
    state.smesher.rewards.slice(0).reverse()
  );
  const rewardsInfo = useSelector(
    (state: RootState) => state.smesher.rewardsInfo
  );
  const genesisTime = useSelector(
    (state: RootState) => state.network.genesisTime
  );
  const layerDurationSec = useSelector(
    (state: RootState) => state.network.layerDurationSec
  );
  const layersPerEpoch = useSelector(
    (state: RootState) => state.network.layersPerEpoch
  );

  const getEpochByLayer = epochByLayer(layersPerEpoch);
  const getTimestampByLayer = timestampByLayer(genesisTime, layerDurationSec);
  const getNextEpochTime = nextEpochTime(
    genesisTime,
    layerDurationSec,
    layersPerEpoch
  );
  const currentEpoch = getEpochByLayer(status?.topLayer || 0);

  const commitmentSize = useSelector(
    (state: RootState) => state.smesher.commitmentSize
  );
  const isSmeshing = useSelector(SmesherSelectors.isSmeshing);
  const isCreatingPostData = useSelector(SmesherSelectors.isCreatingPostData);
  const isPausedSmeshing = useSelector(SmesherSelectors.isSmeshingPaused);
  const isErrorState = useSelector(SmesherSelectors.isErrorState);
  const nodeStatusError = useSelector(
    (state: RootState) => state.node.error?.msg || null
  );
  const isSmesherActive = isSmeshing || isCreatingPostData || isPausedSmeshing;
  const postSetupState = useSelector(
    (state: RootState) => state.smesher.postSetupState
  );
  const numLabelsWritten = useSelector(
    (state: RootState) => state.smesher.numLabelsWritten
  );
  const postProvingOpts = useSelector(
    (state: RootState) => state.smesher.postProvingOpts
  );
  const isWalletMode = useSelector(isWalletOnly);
  const events = useSelector((state: RootState) => state.smesher.events);
  const lastEvent = events[events.length - 1];

  const dispatch = useDispatch();

  type RowData = [string, string | JSX.Element];
  const renderTable = (data: RowData[]) =>
    data.map(([label, value], idx) => {
      return (
        <LineWrap key={`smeshing-status-${idx}`}>
          <TextWrapper>
            <Text>{label}</Text>
            <Text>{value}</Text>
          </TextWrapper>
        </LineWrap>
      );
    });
  const getTableDataB = (): RowData[] => {
    const progress =
      ((numLabelsWritten * smesherConfig.bitsPerLabel) /
        (BITS * commitmentSize)) *
      100;
    const progressRow: RowData[] = !isSmeshing
      ? [
          [
            'Progress',
            isErrorState ? (
              <ProgressError>STOPPED</ProgressError>
            ) : (
              <Text className="progress">
                {formatBytes(
                  (numLabelsWritten * smesherConfig.bitsPerLabel) / BITS
                )}{' '}
                / {formatBytes(commitmentSize)}, {progress.toFixed(2)}%
              </Text>
            ),
          ],
        ]
      : [];

    return [
      ...progressRow,
      ['Current epoch', <>{currentEpoch}</>],
      [
        'Next epoch in',
        <>
          &#8776;
          {getFormattedTimestamp(getNextEpochTime(status?.topLayer || 0))}
        </>,
      ],
      [
        'Rewards Address',
        <Address
          key="smesherCoinbase"
          type={AddressType.ACCOUNT}
          address={coinbase || ''}
        />,
      ],
      [
        'Data Directory',
        <PosDirLink
          onClick={() =>
            eventsService.showFileInFolder({ filePath: posDataPath })
          }
        >
          <PosFolderIcon />
          <PathDir>{posDataPath}</PathDir>
        </PosDirLink>,
      ],
      ['Data Size', formatBytes(commitmentSize)],
      ['Max File Size', `${convertBytesToMiB(maxFileSize)} MiB`],
      [
        'Proof Generation',
        `${postProvingOpts.nonces} nonces | ${postProvingOpts.threads} CPU threads`,
      ],
      [
        'Smesher ID',
        <Address
          key="smesherId"
          type={AddressType.SMESHER}
          address={smesherId}
          isHex
        />,
      ],
    ];
  };

  const handlePauseSmeshing = () => dispatch(pauseSmeshing());
  const handleResumeSmeshing = () => dispatch(resumeSmeshing());
  const renderNodeDashboard = () => {
    // TODO: Refactor screen and Node Dashboard
    //       to avoid excessive re-rendering of the whole screen
    //       on each progress update, which causes blinking
    return (
      <>
        {isErrorState && (
          <ErrorMessage oneLine={false} align="right">
            {ERR_MESSAGE_ERR_STATE}
          </ErrorMessage>
        )}
        {nodeStatusError && (
          <ErrorMessage oneLine={false} align="right">
            {ERR_MESSAGE_NODE_ERROR}
          </ErrorMessage>
        )}
        <EventsWrap>
          <TextWrapper>
            <ColorStatusIndicator
              color={lastEvent?.failure ? smColors.red : smColors.green}
            />
            <EventText>{NodeEventActivityRow(lastEvent)}</EventText>
            <Link
              text="Open logs"
              onClick={() => history.push(MainPath.NodeEvents)}
              style={{ marginLeft: '1em', whiteSpace: 'nowrap' }}
            />
          </TextWrapper>
        </EventsWrap>
        {renderTable(getTableDataB())}
        <Footer>
          <FooterSection>
            <ButtonWrapper>
              <Button
                isDisabled={!!nodeError}
                onClick={() => {
                  dispatch(hideSmesherLeftPanel());
                  history.push(MainPath.SmeshingSetup, {
                    modifyPostData: true,
                  });
                }}
                img={posDirectoryWhite}
                text="EDIT"
                isPrimary={false}
                style={{ marginRight: 15 }}
                imgPosition="before"
                width={180}
              />
              {!!nodeError && <CustomTooltip text={ERROR_MESSAGE} />}
            </ButtonWrapper>

            <ButtonWrapper>
              {postSetupState === PostSetupState.STATE_IN_PROGRESS && (
                <>
                  <Button
                    isDisabled={!!nodeError}
                    onClick={handlePauseSmeshing}
                    text="PAUSE POST DATA GENERATION"
                    img={pauseIcon}
                    isPrimary={false}
                    width={280}
                    imgPosition="before"
                  />
                  {!!nodeError && <CustomTooltip text={ERROR_MESSAGE} />}
                </>
              )}
              {isPausedSmeshing && (
                <>
                  <Button
                    isDisabled={!!nodeError}
                    onClick={handleResumeSmeshing}
                    text="RESUME SMESHING"
                    img={playIcon}
                    isPrimary
                    width={280}
                    imgPosition="before"
                  />
                  {!!nodeError && <CustomTooltip text={ERROR_MESSAGE} />}
                </>
              )}
            </ButtonWrapper>
          </FooterSection>
        </Footer>
      </>
    );
  };

  const buttonHandler = () => {
    dispatch(hideSmesherLeftPanel());
    history.push(MainPath.SmeshingSetup);
  };

  const renderMainSection = () => {
    if (showIntro) {
      return <SmesherIntro hideIntro={() => setShowIntro(false)} />;
    }
    if (!isSmesherActive && !isErrorState) {
      return (
        <>
          <SmesherStatus
            smesherId={smesherId}
            status={status}
            networkName={networkName}
          />
          <TextWrapperFirst>
            <PosSmesherIcon src={posSmesher} />
            <BoldText>Proof of Space Status</BoldText>
          </TextWrapperFirst>
          <Text>Proof of Space data is not setup yet</Text>
          <br />
          <BottomActionSection>
            <ButtonWrapper>
              <Button
                isDisabled={!!nodeError}
                onClick={buttonHandler}
                text="SETUP PROOF OF SPACE"
                width={250}
              />
              {!!nodeError && <CustomTooltip text={ERROR_MESSAGE} />}
            </ButtonWrapper>
          </BottomActionSection>
        </>
      );
    }

    return renderNodeDashboard();
  };

  const navigateToExplanation = () => window.open(ExternalLinks.SetupGuide);

  const handleSetupSmesher = () => {
    eventsService.switchApiProvider(curNet).catch((err) => {
      console.error(err); // eslint-disable-line no-console
      dispatch(setUiError(err));
    });

    history.push(AuthPath.Unlock, { redirect: MainPath.Smeshing });
  };

  const renderWalletOnlyMode = () => {
    return (
      <>
        <Row>
          <RowText color={smColors.purple} weight={700}>
            <Icon src={walletSecond} /> Your app is currently in wallet-only
            mode and smeshing is not set up.
          </RowText>
        </Row>
        <Row>
          <RowText color={smColors.darkOrange} weight={400}>
            <IconSmesher src={posSmesherOrange} />
            Click on the setup semsher button below to start using a local
            managed full Spacemesh p2p node and to smesh.
          </RowText>
        </Row>
        <BottomPart>
          <Link onClick={navigateToExplanation} text="SMESHER GUIDE" />
          <Button
            width={120}
            onClick={handleSetupSmesher}
            text="SETUP SMESHER"
          />
        </BottomPart>
      </>
    );
  };

  return (
    <Wrapper>
      <WrapperWith2SideBars width={682} header="SMESHER" headerIcon={posIcon}>
        {isWalletMode ? renderWalletOnlyMode() : renderMainSection()}
      </WrapperWith2SideBars>
      <SmesherLog
        rewards={rewards}
        rewardsInfo={rewardsInfo as RewardsInfo}
        epochByLayer={getEpochByLayer}
        timestampByLayer={getTimestampByLayer}
      />
    </Wrapper>
  );
};

export default Node;
