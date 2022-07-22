import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
`;

const TopLeftCorner = styled.img.attrs(
  ({
    theme: {
      icons: {
        corners: { topLeft },
      },
    },
  }) => ({
    src: { topLeft },
  })
)`
  position: absolute;
  top: -10px;
  left: -10px;
  width: 8px;
  height: 8px;
`;

const TopRightCorner = styled.img.attrs(
  ({
    theme: {
      icons: {
        corners: { topRight },
      },
    },
  }) => ({
    src: { topRight },
  })
)`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 8px;
  height: 8px;
`;

const BottomLeftCorner = styled.img.attrs(
  ({
    theme: {
      icons: {
        corners: { bottomLeft },
      },
    },
  }) => ({
    src: { bottomLeft },
  })
)`
  position: absolute;
  bottom: -10px;
  left: -10px;
  width: 8px;
  height: 8px;
`;

const BottomRightCorner = styled.img.attrs(
  ({
    theme: {
      icons: {
        corners: { bottomRight },
      },
    },
  }) => ({
    src: { bottomRight },
  })
)`
  position: absolute;
  bottom: -10px;
  right: -10px;
  width: 8px;
  height: 8px;
`;

type Props = {
  children: any;
  className?: string;
};

const CorneredWrapper = ({ children, className = '' }: Props) => {
  return (
    <Wrapper className={className}>
      <TopLeftCorner />
      <TopRightCorner />
      <BottomLeftCorner />
      <BottomRightCorner />
      {children}
    </Wrapper>
  );
};

export default CorneredWrapper;
