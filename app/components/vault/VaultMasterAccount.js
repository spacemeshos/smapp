// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { vault } from '/assets/images';
import { smColors } from '/vars';
import { DropDown, Tooltip } from '/basicComponents';

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

const AccItem = styled.div`
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

const ddStyle = { border: `1px solid ${isDarkModeOn ? smColors.white : smColors.black}`, marginLeft: 'auto', flex: '0 0 240px' };

type Props = {
  masterAccountIndex: number,
  selectedAccountIndex: () => void
};

type State = {
  vaultName: string
};

// TODO add auto update for master accounts
const masterAccounts = [
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

class VaultMasterAccount extends Component<Props, State> {
  render() {
    const { masterAccountIndex, selectedAccountIndex } = this.props;

    return (
      <>
        <Header>
          <HeaderIcon src={vault} />
          <HeaderText>Vault Master Account</HeaderText>
        </Header>
        <SubHeader>
          -- <br />
          The master account is the account that will be used to perform vault operations such as withdrawing funds.
        </SubHeader>
        <DetailsRow>
          <DetailsRow>
            <DetailsText>Vault Name</DetailsText>
            <Tooltip top="-2" left="-3" width="250" text="Use an account managed by this wallet to set yourself as the vault’s owner." />
            <Dots>....................................</Dots>
            <DropDown
              data={masterAccounts}
              onPress={selectedAccountIndex}
              DdElement={({ label, text, isMain }) => this.renderAccElement({ label, text, isInDropDown: !isMain })}
              selectedItemIndex={masterAccountIndex}
              rowHeight={40}
              style={ddStyle}
              bgColor={smColors.white}
            />
          </DetailsRow>
        </DetailsRow>
      </>
    );
  }

  renderAccElement = ({ label, text, isInDropDown }: { label: string, text: string, isInDropDown: boolean }) => (
    <AccItem key={label} isInDropDown={isInDropDown}>
      {label} {text}
    </AccItem>
  );
}

export default VaultMasterAccount;
