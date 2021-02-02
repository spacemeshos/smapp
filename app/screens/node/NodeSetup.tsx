import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { initMining } from '../../redux/node/actions';
import { CorneredContainer, BackButton } from '../../components/common';
import { PoSModifyPostData, PoSDirectory, PoSSize, PoSProcessor, PoSSummary } from '../../components/node';
import { ScreenErrorBoundary } from '../../components/errorHandler';
import { StepsContainer, SmallHorizontalPanel } from '../../basicComponents';
import { posIcon } from '../../assets/images';
import { formatBytes } from '../../infra/utils';
import { RootState } from '../../types';

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
  'Review your proof of space data creation options.\nClick a link to go back and edit that item.'
];

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
  const posDataPath = useSelector((state: RootState) => state.node.posDataPath);
  const commitmentSize = useSelector((state: RootState) => state.node.commitmentSize);
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);
  const hideSmesherLeftPanel = useSelector((state: RootState) => state.ui.hideSmesherLeftPanel);
  const [mode, setMode] = useState(location?.state?.modifyPostData ? 0 : 1);
  const [folder, setFolder] = useState(posDataPath || '');
  const [freeSpace, setFreeSpace] = useState(0);
  const [commitment, setCommitment] = useState(0);
  const [processor, setProcessor] = useState(null);
  const [isPausedOnUsage, setIsPausedOnUsage] = useState(false);

  const dispatch = useDispatch();

  const formattedCommitmentSize = formatBytes(commitmentSize);
  const subHeader = mode !== 1 ? subHeaders[mode] : `Select a directory to save your proof og space data.\nMinimum ${formattedCommitmentSize} of free space is required`;
  const hasBackButton = location?.state?.modifyPostData || mode !== 1;

  const setupAndInitMining = async () => {
    localStorage.setItem('isWalletOnlySetup', 'false');
    await dispatch(initMining({ logicalDrive: folder, address: accounts[0].publicKey, commitment, processor, isPausedOnUsage })); // TODO: use user selected commitment
    history.push('/main/node', { showIntro: true });
  };

  const handleNextAction = () => {
    if (mode !== 4) {
      setMode(mode + 1);
    } else {
      setupAndInitMining();
    }
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
        return <PoSModifyPostData modify={handleNextAction} deleteData={() => {}} isDarkMode={isDarkMode} />;
      case 1:
        return (
          <PoSDirectory
            nextAction={handleNextAction}
            commitmentSize={formattedCommitmentSize}
            folder={folder}
            setFolder={setFolder}
            freeSpace={freeSpace}
            setFreeSpace={setFreeSpace}
            status={status}
            isDarkMode={isDarkMode}
            skipAction={() => history.push('/main/wallet')}
          />
        );
      case 2:
        return (
          <PoSSize
            nextAction={handleNextAction}
            folder={folder}
            commitmentSize={formattedCommitmentSize}
            setFolder={setFolder}
            setFreeSpace={setFreeSpace}
            freeSpace={freeSpace}
            commitment={commitment}
            setCommitment={setCommitment}
            status={status}
            isDarkMode={isDarkMode}
          />
        );
      case 3:
        return (
          <PoSProcessor
            nextAction={handleNextAction}
            processor={processor}
            setProcessor={setProcessor}
            isPausedOnUsage={isPausedOnUsage}
            setIsPausedOnUsage={setIsPausedOnUsage}
            status={status}
            isDarkMode={isDarkMode}
          />
        );
      case 4:
        return (
          <PoSSummary
            folder={folder}
            commitment={commitment}
            processor={processor}
            isDarkMode={isDarkMode}
            isPausedOnUsage={isPausedOnUsage}
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
        <SmallHorizontalPanel isDarkMode={isDarkMode} />
        {hasBackButton && <BackButton action={handlePrevAction} />}
        {renderRightSection()}
      </CorneredContainer>
    </Wrapper>
  );
};

export default ScreenErrorBoundary(NodeSetup);
