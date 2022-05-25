import React, { useState } from 'react';
import styled from 'styled-components';
import { Tooltip, DropDown } from '../../basicComponents';
import {
  posSpace,
  posRewardEst,
  posDirectoryBlack,
  posDirectoryWhite,
} from '../../assets/images';
import { smColors } from '../../vars';
import { NodeStatus } from '../../../shared/types';
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

const CommitmentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5px 5px 5px 10px;
  cursor: inherit;
  color: ${smColors.realBlack};
`;

const Commitment = styled.div`
  font-weight: 800;
  font-size: 16px;
  line-height: 22px;
  cursor: inherit;
  color: ${({ theme }) =>
    theme.isDarkMode ? smColors.white : smColors.realBlack};
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
      color: ${({ theme }) =>
        theme.isDarkMode ? smColors.white : smColors.black};
    }
  }
`;

interface Commitment {
  label: string;
  size: number;
  numUnits: number;
}

type Props = {
  commitments: Commitment[];
  dataDir: string;
  numUnits: number;
  setNumUnit: (numUnit: number) => void;
  freeSpace: string;
  nextAction: () => void;
  status: NodeStatus | null;
  isDarkMode: boolean;
};

const PoSSize = ({
  commitments,
  dataDir,
  numUnits,
  setNumUnit,
  freeSpace,
  nextAction,
  status,
  isDarkMode,
}: Props) => {
  const [selectedCommitmentIndex, setSelectedCommitmentIndex] = useState(
    numUnits ? commitments.findIndex((com) => com.numUnits === numUnits) : 0
  );
  const [hasErrorFetchingEstimatedRewards] = useState(false);
  // const [loadedEstimatedRewards, setLoadedEstimatedRewards] = useState({ amount: 0 });

  // useEffect(() => { // TODO: uncomment when api endpoint implemented in node
  //   const loadEstimatedRewards = async () => {
  //     const { error, estimatedRewards } = await eventsService.getEstimatedRewards();
  //     if (error) {
  //       setHasErrorFetchingEstimatedRewards(true);
  //     } else {
  //       setLoadedEstimatedRewards(estimatedRewards);
  //       setHasErrorFetchingEstimatedRewards(false);
  //     }
  //   };
  //   loadEstimatedRewards();
  // }, [setHasErrorFetchingEstimatedRewards, setLoadedEstimatedRewards]);

  const renderDDRow = ({ label }: { label: string }) => (
    <CommitmentWrapper>
      <Commitment>{label}</Commitment>
    </CommitmentWrapper>
  );

  const selectCommitment = ({ index }: { index: number }) => {
    setSelectedCommitmentIndex(index);
    setNumUnit(commitments[index].numUnits);
  };

  const ddStyle = {
    color: isDarkMode ? smColors.white : smColors.black,
    marginLeft: 'auto',
    flex: '0 0 125px',
  };

  const posDirectoryIcon = isDarkMode ? posDirectoryWhite : posDirectoryBlack;

  return (
    <>
      <Row>
        <Icon1 src={posSpace} />
        <Text>Proof of space size</Text>
        <Tooltip width={200} text="Some text" />
        <Dots>.....................................................</Dots>
        <DropDown
          data={commitments}
          DdElement={({ label }) => renderDDRow({ label })}
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
        <Tooltip width={200} text="Some text" />
        <Dots>.....................................................</Dots>
        {hasErrorFetchingEstimatedRewards ? (
          <ErrorText>
            Failed to load estimated rewards. Please return to previous step
          </ErrorText>
        ) : (
          <RewardText selected={selectedCommitmentIndex !== -1}>
            {selectedCommitmentIndex !== -1
              ? `10 SMESH / EPOCH`
              : '0 SMESH / EPOCH'}
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
        <Text>Free space: {freeSpace}</Text>
      </BottomRow>
      <PoSFooter
        action={nextAction}
        isDisabled={selectedCommitmentIndex === -1 || !status}
      />
    </>
  );
};

export default PoSSize;
