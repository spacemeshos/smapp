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
  selectedAccountIndex: ({ index }: { index: number }) => void;
  accountsOption: Account[];
};

const VaultMasterAccount = ({
  masterAccountIndex,
  selectedAccountIndex,
  accountsOption,
}: Props) => (
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
        selectedItemIndex={masterAccountIndex}
        rowHeight={40}
        bgColor={smColors.white}
      />
    </DetailsRow>
  </>
);

export default VaultMasterAccount;
