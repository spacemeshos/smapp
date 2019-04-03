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
  fees: Array<Object>,
  onSelect: ({ index: number }) => void,
  selectedFeeIndex: number,
  fiatRate: number
};

class TxFeeSelector extends PureComponent<Props> {
  render() {
    const { fees, onSelect, selectedFeeIndex, fiatRate } = this.props;
    return (
      <Wrapper>
        {fees.map((feeItem, index) => (
          <SmRadioButton
            key={feeItem.label}
            onSelect={() => onSelect({ index })}
            label={feeItem.label}
            additionalText={`${feeItem.additionalText}${feeItem.fee * fiatRate} USD`}
            isSelected={selectedFeeIndex === index}
            style={{ marginBottom: 15 }}
          />
        ))}
      </Wrapper>
    );
  }
}

export default TxFeeSelector;
