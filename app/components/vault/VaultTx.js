// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';
import { DropDown, Tooltip, Dots } from '/basicComponents';

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
  color: ${({ theme }) => (theme.isDarkModeOn ? smColors.white : smColors.realBlack)};
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

type Props = {
  selectAccountIndex: () => void,
  selectFundAmount: () => void,
  selectGasUnits: () => void,
  selectGasPrice: () => void,
  isDarkModeOn: boolean
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
    const { selectAccountIndex, selectFundAmount, selectGasUnits, selectGasPrice, isDarkModeOn } = this.props;

    const ddStyle = { border: `1px solid ${isDarkModeOn ? smColors.white : smColors.black}`, marginLeft: 'auto', flex: '0 0 340px' };
    const ddStyleGasUnit = { border: `1px solid ${isDarkModeOn ? smColors.white : smColors.black}`, marginLeft: 'auto', flex: '0 0 140px' };
    const ddStyleGasPrice = { border: `1px solid ${isDarkModeOn ? smColors.white : smColors.black}`, marginLeft: 'auto', flex: '0 0 200px' };

    return (
      <>
        <DetailsRow>
          <DetailsText>Daily Spending Accnt</DetailsText>
          <Tooltip width="250" text="Tooltip 1" isDarkModeOn={isDarkModeOn} />
          <Dots />
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
          <Tooltip width="250" text="Tooltip 2" isDarkModeOn={isDarkModeOn} />
          <Dots />
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
          <Tooltip width="250" text="Tooltip 3" isDarkModeOn={isDarkModeOn} />
          <Dots />
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
          <Tooltip width="250" text="Tooltip 4" isDarkModeOn={isDarkModeOn} />
          <Dots />
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
