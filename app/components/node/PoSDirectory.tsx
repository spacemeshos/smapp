import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from '../../basicComponents';
import { posDirectoryBlack, posDirectoryWhite } from '../../assets/images';
import { eventsService } from '../../infra/eventsService';
import { formatBytes } from '../../infra/utils';
import { smColors } from '../../vars';
import { Status } from '../../types';
import PoSFooter from './PoSFooter';

const Wrapper = styled.div`
  flex-direction: row;
  padding: 15px 25px;
  background-color: ${smColors.disabledGray10Alpha};
  border-top: ${({ theme }) => `1px solid ${theme.isDarkMode ? smColors.white : smColors.realBlack}`};
  clip-path: polygon(0% 0%, 0% 0%, 0% 0%, 100% 0%, 100% 100%, 0% 100%, 5% 100%, 0% 85%);
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: end;
`;

const HeaderIcon = styled.img`
  width: 19px;
  height: 20px;
  margin-right: 5px;
`;

const Header = styled.div`
  margin-bottom: 5px;
  font-size: 17px;
  line-height: 19px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
`;

const ErrorText = styled.div`
  height: 20px;
  margin: 10px 0px 20px;
  font-size: 15px;
  line-height: 17px;
  color: ${smColors.orange};
`;

const FreeSpaceHeader = styled.div`
  margin-bottom: 5px;
  font-size: 17px;
  line-height: 19px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
`;

const FreeSpace = styled.div<{ error: boolean; selected: boolean }>`
  font-size: 17px;
  line-height: 19px;
  ${({ error, selected, theme }) => {
    if (error) {
      return `color: ${smColors.orange}`;
    }
    if (selected) {
      return `color: ${smColors.green}`;
    }
    return `color: ${theme.isDarkMode ? smColors.white : smColors.black}`;
  }}
`;

const linkStyle = { fontSize: '17px', lineHeight: '19px', marginBottom: 5 };

type Props = {
  nextAction: () => void;
  dataDir: string;
  setDataDir: (dataDir: string) => void;
  freeSpace: string;
  setFreeSpace: (freeSpace: string) => void;
  minCommitmentSize: string;
  status: Status | null;
  isDarkMode: boolean;
  skipAction: () => void;
};

// const PoSDirectory = ({ , nextAction, folder, setFolder, freeSpace, setFreeSpace, commitmentSize, status, isDarkMode }: Props) => {
const PoSDirectory = ({ nextAction, skipAction, dataDir, setDataDir, freeSpace, setFreeSpace, minCommitmentSize, status, isDarkMode }: Props) => {
  const [hasPermissionError, setHasPermissionError] = useState(false);

  const icon = isDarkMode ? posDirectoryWhite : posDirectoryBlack;

  const openFolderSelectionDialog = async () => {
    const { error, selectedFolder, calculatedFreeSpace } = await eventsService.selectPostFolder();
    if (error) {
      setHasPermissionError(true);
    } else {
      setDataDir(selectedFolder);
      setFreeSpace(formatBytes(calculatedFreeSpace));
      setHasPermissionError(false);
    }
  };

  return (
    <>
      <Wrapper>
        <HeaderWrapper>
          <HeaderIcon src={icon} />
          <Header>Proof of space data directory:</Header>
        </HeaderWrapper>
        <Link onClick={openFolderSelectionDialog} text={dataDir || 'SELECT DIRECTORY'} style={linkStyle} />
        <ErrorText>{hasPermissionError ? `SELECT FOLDER WITH MINIMUM ${minCommitmentSize} GB FREE TO PROCEED` : ''}</ErrorText>
        {!!freeSpace && <FreeSpaceHeader>FREE SPACE...</FreeSpaceHeader>}
        <FreeSpace error={hasPermissionError} selected={!!freeSpace}>
          {freeSpace ? `${freeSpace} GB` : ''}
        </FreeSpace>
      </Wrapper>
      <PoSFooter action={nextAction} skipAction={skipAction} isDisabled={!dataDir || hasPermissionError || !status} />
    </>
  );
};

export default PoSDirectory;
