import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { deletePosData, startSmeshing } from '../../redux/smesher/actions';
import { CorneredContainer, BackButton } from '../../components/common';
import {
  PoSModifyPostData,
  PoSDirectory,
  PoSSize,
  PoSProvider,
  PoSSummary,
  PoSRewards,
} from '../../components/node';
import { posIcon } from '../../assets/images';
import { constrain, formatBytes } from '../../infra/utils';
import { BITS, RootState } from '../../types';
import {
  DEFAULT_POS_MAX_FILE_SIZE,
  DeviceType,
  PostSetupProvider,
} from '../../../shared/types';
import Link from '../../basicComponents/Link';
import ErrorMessage from '../../basicComponents/ErrorMessage';
import { MainPath } from '../../routerPaths';
import { smColors } from '../../vars';
import PoSProfiler from '../../components/node/PoSProfiler';
import { eventsService } from '../../infra/eventsService';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const Bold = styled.div`
  color: ${smColors.green};
`;

enum SetupMode {
  Modify = 0,
  Directory,
  Profiler,
  Size,
  Processor,
  RewardsAddress,
  Summary,
}

const headers = {
  [SetupMode.Modify]: 'PROOF OF SPACE DATA',
  [SetupMode.Directory]: 'PROOF OF SPACE DIRECTORY',
  [SetupMode.Profiler]: 'PROOF GENERATION SETTINGS',
  [SetupMode.Size]: 'PROOF OF SPACE SIZE',
  [SetupMode.Processor]: 'POS PROCESSOR',
  [SetupMode.RewardsAddress]: 'REWARDS ADDRESS',
  [SetupMode.Summary]: 'POS SETUP',
};
const subHeaders = {
  [SetupMode.Size]:
    'Select how much free space to commit to Spacemesh.\nThe more space you commit, the higher your smeshing rewards will be.',
  [SetupMode.Processor]: (
    <>
      Select a supported processor for creating proof of space.
      <Bold>The fastest one is chosen by default.</Bold>
    </>
  ),
  [SetupMode.RewardsAddress]:
    'Select a coinbase address for your smeshing rewards.',
  [SetupMode.Summary]:
    'Review your proof of space data creation options.\nClick a link to go back and edit that item.',
};

interface Props extends RouteComponentProps {
  location: {
    hash: string;
    pathname: string;
    search: string;
    state: { modifyPostData: boolean };
  };
}

