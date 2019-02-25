// @flow
import React from 'react';
import { LoadingImageSource, VImageSource, VWhiteImageSource } from '/assets/images';
import styled, { keyframes } from 'styled-components';

type SmallLoaderProps = {
  isLoading: boolean,
  mode?: 'normal' | 'white',
  loadingTop?: number,
  loadingLeft?: number,
  loadingSize?: number,
  doneTop?: number,
  doneLeft?: number,
  doneSize?: number
};

// $FlowStyledIssue
const StyledMovement = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
`;

// $FlowStyledIssue
const StyledIcon = styled.img`
  position: absolute;
  top: ${({ isLoading, loadingTop, doneTop }) => (isLoading ? (loadingTop || 14) : (doneTop || 18))}px;
  left: ${({ isLoading, loadingLeft, doneLeft }) => (isLoading ? (loadingLeft || 8) : (doneLeft || 8))}px;
  height: ${({ isLoading, loadingSize, doneSize }) => (isLoading ? (loadingSize || 20) : (doneSize || 12))}px;
  width: ${({ isLoading, loadingSize, doneSize }) => (isLoading ? (loadingSize || 20) : (doneSize || 12))}px;
  transition: 'all .2s linear;
`;

const AnimatedIcon = styled(StyledIcon)`
  animation: ${StyledMovement} 3s infinite linear;
`;

export default class SmallLoader extends React.Component<SmallLoaderProps> {
  render() {
    const { isLoading, mode } = this.props;

    const VImgSource = mode && mode === 'white' ? VWhiteImageSource : VImageSource;

    return (
      <div>
        {isLoading ? (
          <AnimatedIcon {...this.props} src={isLoading ? LoadingImageSource : VImgSource} alt="Icon missing" />
        ) : (
          <StyledIcon {...this.props} src={isLoading ? LoadingImageSource : VImgSource} alt="Icon missing" />
        )}
      </div>
    );
  }
}
