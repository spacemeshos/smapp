import React from 'react';
import styled from 'styled-components';
import {
  topLeftCorner,
  topRightCorner,
  bottomLeftCorner,
  bottomRightCorner,
  topLeftCornerWhite,
  topRightCornerWhite,
  bottomLeftCornerWhite,
  bottomRightCornerWhite
} from '../assets/images';

const Wrapper = styled.div`
  position: relative;
  margin: 8px;
`;

const TopLeftCorner = styled.img`
  position: absolute;
  top: -8px;
  left: -8px;
  width: 8px;
  height: 8px;
`;

const TopRightCorner = styled.img`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 8px;
  height: 8px;
`;

const BottomLeftCorner = styled.img`
  position: absolute;
  bottom: -8px;
  left: -8px;
  width: 8px;
  height: 8px;
`;

const BottomRightCorner = styled.img`
  position: absolute;
  bottom: -8px;
  right: -8px;
  width: 8px;
  height: 8px;
`;

type Props = {
  children: any;
  className?: string;
  isDarkMode?: boolean;
};

const CorneredWrapper = ({ children, className = '', isDarkMode = false }: Props) => {
  const topLeft = isDarkMode ? topLeftCornerWhite : topLeftCorner;
  const topRight = isDarkMode ? topRightCornerWhite : topRightCorner;
  const bottomLeft = isDarkMode ? bottomLeftCornerWhite : bottomLeftCorner;
  const bottomRight = isDarkMode ? bottomRightCornerWhite : bottomRightCorner;
  return (
    <Wrapper className={className}>
      <TopLeftCorner src={topLeft} />
      <TopRightCorner src={topRight} />
      <BottomLeftCorner src={bottomLeft} />
      <BottomRightCorner src={bottomRight} />
      {children}
    </Wrapper>
  );
};

export default CorneredWrapper;