const NodeSetup = ({ history, location }: Props) => {
  const dispatch = useDispatch();
  const accounts = useSelector((state: RootState) => state.wallet.accounts);
  const status = useSelector((state: RootState) => state.node.status);
  const postSetupProviders = useSelector(
    (state: RootState) => state.smesher.postSetupProviders
  );
  const existingDataDir = useSelector(
    (state: RootState) => state.smesher.dataDir
  );
  const smesherConfig = useSelector((state: RootState) => state.smesher.config);
  const dataDirFreeSpace = useSelector(
    (state: RootState) => state.smesher.freeSpace
  );

  const [mode, setMode] = useState(location?.state?.modifyPostData ? 0 : 1);
  const [dataDir, setDataDir] = useState(existingDataDir || '');
  const [freeSpace, setFreeSpace] = useState(dataDirFreeSpace);
  const [numUnits, setNumUnits] = useState(0);
  const [posSize, setPoSSize] = useState(0);
  const [provider, setProvider] = useState<PostSetupProvider>();
  const [throttle, setThrottle] = useState(false);
  const [maxFileSize, setMaxFileSize] = useState(DEFAULT_POS_MAX_FILE_SIZE);
  const [rewardAddress, setRewardAddress] = useState(accounts[0].address);
  const [nonces, setNonces] = useState(16);
  const [threads, setThreads] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);

  const singleCommitmentSize =
    (smesherConfig.bitsPerLabel * smesherConfig.labelsPerUnit) / BITS;
  useEffect(() => {
    if (!numUnits || numUnits < smesherConfig.minNumUnits) {
      // setNumUnits(smesherConfig.minNumUnits);
      setPoSSize(singleCommitmentSize * smesherConfig.minNumUnits);
    } else {
      const nu = constrain(
        smesherConfig.minNumUnits,
        smesherConfig.maxNumUnits,
        numUnits
      );
      if (nu !== numUnits) {
        setNumUnits(nu);
      }
      setPoSSize(nu * singleCommitmentSize);
    }
  }, [singleCommitmentSize, smesherConfig, numUnits]);

  const commitmentSize =
    (smesherConfig.labelsPerUnit *
      smesherConfig.bitsPerLabel *
      smesherConfig.minNumUnits) /
    BITS;
  const formattedCommitmentSize = formatBytes(commitmentSize);
  const getPosDirectorySubheader = () => (
    <>
      {Number.isNaN(commitmentSize) ? (
        <ErrorMessage align="left">
          {!status?.connectedPeers ? (
            <>
              The Node is not connected yet.
              <br />
              Please, check the Node status on the{' '}
              <Link
                onClick={() => history.push(MainPath.Network)}
                text="Network screen"
                style={{ display: 'inline-block' }}
              />
              .
            </>
          ) : (
            <>
              The Smesher Service is not responding.
              <br />
              Please, check the application logs:{' '}
              <Link
                onClick={() =>
                  eventsService.showFileInFolder({ isLogFile: true })
                }
                text="Open in Finder"
                style={{ display: 'inline-block' }}
              />
            </>
          )}
        </ErrorMessage>
      ) : (
        <>
          Select a directory to save your proof of space data.
          <br />
          Minimum {formattedCommitmentSize} of free space is required.
        </>
      )}
    </>
  );
  const subHeader =
    mode !== SetupMode.Directory
      ? subHeaders[mode] ?? ''
      : getPosDirectorySubheader();
  const hasBackButton =
    location?.state?.modifyPostData || mode !== SetupMode.Directory;

  const setupAndInitMining = async () => {
    if (!provider) return;
    const done = await dispatch(
      startSmeshing({
        coinbase: rewardAddress,
        dataDir,
        numUnits,
        provider: provider?.id || 0,
        throttle,
        maxFileSize,
        nonces,
        threads,
      })
    );

    if ((done as unknown) as boolean) {
      history.push(MainPath.Smeshing, { showIntro: true });
    }
  };

  const handleNextAction = () => {
    if (mode !== SetupMode.Summary) {
      setMode(mode + 1);
    } else {
      setupAndInitMining();
    }
  };

  const handleSkipProvider = () => {
    setProvider({
      id: 0,
      deviceType: DeviceType.DEVICE_CLASS_UNKNOWN,
      model: 'No POS Provider',
      performance: 0,
    });
    setMode(mode + 1);
  };

  const handleDeletePosData = async () => {
    setIsDeleting(true);
    await dispatch(deletePosData());
    setIsDeleting(false);
    history.push('/main/wallet/');
  };

  const handlePrevAction = () => {
    if (mode === SetupMode.Modify) {
      history.replace(MainPath.Smeshing);
    } else {
      setMode(mode - 1);
    }
  };

  const renderRightSection = () => {
    switch (mode) {
      case SetupMode.Modify:
        return (
          <PoSModifyPostData
            deleteData={handleDeletePosData}
            isDeleting={isDeleting}
          />
        );
      case SetupMode.Directory:
        return (
          <PoSDirectory
            nextAction={handleNextAction}
            minCommitmentSize={formattedCommitmentSize}
            dataDir={dataDir}
            setDataDir={setDataDir}
            freeSpace={freeSpace}
            setFreeSpace={setFreeSpace}
            status={status}
            skipAction={() => history.push(MainPath.Smeshing)}
          />
        );
      case SetupMode.Profiler: {
        return (
          <PoSProfiler
            numUnitSize={singleCommitmentSize}
            maxUnits={smesherConfig.maxNumUnits}
            dataDir={dataDir}
            nextAction={(nonces, threads, numUnits) => {
              setNonces(nonces);
              setThreads(threads);
              numUnits && !Number.isNaN(numUnits) && setNumUnits(numUnits);
              return handleNextAction();
            }}
          />
        );
      }
      case SetupMode.Size: {
        // TODO: Make a well default instead of logic inside view and rerendering comp:
        numUnits === 0 && setNumUnits(smesherConfig.minNumUnits);
        return (
          <PoSSize
            nextAction={handleNextAction}
            calculatedSize={posSize}
            dataDir={dataDir}
            freeSpace={freeSpace}
            numUnits={numUnits}
            numUnitsConstraint={[
              smesherConfig.minNumUnits,
              smesherConfig.maxNumUnits,
            ]}
            numUnitSize={singleCommitmentSize}
            setNumUnit={setNumUnits}
            status={status}
            setMaxFileSize={setMaxFileSize}
            maxFileSize={maxFileSize}
          />
        );
      }
      case SetupMode.Processor:
        return (
          <PoSProvider
            nextAction={handleNextAction}
            skipAction={handleSkipProvider}
            providers={postSetupProviders}
            provider={provider}
            setProvider={setProvider}
            throttle={throttle}
            setThrottle={setThrottle}
            status={status}
          />
        );
      case SetupMode.RewardsAddress:
        return (
          <PoSRewards
            coinbase={rewardAddress}
            address={accounts.map((item) => ({
              address: item.address,
              nickname: item.displayName,
            }))}
            onChange={(address) => setRewardAddress(address)}
            nextAction={handleNextAction}
          />
        );
      case SetupMode.Summary:
        return (
          <PoSSummary
            dataDir={dataDir}
            maxFileSize={maxFileSize}
            commitmentSize={
              smesherConfig
                ? formatBytes(
                    (smesherConfig.bitsPerLabel *
                      smesherConfig.labelsPerUnit *
                      numUnits) /
                      BITS
                  )
                : '0'
            }
            provider={provider}
            throttle={throttle}
            nextAction={handleNextAction}
            switchMode={({ mode }) => setMode(mode)}
            status={status}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Wrapper>
      <CorneredContainer
        width={760}
        height={450}
        header={headers[mode]}
        headerIcon={posIcon}
        subHeader={subHeader}
      >
        {hasBackButton && <BackButton action={handlePrevAction} />}
        {renderRightSection()}
      </CorneredContainer>
    </Wrapper>
  );
};

export default NodeSetup;
