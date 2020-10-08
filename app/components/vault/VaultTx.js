// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';
import { DropDown, Tooltip } from '/basicComponents';

const isDarkModeOn = localStorage.getItem('dmMode') === 'true';

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

const ddStyle = { border: `1px solid ${isDarkModeOn ? smColors.white : smColors.black}`, marginLeft: 'auto', flex: '0 0 340px' };
const ddStyleGasUnit = { border: `1px solid ${isDarkModeOn ? smColors.white : smColors.black}`, marginLeft: 'auto', flex: '0 0 140px' };
const ddStyleGasPrice = { border: `1px solid ${isDarkModeOn ? smColors.white : smColors.black}`, marginLeft: 'auto', flex: '0 0 200px' };

type Props = {
  selectAccountIndex: () => void,
  selectFundAmount: () => void,
  selectGasUnits: () => void,
  selectGasPrice: () => void
};

// TODO add auto update data
const accounts = [
  {
    id: 1,
    label: 'acc 1'
  },
  {
    id: 2,
    label: 'acc 2'
  }
];

const gasUnit = [
  {
    id: 1,
    label: '100'
  },
  {
    id: 2,
    label: '200'
  }
];

const unitPrice = [
  {
    id: 1,
    label: '1 Smidge'
  },
  {
    id: 2,
    label: '2 Smidge'
  }
];

class VaultTx extends Component<Props> {
  render() {
    const { selectAccountIndex, selectFundAmount, selectGasUnits, selectGasPrice } = this.props;

    return (
      <>
        <DetailsRow>
          <DetailsText>Daily Spending Accnt</DetailsText>
          <Tooltip top="-2" left="-3" width="250" text="Tooltip 1" />
          <Dots>....................................</Dots>
          <DropDown
            data={accounts}
            onPress={selectAccountIndex}
            DdElement={({ label, text, isMain }) => this.renderAccElement({ label, text, isInDropDown: !isMain })}
            selectedItemIndex={0}
            rowHeight={40}
            style={ddStyle}
            bgColor={smColors.white}
          />
        </DetailsRow>
        <DetailsRow>
          <DetailsText>Fund Amount</DetailsText>
          <Tooltip top="-2" left="-3" width="250" text="Tooltip 2" />
          <Dots>....................................</Dots>
          <DropDown
            data={accounts}
            onPress={selectFundAmount}
            DdElement={({ label, text, isMain }) => this.renderAccElement({ label, text, isInDropDown: !isMain })}
            selectedItemIndex={0}
            rowHeight={40}
            style={ddStyle}
            bgColor={smColors.white}
          />
        </DetailsRow>
        <DetailsRow>
          <DetailsText>Max Gas Units</DetailsText>
          <Tooltip top="-2" left="-3" width="250" text="Tooltip 3" />
          <Dots>....................................</Dots>
          <DropDown
            data={gasUnit}
            onPress={selectGasUnits}
            DdElement={({ label, text, isMain }) => this.renderAccElement({ label, text, isInDropDown: !isMain })}
            selectedItemIndex={0}
            rowHeight={40}
            style={ddStyleGasUnit}
            bgColor={smColors.white}
          />
        </DetailsRow>
        <DetailsRow>
          <DetailsText>Gas Unit Price</DetailsText>
          <Tooltip top="-2" left="-3" width="250" text="Tooltip 4" />
          <Dots>....................................</Dots>
          <DropDown
            data={unitPrice}
            onPress={selectGasPrice}
            DdElement={({ label, text, isMain }) => this.renderAccElement({ label, text, isInDropDown: !isMain })}
            selectedItemIndex={0}
            rowHeight={40}
            style={ddStyleGasPrice}
            bgColor={smColors.white}
          />
        </DetailsRow>
      </>
    );
  }

  renderAccElement = ({ label, isInDropDown }: { label: string, text: string, isInDropDown: boolean }) => (
    <AccItem key={label} isInDropDown={isInDropDown}>
      {label}
    </AccItem>
  );
}

export default VaultTx;
