// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { vault } from '/assets/images';
import { smColors } from '/vars';
import Input from '../../../basicComponents/Input';
import QuestionMarkTooltip from '../../../basicComponents/QuestionMarkTooltip';
import { tooltip } from '../../../assets/images';

const isDarkModeOn = localStorage.getItem('dmMode') === 'true';

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
  margin: 10px 0 20px 0;
`;

const HeaderText = styled.div`
  font-size: 32px;
  line-height: 25px;
  text-transform: uppercase;
  color: ${isDarkModeOn ? smColors.white : smColors.black};
`;

const HeaderIcon = styled.img`
  width: 30px;
  height: 29px;
  margin: auto 0;
  margin-right: 5px;
`;

const SubHeader = styled.div`
  margin-bottom: 20px;
  font-size: 16px;
  line-height: 20px;
  color: ${isDarkModeOn ? smColors.white : smColors.black};
};
`;

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
  color: ${isDarkModeOn ? smColors.white : smColors.realBlack};
`;

const Dots = styled.div`
  flex: 1;
  flex-shrink: 1;
  overflow: hidden;
  margin-right: 12px;
  font-size: 16px;
  line-height: 20px;
  color: ${isDarkModeOn ? smColors.white : smColors.realBlack};
`;

const ToolTipIcon = styled.img`
  margin-left: 5px;
  width: 13px;
`;

const TooltipWrap = styled.div`
  position: relative;
  &:hover .questionMark {
    display: block;
  }
`;

const inputStyle = { flex: '0 0 240px' };

type Props = {
  vaultName: string,
  onChangeVaultName: () => void
};

type State = {
  vaultName: string
};

class NewVault extends Component<Props, State> {
  render() {
    const { vaultName, onChangeVaultName } = this.props;

    return (
      <>
        <Header>
          <HeaderIcon src={vault} />
          <HeaderText>New Vault</HeaderText>
          <TooltipWrap>
            <ToolTipIcon src={tooltip} />
            <QuestionMarkTooltip
              className="questionMark"
              text="Vault will be created in My Wallet. To create a vault which uses a Ledger device for signing transactions, create a vault in a Ledger wallet."
            />
          </TooltipWrap>
        </Header>
        <SubHeader>
          -- <br /> A vault is enhanced account with extra and spending features.
        </SubHeader>
        <DetailsRow>
          <DetailsText>Vault Name</DetailsText>
          <TooltipWrap>
            <ToolTipIcon src={tooltip} />
            <QuestionMarkTooltip
              className="questionMark"
              text="Vault will be created in My Wallet. To create a vault which uses a Ledger device for signing transactions, create a vault in a Ledger wallet."
            />
          </TooltipWrap>
          <Dots>....................................</Dots>
          <Input type="text" value={vaultName} onChange={onChangeVaultName} placeholder="MY VAULT NAME" maxLength={50} style={inputStyle} />
        </DetailsRow>
      </>
    );
  }
}

export default NewVault;
