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

type Props = {
  masterAccountIndex: number;
  selectAccountIndex: ({ index }: { index: number }) => void;
  accountsOption: Account[];
};

const VaultMasterAccounts = ({
  masterAccountIndex,
  selectAccountIndex,
  accountsOption,
}: Props) => (
  <>
    <DetailsRow>
      <DetailsText>Address 1</DetailsText>
      <Tooltip
        width={250}
        text="Use an account managed by this wallet to set yourself as the vault’s owner."
      />
      <Dots />
      <DropDown
        data={accountsOption}
        onClick={selectAccountIndex}
        selectedItemIndex={masterAccountIndex}
        rowHeight={40}
      />
    </DetailsRow>
    <DetailsRow>
      <DetailsText>Address 2</DetailsText>
      <Tooltip
        width={250}
        text="Use an account managed by this wallet to set yourself as the vault’s owner."
      />
      <Dots />
      <DropDown
        data={accountsOption}
        onClick={selectAccountIndex}
        selectedItemIndex={masterAccountIndex}
        rowHeight={40}
      />
    </DetailsRow>
    <DetailsRow>
      <DetailsText>Address 3</DetailsText>
      <Tooltip
        width={250}
        text="Use an account managed by this wallet to set yourself as the vault’s owner."
      />
      <Dots />
      <DropDown
        data={accountsOption}
        onClick={selectAccountIndex}
        selectedItemIndex={masterAccountIndex}
        rowHeight={40}
      />
    </DetailsRow>
  </>
);

export default VaultMasterAccounts;
