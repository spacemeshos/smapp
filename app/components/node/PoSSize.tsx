import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Tooltip, DropDown } from '../../basicComponents';
import { eventsService } from '../../infra/eventsService';
import { posSpace, posRewardEst, posDirectoryBlack, posDirectoryWhite } from '../../assets/images';
import { smColors } from '../../vars';
import { Status } from '../../types';
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

const Link = styled.div`
  text-transform: uppercase;
  text-decoration: none;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
  font-size: 17px;
  line-height: 19px;
  cursor: pointer;
  &:hover {
    color: ${smColors.blue};
  }
  &.blue {
    text-decoration: underline;
    color: ${smColors.blue};
    &:hover {
      color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
    }
  }
`;

const commitments = [
  { label: '250 GB', size: 250 },
  { label: '500 GB', size: 500 },
  { label: '750 GB', size: 750 }
];

type Props = {
  dataDir: string;
  commitmentSize: number;
  setCommitmentSize: (commitment: number) => void;
  freeSpace: string;
  nextAction: () => void;
  status: Status | null;
  isDarkMode: boolean;
};

const PoSSize = ({ dataDir, commitmentSize, setCommitmentSize, freeSpace, nextAction, status, isDarkMode }: Props) => {
  const [selectedCommitmentIndex, setSelectedCommitmentIndex] = useState(commitmentSize ? commitments.findIndex((com) => com.size === commitmentSize) : 0);
  const [hasErrorFetchingEstimatedRewards, setHasErrorFetchingEstimatedRewards] = useState(false);
  const [loadedEstimatedRewards, setLoadedEstimatedRewards] = useState({ amount: 0 });

  useEffect(() => {
    const loadEstimatedRewards = async () => {
      const { error, estimatedRewards } = await eventsService.getEstimatedRewards();
      if (error) {
        setHasErrorFetchingEstimatedRewards(true);
      } else {
        setLoadedEstimatedRewards(estimatedRewards);
        setHasErrorFetchingEstimatedRewards(false);
      }
    };
    loadEstimatedRewards();
  }, [setHasErrorFetchingEstimatedRewards, setLoadedEstimatedRewards]);

  const renderDDRow = ({ label, isInDropDown }: { label: string; isInDropDown: boolean }) => (
    <CommitmentWrapper isInDropDown={isInDropDown}>
      <Commitment>{label}</Commitment>
    </CommitmentWrapper>
  );

  const selectCommitment = ({ index }: { index: number }) => {
    setSelectedCommitmentIndex(index);
    setCommitmentSize(commitments[selectedCommitmentIndex].size);
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
        {hasErrorFetchingEstimatedRewards ? (
          <ErrorText>Failed to load estimated rewards. Please return to previous step</ErrorText>
        ) : (
          <RewardText selected={selectedCommitmentIndex !== -1}>
            {selectedCommitmentIndex !== -1 ? `${loadedEstimatedRewards.amount * selectedCommitmentIndex} SMESH / EPOCH` : '0 SMESH / EPOCH'}
          </RewardText>
        )}
      </Row>
      <BottomRow>
        <Icon3 src={posDirectoryIcon} />
        <Text>PoS data folder</Text>
        <Dots>.....................................................</Dots>
        <Link>{dataDir}</Link>
      </BottomRow>
      <BottomRow>
        <Text>Free space: {freeSpace} GB</Text>
      </BottomRow>
      <PoSFooter action={nextAction} isDisabled={selectedCommitmentIndex === -1 || !status} />
    </>
  );
};

export default PoSSize;
