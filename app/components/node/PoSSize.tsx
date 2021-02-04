import React, { useState } from 'react';
import styled from 'styled-components';
import { Tooltip, DropDown, Link } from '../../basicComponents';
import { posSpace, posRewardEst, posDirectoryBlack, posDirectoryWhite } from '../../assets/images';
import { smColors } from '../../vars';
import { Status } from '../../types';
import { eventsService } from '../../infra/eventsService';
import { formatBytes } from '../../infra/utils';
import PoSFooter from './PoSFooter';

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
  :first-child {
    margin-bottom: 10px;
  }
  :last-child {
    margin-bottom: 30px;
  }
`;

const BottomRow = styled(Row)`
  margin: 5px 0;
`;

const Icon1 = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 5px;
`;

const Icon2 = styled.img`
  width: 15px;
  height: 20px;
  margin-right: 10px;
`;

const Icon3 = styled.img`
  width: 18px;
  height: 17px;
  margin-right: 7px;
`;

const Text = styled.div`
  font-size: 15px;
  line-height: 17px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
`;

const Dots = styled.div`
  flex: 1;
  flex-shrink: 1;
  overflow: hidden;
  margin: 0 5px;
  font-size: 15px;
  line-height: 17px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const RewardText = styled(Text)<{ selected: boolean }>`
  color: ${({ selected }) => (selected ? smColors.orange : smColors.orange)};
`;

const CommitmentWrapper = styled.div<{ isInDropDown: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5px 5px 5px 10px;
  cursor: inherit;
  color: ${smColors.realBlack};
  &:hover {
    opacity: 1;
    color: ${({ theme }) => (theme.isDarkMode ? smColors.lightGray : smColors.darkGray50Alpha)};
  }
  ${({ isInDropDown }) =>
    isInDropDown &&
    `
     &:hover {
      opacity: 1;
      color: ${smColors.darkGray50Alpha};
    }`}
`;

const ErrorText = styled.div`
  height: 20px;
  font-size: 15px;
  line-height: 17px;
  color: ${smColors.orange};
  position: absolute;
  left: 15px;
  bottom: -15px;
  width: 100%;
}
`;

const Commitment = styled.div`
  font-family: SourceCodeProBold;
  font-size: 16px;
  line-height: 22px;
  cursor: inherit;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.realBlack)};
`;

const commitments = [
  { label: '100 GB', size: 100 },
  { label: '200 GB', size: 200 },
  { label: '300 GB', size: 300 }
];
const linkStyle = { fontSize: '17px', lineHeight: '19px', marginBottom: 5 };

type Props = {
  folder: string;
  commitment: number;
  commitmentSize: number;
  setFolder: (folder: string) => void;
  setCommitment: (commitment: number) => void;
  freeSpace: number;
  setFreeSpace: (freeSpace: number) => void;
  nextAction: () => void;
  status: Status | null;
  isDarkMode: boolean;
};

const PoSSize = ({ folder, commitment, setCommitment, commitmentSize, freeSpace, nextAction, setFolder, setFreeSpace, status, isDarkMode }: Props) => {
  const [selectedCommitmentIndex, setSelectedCommitmentIndex] = useState(commitment ? commitments.findIndex((com) => com.size === commitment) : 0);
  const [hasPermissionError, setHasPermissionError] = useState(false);

  const renderDDRow = ({ label, isInDropDown }: { label: string; isInDropDown: boolean }) => (
    <CommitmentWrapper isInDropDown={isInDropDown}>
      <Commitment>{label}</Commitment>
    </CommitmentWrapper>
  );
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
  const selectCommitment = ({ index }: { index: number }) => {
    setSelectedCommitmentIndex(index);
    setCommitment(commitments[selectedCommitmentIndex].size);
  };

  const ddStyle = {
    color: isDarkMode ? smColors.white : smColors.black,
    marginLeft: 'auto',
    flex: '0 0 125px'
  };

  const posDirectoryIcon = isDarkMode ? posDirectoryWhite : posDirectoryBlack;

  return (
    <>
      <Row>
        <Icon1 src={posSpace} />
        <Text>Proof of space size</Text>
        <Tooltip width={200} text="Some text" isDarkMode={isDarkMode} />
        <Dots>.....................................................</Dots>
        <DropDown
          data={commitments}
          DdElement={({ label, isMain }) => renderDDRow({ label, isInDropDown: !isMain })}
          onClick={selectCommitment}
          selectedItemIndex={selectedCommitmentIndex}
          rowHeight={40}
          style={ddStyle}
          bgColor={isDarkMode ? smColors.black : smColors.white}
          isDarkMode={isDarkMode}
          rowContentCentered={false}
        />
      </Row>
      <Row>
        <Icon2 src={posRewardEst} />
        <Text>Estimated coin reward</Text>
        <Tooltip width={200} text="Some text" isDarkMode={isDarkMode} />
        <Dots>.....................................................</Dots>
        <RewardText selected={selectedCommitmentIndex !== -1}>{selectedCommitmentIndex !== -1 ? '10 SMESH / MONTH' : '0 SMESH / MONTH'}</RewardText>
      </Row>
      <BottomRow>
        <Icon3 src={posDirectoryIcon} />
        <Text>PoS data folder: </Text>
        <Wrapper>
          <Link onClick={openFolderSelectionDialog} text={folder || 'SELECT DIRECTORY'} style={linkStyle} />
          <ErrorText>{hasPermissionError ? `SELECT FOLDER WITH MINIMUM ${commitmentSize} GB FREE TO PROCEED` : ''}</ErrorText>
        </Wrapper>
      </BottomRow>
      <BottomRow>
        <Text>Free space: {freeSpace} GB</Text>
      </BottomRow>
      <PoSFooter action={nextAction} isDisabled={selectedCommitmentIndex === -1 || !status} />
    </>
  );
};

export default PoSSize;
