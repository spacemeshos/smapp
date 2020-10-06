import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';

const isDarkModeOn = localStorage.getItem('dmMode') === 'true';
const color = isDarkModeOn ? smColors.white : smColors.realBlack;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 18px;
  height: 18px;
  border: 2px solid ${color};
  margin-right: 5px;
  cursor: pointer;
`;

const InnerWrapper = styled.div`
  width: 10px;
  height: 10px;
  background-color: ${smColors.green};
  cursor: pointer;
`;

type Props = {
  isChecked: boolean,
  check: () => void
};

class Checkbox extends PureComponent<Props> {
  render() {
    const { isChecked, check } = this.props;
    return <Wrapper onClick={check}>{isChecked && <InnerWrapper />}</Wrapper>;
  }
}

export default Checkbox;
