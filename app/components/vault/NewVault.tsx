import React from 'react';
import styled from 'styled-components';
import { smColors } from '../../vars';
import { Tooltip, Input, Dots } from '../../basicComponents';

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

const inputStyle = { flex: '0 0 240px' };

type Props = {
  vaultName: string;
  onChangeVaultName: ({ value }: { value: string }) => void;
};

const NewVault = ({ vaultName, onChangeVaultName }: Props) => {
  return (
    <>
      <DetailsRow>
        <DetailsText>Vault Name</DetailsText>
        <Tooltip
          width={250}
          text="Vault will be created in My Wallet. To create a vault which uses a Ledger device for signing transactions, create a vault in a Ledger wallet."
        />
        <Dots />
        <Input
          type="text"
          value={vaultName}
          onChange={onChangeVaultName}
          placeholder="MY VAULT NAME"
          maxLength={50}
          style={inputStyle}
          autofocus
        />
      </DetailsRow>
    </>
  );
};

export default NewVault;
