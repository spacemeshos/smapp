import React, { useState } from 'react';
import styled from 'styled-components';
import { Tooltip, DropDown, Input } from '../../basicComponents';
import { posSpace } from '../../assets/images';
import { smColors } from '../../vars';
import {
  DEFAULT_POS_MAX_FILE_SIZE,
  DEFAULT_POS_MAX_FILE_SIZE_LIMIT,
  NodeStatus,
} from '../../../shared/types';
import { convertBytesToGB, convertGBToBytes } from '../../../shared/utils';
import { constrain } from '../../infra/utils';
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

const Icon3 = styled.img.attrs(({ theme: { icons: { posDirectory } } }) => ({
  src: posDirectory,
}))`
  width: 18px;
  height: 17px;
  margin-right: 7px;
`;

const Text = styled.div`
  font-size: 15px;
  line-height: 17px;
  color: ${({ theme: { color } }) => color.primary};
`;

const InputWrapper = styled.div`
  width: 250px;
`;

const Dots = styled.div`
  flex: 1;
  flex-shrink: 1;
  overflow: hidden;
  margin: 0 5px;
  font-size: 15px;
  line-height: 17px;
  color: ${({ theme: { color } }) => color.primary};
`;

const Link = styled.div`
  text-transform: uppercase;
  text-decoration: none;
  color: ${({ theme: { color } }) => color.primary};
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
      color: ${({ theme: { color } }) => color.primary};
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
  setMaxFileSize: (maxFileSize: number) => void;
  maxFileSize: number;
};

const PoSSize = ({
  commitments,
  dataDir,
  numUnits,
  setNumUnit,
  freeSpace,
  nextAction,
  status,
  setMaxFileSize,
  maxFileSize,
}: Props) => {
  const [selectedCommitmentIndex, setSelectedCommitmentIndex] = useState(
    numUnits ? commitments.findIndex((com) => com.numUnits === numUnits) : 0
  );

  const selectCommitment = ({ index }: { index: number }) => {
    setSelectedCommitmentIndex(index);
    setNumUnit(commitments[index].numUnits);
  };

  const constrainPosMaxFileSize = (value: number) =>
    constrain(
      DEFAULT_POS_MAX_FILE_SIZE,
      DEFAULT_POS_MAX_FILE_SIZE_LIMIT,
      Number.isNaN(value) ? 0 : value
    );

  const handleOnChange = ({ value }) => {
    const valueInBytes = convertGBToBytes(parseInt(value, 10));
    if (valueInBytes > DEFAULT_POS_MAX_FILE_SIZE * 50) {
      setMaxFileSize(DEFAULT_POS_MAX_FILE_SIZE_LIMIT);
      return;
    }
    setMaxFileSize(valueInBytes);
  };

  const handleMaxFileSize = ({ value }) => {
    setMaxFileSize(
      constrainPosMaxFileSize(convertGBToBytes(parseInt(value, 10)))
    );
  };

  return (
    <>
      <Row>
        <Icon1 src={posSpace} />
        <Text>Proof of space size</Text>
        <Tooltip
          width={250}
          text="Generating this unique data takes time and the processor’s work. Choose thoughtfully."
        />
        <Dots>.....................................................</Dots>
        <DropDown
          data={commitments}
          onClick={selectCommitment}
          selectedItemIndex={selectedCommitmentIndex}
          rowHeight={40}
          bold
        />
      </Row>
      <Row>
        <Icon1 src={posSpace} />
        <Text>Max file size, GB: </Text>
        <Tooltip
          width={200}
          text={
            'PoS data will be stored into a bunch of files with the specified max file size.\n\nPossible range 2 - 100 GB.'
          }
        />
        <Dots>.....................................................</Dots>
        <InputWrapper>
          <Input
            value={convertBytesToGB(maxFileSize)}
            type="number"
            debounceTime={100}
            onChangeDebounced={handleOnChange}
            onBlur={(value) => {
              handleMaxFileSize({ value });
            }}
          />
        </InputWrapper>
      </Row>
      <BottomRow>
        <Icon3 />
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
