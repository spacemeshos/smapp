import React from 'react';
import styled from 'styled-components';

const Progress = styled.div<{ progress: number }>`
  position: absolute;
  width: ${({ progress }) => progress}%;
  top: 0;
  left: 0;
  height: 100%;
  background-color: ${({ theme: { color } }) => color.contrast};
`;

const Base = styled.div`
  position: relative;
  min-width: 100px;
  width: 100%;
  font-size: 20px;
  line-height: 20px;
  height: 20px;
  background-color: ${({ theme: { progressBar } }) => progressBar.background};
`;

type Props = {
  progress: number;
};

const ProgressBar = ({ progress }: Props) => {
  return (
    <Base>
      <Progress progress={progress} />
    </Base>
  );
};

export default ProgressBar;
