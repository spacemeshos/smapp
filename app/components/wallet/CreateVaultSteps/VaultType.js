// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { vault } from '/assets/images';
import { smColors } from '/vars';
import Input from '../../../basicComponents/Input';

const isDarkModeOn = localStorage.getItem('dmMode') === 'true';

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
  margin-bottom: 20px;
`;

const HeaderText = styled.div`
  font-size: 32px;
  line-height: 40px;
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

const CheckboxWrap = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 0 0 7px;
`;

const Label = styled.div`
  display: flex;
  align-items: baseline;
`;

const InputTitle = styled.span`
  text-transform: uppercase;
  font-size: 16px;
`;

const InputSubTitle = styled.div`
  margin: 5px 0 45px 20px;
  font-size: 16px;
  line-height: 17px;
  color: ${smColors.disabledGray};
`;

type Props = {
  type: string,
  handleChangeType: () => void
};

type State = {};

class VaultType extends Component<Props, State> {
  render() {
    const { type, handleChangeType } = this.props;
    return (
      <>
        <Header>
          <HeaderIcon src={vault} />
          <HeaderText>VAULT TYPE</HeaderText>
        </Header>
        <SubHeader>
          -- <br /> Select vault type from one of the options below
        </SubHeader>
        <CheckboxWrap>
          <Label>
            <Input type="radio" checked={type === 'single'} name="single" value={'single'} onChange={(e) => handleChangeType(e)} />
            <InputTitle>Simple Vault</InputTitle>
          </Label>
          <InputSubTitle>A vault controlled by a single master account.</InputSubTitle>
          <Label>
            <Input type="radio" checked={type === 'multi-sig'} name="multi-sig" value={'multi-sig'} onChange={(e) => handleChangeType(e)} />
            <InputTitle>Multi-sig Vault</InputTitle>
          </Label>
          <InputSubTitle>A 2/3 multi-sig vault which is controlled by 3 master accounts and requires 2 signatures on each operation.</InputSubTitle>
        </CheckboxWrap>
      </>
    );
  }
}

export default VaultType;
