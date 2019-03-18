// @flow
import React, { memo } from 'react';
import { checkWhite, checkGreen } from '/assets/images';
import styled from 'styled-components';

const Icon = styled.img`
  display: block;
  height: 8px;
  width: 10px;
`;

type Props = {
  mode?: 'white' | 'green'
};

const CheckDone = ({ mode }: { mode?: 'white' | 'green' }) => {
  return <Icon src={mode === 'white' ? checkWhite : checkGreen} alt="done" />;
};

export default memo<Props>(CheckDone);
