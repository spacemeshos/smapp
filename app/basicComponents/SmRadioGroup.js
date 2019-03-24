// @flow
import React from 'react';
import styled from 'styled-components';
import { SmRadioButton } from '/basicComponents';
import type { RadioEntry } from './SmRadioButton';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

type Props = {
  onSelect?: ({ index: number }) => void,
  selectedIndex?: number,
  data: RadioEntry[]
};

class SmRadioGroup extends React.Component<Props> {
  render() {
    const { data, selectedIndex, onSelect } = this.props;
    return (
      <Wrapper>
        {data.map((btn, index) => (
          <SmRadioButton
            key={`${btn.label}${index}`}
            isSelected={selectedIndex === index}
            isDisabled={btn.isDisabled}
            onSelect={btn.isDisabled ? null : () => onSelect && onSelect({ index })}
          />
        ))}
      </Wrapper>
    );
  }
}

export default SmRadioGroup;
