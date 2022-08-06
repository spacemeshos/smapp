import React from 'react';
import styled from 'styled-components';
import { smColors } from '../../vars';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 18px;
  height: 18px;
  border: ${({ theme }) => `2px solid ${theme.color.contrast}`};
  margin-right: 5px;
  cursor: pointer;
  ${({
    theme: {
      box: { radius },
    },
  }) => `
  border-radius: ${radius}px;`}
`;

const InnerWrapper = styled.div`
  width: 10px;
  height: 10px;
  background-color: ${smColors.green};
  cursor: pointer;
  ${({
    theme: {
      box: { radius },
    },
  }) => `
  border-radius: ${radius}px;`}
`;

type Props = {
  isChecked: boolean;
  check: () => void;
};

const Checkbox = ({ isChecked, check }: Props) => (
  <Wrapper onClick={check}>{isChecked && <InnerWrapper />}</Wrapper>
);

export default Checkbox;
