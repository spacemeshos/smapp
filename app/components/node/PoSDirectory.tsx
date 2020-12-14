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
  border-top: 1px solid ${({ theme }) => `1px solid ${theme.isDarkMode ? smColors.white : smColors.realBlack}`};
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
  folder: string;
  setFolder: (folder: string) => void;
  freeSpace: number;
  setFreeSpace: (freeSpace: number) => void;
  commitmentSize: number;
  status: Status | null;
  isDarkMode: boolean;
  skipAction: () => void;
};

const PoSDirectory = ({ skipAction, nextAction, folder, setFolder, freeSpace, setFreeSpace, commitmentSize, status, isDarkMode }: Props) => {
  const [hasPermissionError, setHasPermissionError] = useState(false);

  const icon = isDarkMode ? posDirectoryWhite : posDirectoryBlack;

  const openFolderSelectionDialog = async () => {
    const { error, selectedFolder, freeSpace } = await eventsService.selectPostFolder();
    if (error) {
      setHasPermissionError(true);
    } else {
      setFolder(selectedFolder);
      setFreeSpace(formatBytes(freeSpace));
      setHasPermissionError(false);
    }
  };

  return (
    <>
      <Wrapper>
        <HeaderWrapper>
          <HeaderIcon src={icon} />
          <Header>PoS data folder directory:</Header>
        </HeaderWrapper>
        <Link onClick={openFolderSelectionDialog} text={folder || 'CLICK TO SELECT'} style={linkStyle} />
        <ErrorText>{hasPermissionError ? `SELECT FOLDER WITH MINIMUM ${commitmentSize} GB FREE TO PROCEED` : ''}</ErrorText>
        <FreeSpaceHeader>FREE SPACE...</FreeSpaceHeader>
        <FreeSpace error={hasPermissionError} selected={!!freeSpace}>
          {freeSpace ? `${freeSpace} GB` : 'UNDESIGNATED'}
        </FreeSpace>
      </Wrapper>
      <PoSFooter skipAction={skipAction} isFirstMode action={nextAction} isDisabled={!folder || hasPermissionError || !status} />
    </>
  );
};

export default PoSDirectory;
