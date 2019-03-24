// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { SmRadioButton } from '/basicComponents';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

type Props = {
  fees: Array<{ fee: number, fiatFee: string, label: string }>,
  onSelect: () => { index: number },
  selectedFeeIndex: number
};

class TxFeeSelector extends PureComponent<Props> {
  render() {
    const { fees, onSelect, selectedFeeIndex } = this.props;
    return (
      <Wrapper>
        {fees.map((feeItem, index) => (
          <SmRadioButton
            key={feeItem.label}
            onSelect={() => onSelect({ index })}
            label={feeItem.label}
            additionalText={feeItem.additionalText}
            isSelected={selectedFeeIndex === index}
            style={{ marginBottom: 15 }}
          />
        ))}
      </Wrapper>
    );
  }
}

export default TxFeeSelector;
