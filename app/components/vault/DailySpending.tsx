import React from 'react';
import styled from 'styled-components';
import { smColors } from '../../vars';
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
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.realBlack)};
`;

const AccItem = styled.div<{ isInDropDown: boolean }>`
  font-size: 13px;
  line-height: 17px;
  color: ${smColors.black};
  padding: 5px;
  width: 100%;
  cursor: inherit;
  ${({ isInDropDown }) => isInDropDown && `opacity: 0.5; border-bottom: 1px solid ${smColors.disabledGray};`}
  &:hover {
    opacity: 1;
    color: ${smColors.darkGray50Alpha};
  }
`;

type Props = {
  masterAccountIndex: number;
  selectAccountIndex: ({ index }: { index: number }) => void;
  isDarkMode: boolean;
};

// TODO add auto update for master accounts
const accounts = [
  {
    account: 1,
    label: 'acc 1',
    text: 'vault 1'
  },
  {
    account: 2,
    label: 'acc 2',
    text: 'vault 2'
  },
  {
    account: 3,
    label: 'acc 3',
    text: 'vault 3'
  }
];

const limits = [
  {
    limit: 1,
    label: '1 Smidge',
    text: '1 Smidge'
  },
  {
    limit: 2,
    label: '2 Smidge',
    text: '2 Smidge'
  },
  {
    limit: 3,
    label: '3 Smidge',
    text: '3 Smidge'
  }
];

const DailySpending = ({ masterAccountIndex, selectAccountIndex, isDarkMode }: Props) => {
  const ddStyle = { border: `1px solid ${isDarkMode ? smColors.white : smColors.black}`, marginLeft: 'auto', flex: '0 0 240px' };

  const renderAccElement = ({ label, text, isInDropDown }: { label: string; text: string; isInDropDown: boolean }) => (
    <AccItem key={label} isInDropDown={isInDropDown}>
      {label} {text}
    </AccItem>
  );

  return (
    <>
      <DetailsRow>
        <DetailsText>Daily Spending Accnt</DetailsText>
        <Tooltip width={250} text="Tooltip 1" isDarkMode={isDarkMode} />
        <Dots />
        <DropDown
          data={accounts}
          onClick={selectAccountIndex}
          DdElement={({ label, text, isMain }) => renderAccElement({ label, text, isInDropDown: !isMain })}
          selectedItemIndex={masterAccountIndex}
          rowHeight={40}
          style={ddStyle}
          bgColor={smColors.white}
        />
      </DetailsRow>
      <DetailsRow>
        <DetailsText>Daily Spending Limit</DetailsText>
        <Tooltip width={250} text="Tooltip 2" isDarkMode={isDarkMode} />
        <Dots />
        <DropDown
          data={limits}
          onClick={selectAccountIndex}
          DdElement={({ label, text, isMain }) => renderAccElement({ label, text, isInDropDown: !isMain })}
          selectedItemIndex={masterAccountIndex}
          rowHeight={40}
          style={ddStyle}
          bgColor={smColors.white}
        />
      </DetailsRow>
    </>
  );
};

export default DailySpending;
