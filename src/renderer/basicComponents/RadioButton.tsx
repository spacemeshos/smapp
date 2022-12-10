import React from 'react';
import styled from 'styled-components';
import { smColors } from '../vars';

const Input = styled.input`
  position: relative;
  height: 18px;
  width: 18px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
  }
  ::before {
    content: '';
    position: absolute;
    top: 70%;
    left: calc(50% - 10px);
    width: 14px;
    height: 14px;
    border-radius: 50%;
    -webkit-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
    border: 1px solid ${smColors.white};
  }
  :checked::after {
    content: '';
    position: absolute;
    top: 70%;
    left: calc(50% - 10px);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${smColors.green};
    transform: translate(-50%, -50%);
    visibility: visible;
  }
`;

type Props = {
  onChange: ({ value }: { value: string }) => void;
  value: string;
  checked?: boolean;
  name?: string;
};

const RadioButton = ({ onChange, value, checked, name }: Props) => (
  <Input
    value={value}
    checked={checked}
    name={name}
    onChange={({ target }: { target: { value: string } }) => {
      const { value } = target;
      onChange({ value });
    }}
    type="radio"
  />
);

export default RadioButton;
