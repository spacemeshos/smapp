import React from 'react';
import styled from 'styled-components';
import { DropDown, Tooltip, Dots } from '../../basicComponents';
import { Account } from '../../../shared/types';

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
  masterAccountIndex: number;
  selectAccountIndex: ({ index }: { index: number }) => void;
  accountsOption: Account[];
};

// TODO add auto update for master accounts
const limits = [
  {
    limit: 1,
    label: '1 Smidge',
    text: '1 Smidge',
  },
  {
    limit: 2,
    label: '2 Smidge',
    text: '2 Smidge',
  },
  {
    limit: 3,
    label: '3 Smidge',
    text: '3 Smidge',
  },
];

const DailySpending = ({
  masterAccountIndex,
  selectAccountIndex,
  accountsOption,
}: Props) => (
  <>
    <DetailsRow>
      <DetailsText>Daily Spending Account</DetailsText>
      <Tooltip width={250} text="Tooltip 1" />
      <Dots />
      <DropDown
        data={accountsOption}
        onClick={selectAccountIndex}
        selectedItemIndex={masterAccountIndex}
        rowHeight={40}
      />
    </DetailsRow>
    <DetailsRow>
      <DetailsText>Daily Spending Limit</DetailsText>
      <Tooltip width={250} text="Tooltip 2" />
      <Dots />
      <DropDown
        data={limits}
        onClick={selectAccountIndex}
        selectedItemIndex={masterAccountIndex}
        rowHeight={40}
      />
    </DetailsRow>
  </>
);

export default DailySpending;
