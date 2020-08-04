// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { smColors } from '/vars';

const Wrapper = styled.div`
  position: relative;
  overflow-x: hidden;
`;

const Base = styled.div`
  width: 100%;
  font-size: 20px;
  line-height: 20px;
  color: ${smColors.realBlack};
`;

const Progress = styled.div`
  position: asbolute;
  width: ${({ progress }) => progress}%;
  background-color: ${smColors.realBlack};
`;

// const isDarkModeOn = localStorage.getItem('dmMode') === 'true';

type Props = {
  progress: number
};

class ProgressBar extends PureComponent<Props> {
  render() {
    const { progress } = this.props;
    const adjustedProgress = Math.floor(progress / 10) + 1;
    return (
      <Wrapper>
        <Base>░░░░░░░░░░</Base>
        <Progress progress={adjustedProgress} />
      </Wrapper>
    );
  }
}

export default ProgressBar;
