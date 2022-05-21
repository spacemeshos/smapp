import React from 'react';
import styled from 'styled-components';
import { smColors } from '../../vars';
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
  color: ${({ theme }) =>
    theme.isDarkMode ? smColors.white : smColors.realBlack};
`;

const AccItem = styled.div`
  font-size: 13px;
  line-height: 17px;
  color: ${smColors.black};
  padding: 5px;
  width: 100%;
  cursor: inherit;
`;

type Props = {
  masterAccountIndex: number;
  selectedAccountIndex: ({ index }: { index: number }) => void;
  isDarkMode: boolean;
  accountsOption: Account[];
};

const VaultMasterAccount = ({
  masterAccountIndex,
  selectedAccountIndex,
  isDarkMode,
  accountsOption,
}: Props) => {
  const ddStyle = {
    border: `1px solid ${isDarkMode ? smColors.white : smColors.black}`,
    marginLeft: 'auto',
    flex: '0 0 240px',
  };

  const renderAccElement = ({
    label,
    text,
  }: {
    label: string;
    text: string;
  }) => (
    <AccItem key={label}>
      {label} {text}
    </AccItem>
  );

  return (
    <>
      <DetailsRow>
        <DetailsText>Account</DetailsText>
        <Tooltip
          width={250}
          text="Use an account managed by this wallet to set yourself as the vault’s owner."
        />
        <Dots />
        <DropDown
          data={accountsOption}
          onClick={selectedAccountIndex}
          DdElement={({ label, text }) => renderAccElement({ label, text })}
          selectedItemIndex={masterAccountIndex}
          rowHeight={40}
          style={ddStyle}
          bgColor={smColors.white}
        />
      </DetailsRow>
    </>
  );
};

export default VaultMasterAccount;
