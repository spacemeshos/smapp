// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';
import { Tooltip, RadioButton } from '/basicComponents';

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
        <Label>
          <RadioButton checked={type === 'single'} name="single" value={'single'} onChange={(e) => handleChangeType(e)} />
          <InputTitle>Simple Vault</InputTitle>
          <Tooltip top="-2" left="-3" width="250" text="Simple Vault" />
        </Label>
        <InputSubTitle>A vault controlled by a single master account.</InputSubTitle>
        <Label>
          <RadioButton checked={type === 'multi-sig'} name="multi-sig" value={'multi-sig'} onChange={(e) => handleChangeType(e)} />
          <InputTitle>Multi-sig Vault</InputTitle>
          <Tooltip top="-2" left="-3" width="250" text="Multi-sig Vault" />
        </Label>
        <InputSubTitle>A 2/3 multi-sig vault which is controlled by 3 master accounts and requires 2 signatures on each operation.</InputSubTitle>
      </>
    );
  }
}

export default VaultType;
