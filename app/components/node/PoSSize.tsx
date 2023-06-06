import React, { useState } from 'react';
import styled from 'styled-components';
import { Tooltip, Input } from '../../basicComponents';
import { posSpace } from '../../assets/images';
import { smColors } from '../../vars';
import { NodeStatus } from '../../../shared/types';
import { constrain, formatBytes } from '../../infra/utils';
import { convertBytesToMiB, convertMiBToBytes } from '../../../shared/utils';
import PoSFooter from './PoSFooter';

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
  :first-child {
    margin-bottom: 10px;
  }
  :last-child {
    margin-bottom: 30px;
  }
  font-size: 12px;
`;

const Group = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 317px;
  margin-left: 0.5em;
`;

const BottomRow = styled(Row)`
  margin: 25px 0 5px;
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
  font-size: 1.2em;
  line-height: 1.4em;
  color: ${({ theme: { color } }) => color.primary};
`;

const InputWrapper = styled.div`
  width: 245px;
`;

const Dots = styled.div`
  flex: 1;
  flex-shrink: 1;
  overflow: hidden;
  margin: 0 5px;
  font-size: 1.2em;
  line-height: 1.4em;
  color: ${({ theme: { color } }) => color.primary};
`;

const Link = styled.div`
  text-transform: uppercase;
  text-decoration: none;
  color: ${({ theme: { color } }) => color.primary};
  font-size: 1.4em;
  line-height: 1.6em;
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

const WarningText = styled(Text)`
  font-size: 14px;
  position: absolute;
  bottom: -25px;
  right: 0;
  color: ${smColors.orange};
`;

type Props = {
  calculatedSize: number;
  numUnitsConstraint: [number, number];
  dataDir: string;
  numUnits: number;
  numUnitSize: number;
  setNumUnit: (numUnit: number) => void;
  freeSpace: number;
  nextAction: () => void;
  status: NodeStatus | null;
  setMaxFileSize: (maxFileSize: number) => void;
  maxFileSize: number;
};

const DEFAULT_POS_MAX_FILE_SIZE_MB = 10;
const POS_MAX_FILE_SIZE_WARNING_VALUE_MB = 4096;

const PoSSize = ({
  calculatedSize,
  numUnitsConstraint,
  dataDir,
  numUnits,
  numUnitSize,
  setNumUnit,
  freeSpace,
  nextAction,
  status,
  setMaxFileSize,
  maxFileSize,
}: Props) => {
  const [showMaxFileSizeWarning, setShowMaxFileSizeWarning] = useState(false);

  const handleOnChange = ({ value }) => {
    const parsedValue = parseInt(value, 10);
    const mb = Number.isNaN(parsedValue) ? 0 : parsedValue;
    setShowMaxFileSizeWarning(mb > POS_MAX_FILE_SIZE_WARNING_VALUE_MB);
    setMaxFileSize(convertMiBToBytes(mb));
  };

  const handleOnBlur = ({ value }) => {
    const mb = parseInt(value, 10);
    if (DEFAULT_POS_MAX_FILE_SIZE_MB >= mb) {
      setMaxFileSize(convertMiBToBytes(DEFAULT_POS_MAX_FILE_SIZE_MB));
    } else {
      setMaxFileSize(convertMiBToBytes(parseInt(value, 10)));
    }
  };

  return (
    <>
      <Row>
        <Icon1 src={posSpace} />
        <Text>Proof of space size:</Text>
        <Tooltip
          width={250}
          text={[
            `In range ${formatBytes(
              numUnitSize * numUnitsConstraint[0]
            )}...${formatBytes(numUnitSize * numUnitsConstraint[1])}`,
            'Generating this unique data takes time and the processor’s work. Choose thoughtfully.',
          ].join('\n')}
        />
        <Dots>.....................................................</Dots>
        <Group>
          <Text>{formatBytes(numUnitSize)} &times; </Text>
          <Input
            type="number"
            value={numUnits}
            onChange={(e) => setNumUnit(parseInt(e.value, 10))}
            onBlur={(e) =>
              setNumUnit(
                constrain(
                  numUnitsConstraint[0],
                  numUnitsConstraint[1],
                  parseInt(e.value || '0', 10)
                )
              )
            }
            min={numUnitsConstraint[0]}
            max={numUnitsConstraint[1]}
            style={{
              width: '90px',
              margin: '0 1em',
            }}
          />
          <Text>units = {formatBytes(calculatedSize)}</Text>
        </Group>
      </Row>
      <Row>
        <Icon1 src={posSpace} />
        <Text>Max file size (MiB): </Text>
        <Tooltip
          width={200}
          text={
            'PoS data will be stored into a bunch of files with the specified max file size.\n\nPossible range: from 10MB to the value based on your FS (file system) restriction.'
          }
        />
        <Dots>.....................................................</Dots>
        <InputWrapper>
          <Input
            value={convertBytesToMiB(maxFileSize)}
            debounceTime={100}
            min={DEFAULT_POS_MAX_FILE_SIZE_MB}
            onChange={handleOnChange}
            onBlur={handleOnBlur}
          />
        </InputWrapper>
        {showMaxFileSizeWarning && (
          <WarningText>
            Warning: Max file size depends on your file system restriction.
          </WarningText>
        )}
      </Row>
      <BottomRow>
        <Icon3 />
        <Text>PoS data folder: </Text>
        <Dots>.....................................................</Dots>
        <Link>{dataDir}</Link>
      </BottomRow>
      <BottomRow>
        <Text>Free space: {formatBytes(freeSpace)}</Text>
      </BottomRow>
      <PoSFooter action={nextAction} isDisabled={numUnits === 0 || !status} />
    </>
  );
};

export default PoSSize;
