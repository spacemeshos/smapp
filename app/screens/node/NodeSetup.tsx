import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { deletePosData, pauseSmeshing, startSmeshing } from '../../redux/smesher/actions';
import { CorneredContainer, BackButton } from '../../components/common';
import { PoSModifyPostData, PoSDirectory, PoSSize, PoSProvider, PoSSummary } from '../../components/node';
import { StepsContainer } from '../../basicComponents';
import { posIcon } from '../../assets/images';
import { formatBytes, getAddress } from '../../infra/utils';
import { BITS, AppThDispatch, RootState } from '../../types';
import { PostSetupComputeProvider } from '../../../shared/types';
import ErrorMessage from '../../basicComponents/ErrorMessage';
import { MainPath } from '../../routerPaths';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const headers = ['PROOF OF SPACE DATA', 'PROOF OF SPACE DIRECTORY', 'PROOF OF SPACE SIZE', 'POS PROCESSOR', 'POS SETUP'];
const subHeaders = [
  '',
  '',
  'Select how much free space to commit to Spacemesh.\nThe more space you commit, the higher your smeshing rewards will be.',
  'Select a supported graphic processor to use for creating your proof of space',
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
    state: { modifyPostData: boolean };
  };
}

const NodeSetup = ({ history, location }: Props) => {
  const accounts = useSelector((state: RootState) => state.wallet.accounts);
  const status = useSelector((state: RootState) => state.node.status);
  const postSetupComputeProviders = useSelector((state: RootState) => state.smesher.postSetupComputeProviders);
  const existingDataDir = useSelector((state: RootState) => state.smesher.dataDir);
  const smesherConfig = useSelector((state: RootState) => state.smesher.config);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const hideSmesherLeftPanel = useSelector((state: RootState) => state.ui.hideSmesherLeftPanel);
  const [mode, setMode] = useState(location?.state?.modifyPostData ? 0 : 1);
  const [dataDir, setDataDir] = useState(existingDataDir || '');
  const [freeSpace, setFreeSpace] = useState('');
  const [numUnits, setNumUnits] = useState(0);
  const [provider, setProvider] = useState<PostSetupComputeProvider>();
  const [throttle, setThrottle] = useState(false);

  const dispatch: AppThDispatch = useDispatch();

  const commitmentSize = (smesherConfig.labelsPerUnit * smesherConfig.bitsPerLabel * smesherConfig.minNumUnits) / BITS;
  const formattedCommitmentSize = formatBytes(commitmentSize);
  const getPosDirectorySubheader = () => (
    <>
      {Number.isNaN(commitmentSize) ? (
        <ErrorMessage align="left" oneLine={false}>
          The node is down. Please, restart the node first on the Network screen.
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
  const hasBackButton = location?.state?.modifyPostData || mode !== 1;

  const setupAndInitMining = async () => {
    if (!provider) return; // TODO
    const done = await dispatch(startSmeshing({ coinbase: `0x${getAddress(accounts[0].publicKey)}`, dataDir, numUnits, provider: provider.id, throttle }));
    if (done) {
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
    await dispatch(pauseSmeshing());
    handleNextAction();
  };

  const handleDeletePosData = async () => {
    await dispatch(deletePosData());
    history.push('/main/wallet/');
  };

  const handlePrevAction = () => {
    if (mode === 0) {
      history.goBack();
    } else {
      setMode(mode - 1);
    }
  };

  const renderRightSection = () => {
    switch (mode) {
      case 0:
        return <PoSModifyPostData modify={handleModifyPosData} deleteData={handleDeletePosData} isDarkMode={isDarkMode} />;
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
            isDarkMode={isDarkMode}
            skipAction={() => history.push(MainPath.Wallet)}
          />
        );
      case 2: {
        const commitments: Commitment[] = [];
        const singleCommitmentSize = (smesherConfig.bitsPerLabel * smesherConfig.labelsPerUnit) / BITS;
        for (let i = smesherConfig.minNumUnits; i <= smesherConfig.maxNumUnits; i += 1) {
          const calculationResult = i * singleCommitmentSize;
          commitments.push({ label: formatBytes(calculationResult), size: calculationResult, numUnits: i });
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
            isDarkMode={isDarkMode}
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
            isDarkMode={isDarkMode}
          />
        );
      case 4:
        return (
          <PoSSummary
            isDarkMode={isDarkMode}
            dataDir={dataDir}
            commitmentSize={smesherConfig ? formatBytes((smesherConfig.bitsPerLabel * smesherConfig.labelsPerUnit * numUnits) / BITS) : '0'}
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
      {!hideSmesherLeftPanel && <StepsContainer steps={['SETUP WALLET', 'SETUP PROOF OF SPACE']} currentStep={1} isDarkMode={isDarkMode} />}
      <CorneredContainer isDarkMode={isDarkMode} width={!hideSmesherLeftPanel ? 650 : 760} height={450} header={headers[mode]} headerIcon={posIcon} subHeader={subHeader}>
        {hasBackButton && <BackButton action={handlePrevAction} />}
        {renderRightSection()}
      </CorneredContainer>
    </Wrapper>
  );
};

export default NodeSetup;
