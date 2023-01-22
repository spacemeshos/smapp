import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import {
  deletePosData,
  pauseSmeshing,
  startSmeshing,
} from '../../redux/smesher/actions';
import { CorneredContainer, BackButton } from '../../components/common';
import {
  PoSModifyPostData,
  PoSDirectory,
  PoSSize,
  PoSProvider,
  PoSSummary,
} from '../../components/node';
import { posIcon } from '../../assets/images';
import { formatBytes } from '../../infra/utils';
import { BITS, RootState } from '../../types';
import {
  DEFAULT_POS_MAX_FILE_SIZE,
  PostSetupComputeProvider,
} from '../../../shared/types';
import ErrorMessage from '../../basicComponents/ErrorMessage';
import { MainPath } from '../../routerPaths';
import { smColors } from '../../vars';
import { hideSmesherLeftPanel } from '../../redux/ui/actions';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const Bold = styled.div`
  color: ${smColors.green};
`;

const headers = [
  'PROOF OF SPACE DATA',
  'PROOF OF SPACE DIRECTORY',
  'PROOF OF SPACE SIZE',
  'POS PROCESSOR',
  'POS SETUP',
];
const subHeaders = [
  '',
  '',
  'Select how much free space to commit to Spacemesh.\nThe more space you commit, the higher your smeshing rewards will be.',
  <>
    Select a supported processor for creating proof of space.
    <Bold>The fastest one is chosen by default.</Bold>
  </>,
  'Review your proof of space data creation options.\nClick a link to go back and edit that item.',
];

interface Commitment {
  label: string;
  size: number;
  numUnits: number;
}

interface Props extends RouteComponentProps {
  location: {
    hash: string;
    pathname: string;
    search: string;
    state: {
      modifyPostData?: boolean;
      modifyPoSSettings?: boolean;
    };
  };
}

const selectModeByLocationState = (state: Props['location']['state']) => {
  if (state?.modifyPoSSettings) {
    return 2;
  }

  if (state?.modifyPostData) {
    return 1;
  }

  return 0;
};

const NodeSetup = ({ history, location }: Props) => {
  const dispatch = useDispatch();
  const accounts = useSelector((state: RootState) => state.wallet.accounts);
  const status = useSelector((state: RootState) => state.node.status);
  const postSetupComputeProviders = useSelector(
    (state: RootState) => state.smesher.postSetupComputeProviders
  );
  const existingDataDir = useSelector(
    (state: RootState) => state.smesher.dataDir
  );
  const smesherConfig = useSelector((state: RootState) => state.smesher.config);
  const isHideSmesherLeftPanel = useSelector(
    (state: RootState) => state.ui.hideSmesherLeftPanel
  );
  const [mode, setMode] = useState(selectModeByLocationState(location?.state));
  const [dataDir, setDataDir] = useState(existingDataDir || '');
  const [freeSpace, setFreeSpace] = useState('');
  const [numUnits, setNumUnits] = useState(0);
  const [provider, setProvider] = useState<PostSetupComputeProvider>();
  const [throttle, setThrottle] = useState(false);
  const [maxFileSize, setMaxFileSize] = useState(DEFAULT_POS_MAX_FILE_SIZE);
  const commitmentSize =
    (smesherConfig.labelsPerUnit *
      smesherConfig.bitsPerLabel *
      smesherConfig.minNumUnits) /
    BITS;
  const formattedCommitmentSize = formatBytes(commitmentSize);
  const getPosDirectorySubheader = () => (
    <>
      {Number.isNaN(commitmentSize) ? (
        <ErrorMessage align="left" oneLine={false}>
          The node is down. Please, restart the node first on the Network
          screen.
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
  const subHeader = mode !== 1 ? subHeaders[mode] : getPosDirectorySubheader();

  const setupAndInitMining = async () => {
    if (!provider) return; // TODO
    const done = await dispatch(
      startSmeshing({
        coinbase: accounts[0].address,
        dataDir,
        numUnits,
        provider: provider.id,
        throttle,
        maxFileSize,
      })
    );

    if ((done as unknown) as boolean) {
      history.push(MainPath.Smeshing, { showIntro: true });
    }
  };

  const handleNextAction = () => {
    if (mode !== 4) {
      setMode(mode + 1);
    } else {
      setupAndInitMining();
    }
  };

  const handleModifyPosData = async () => {
    dispatch(hideSmesherLeftPanel());
    await dispatch(pauseSmeshing());
    handleNextAction();
  };

  const handleDeletePosData = async () => {
    await dispatch(deletePosData());
    history.push('/main/wallet/');
  };

  const handlePrevAction = () => {
    if (location?.state?.modifyPoSSettings && mode !== 0) {
      mode > 2 ? setMode(mode - 1) : setMode(0);
      return;
    }

    if (mode === 0 || mode === 1) {
      history.push(MainPath.Smeshing);
      return;
    }

    setMode(mode - 1);
  };

  const renderRightSection = () => {
    switch (mode) {
      case 0:
        return (
          <PoSModifyPostData
            modify={handleModifyPosData}
            deleteData={handleDeletePosData}
            editPos={() => {
              dispatch(hideSmesherLeftPanel());
              history.replace(MainPath.SmeshingSetup, {
                modifyPoSSettings: true,
              });
              setMode(2);
            }}
          />
        );
      case 1:
        return (
          <PoSDirectory
            nextAction={handleNextAction}
            minCommitmentSize={formattedCommitmentSize}
            dataDir={dataDir}
            setDataDir={setDataDir}
            freeSpace={freeSpace}
            setFreeSpace={setFreeSpace}
            status={status}
            skipAction={() => history.push(MainPath.Wallet)}
          />
        );
      case 2: {
        const commitments: Commitment[] = [];
        const singleCommitmentSize =
          (smesherConfig.bitsPerLabel * smesherConfig.labelsPerUnit) / BITS;

        for (
          let i = smesherConfig.minNumUnits;
          i <= smesherConfig.maxNumUnits;
          i += 1
        ) {
          const calculationResult = i * singleCommitmentSize;
          commitments.push({
            label: formatBytes(calculationResult),
            size: calculationResult,
            numUnits: i,
          });
        }
        // TODO: Make a well default instead of logic inside view and rerendering comp:
        numUnits === 0 && setNumUnits(commitments[0].numUnits);
        return (
          <PoSSize
            nextAction={handleNextAction}
            commitments={commitments}
            dataDir={dataDir}
            freeSpace={freeSpace}
            numUnits={numUnits}
            setNumUnit={setNumUnits}
            status={status}
            setMaxFileSize={setMaxFileSize}
            maxFileSize={maxFileSize}
          />
        );
      }
      case 3:
        return (
          <PoSProvider
            nextAction={handleNextAction}
            providers={postSetupComputeProviders}
            provider={provider}
            setProvider={setProvider}
            throttle={throttle}
            setThrottle={setThrottle}
            status={status}
          />
        );
      case 4:
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
        width={!isHideSmesherLeftPanel ? 650 : 760}
        height={450}
        header={headers[mode]}
        headerIcon={posIcon}
        subHeader={subHeader}
      >
        <BackButton action={handlePrevAction} />
        {renderRightSection()}
      </CorneredContainer>
    </Wrapper>
  );
};

export default NodeSetup;
