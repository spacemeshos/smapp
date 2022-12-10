import React from 'react';
import styled from 'styled-components';
import { DropDown, Tooltip, Dots } from '../../basicComponents';

const DetailsRow = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

const DetailsText = styled.div`
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => theme.color.contrast};
`;

type Props = {
  selectAccountIndex: ({ index }: { index: number }) => void;
  selectFundAmount: ({ index }: { index: number }) => void;
  selectGasUnits: ({ index }: { index: number }) => void;
  selectGasPrice: ({ index }: { index: number }) => void;
};

// TODO add auto update data
const accounts = [
  {
    id: 1,
    label: 'acc 1',
  },
  {
    id: 2,
    label: 'acc 2',
  },
];

const gasUnit = [
  {
    id: 1,
    label: '100',
  },
  {
    id: 2,
    label: '200',
  },
];

const unitPrice = [
  {
    id: 1,
    label: '1 Smidge',
  },
  {
    id: 2,
    label: '2 Smidge',
  },
];

const VaultTx = ({
  selectAccountIndex,
  selectFundAmount,
  selectGasUnits,
  selectGasPrice,
}: Props) => (
  <>
    <DetailsRow>
      <DetailsText>Daily Spending Account</DetailsText>
      <Tooltip width={250} text="Tooltip 1" />
      <Dots />
      <DropDown
        data={accounts}
        onClick={selectAccountIndex}
        selectedItemIndex={0}
        rowHeight={40}
      />
    </DetailsRow>
    <DetailsRow>
      <DetailsText>Fund Amount</DetailsText>
      <Tooltip width={250} text="Tooltip 2" />
      <Dots />
      <DropDown
        data={accounts}
        onClick={selectFundAmount}
        selectedItemIndex={0}
        rowHeight={40}
      />
    </DetailsRow>
    <DetailsRow>
      <DetailsText>Max Gas Units</DetailsText>
      <Tooltip width={250} text="Tooltip 3" />
      <Dots />
      <DropDown
        data={gasUnit}
        onClick={selectGasUnits}
        selectedItemIndex={0}
        rowHeight={40}
      />
    </DetailsRow>
    <DetailsRow>
      <DetailsText>Gas Unit Price</DetailsText>
      <Tooltip width={250} text="Tooltip 4" />
      <Dots />
      <DropDown
        data={unitPrice}
        onClick={selectGasPrice}
        selectedItemIndex={0}
        rowHeight={40}
      />
    </DetailsRow>
  </>
);

export default VaultTx;
