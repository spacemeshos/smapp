// @flow
import React from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';

const Wrapper = styled.div`
  position: relative;
  overflow-x: hidden;
`;

const Progress = styled.div`
  position: absolute;
  width: ${({ progress }) => progress}%;
  top: 0;
  left: 0;
  height: 100%;
  background-color: ${smColors.realBlack};
`;

const Base = styled.div`
  font-family: 'Helvetica Neue';
  width: 100%;
  font-size: 20px;
  line-height: 20px;
  color: ${smColors.realBlack};
`;

// const isDarkModeOn = localStorage.getItem('dmMode') === 'true';

type Props = {
  progress: number
};

const ProgressBar = ({ progress }: Props) => {
  const adjustedProgress = Math.floor(progress * 10) + 1;
  return (
    <Wrapper>
      <Base>░░░░░░░░░░░░░░░░░░░░░░</Base>
      <Progress progress={adjustedProgress} />
    </Wrapper>
  );
};

export default ProgressBar;
