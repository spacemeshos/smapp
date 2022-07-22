import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.img.attrs(
  ({
    theme: {
      icons: { horizontalPanel },
    },
  }) => ({ src: horizontalPanel })
)`
  position: absolute;
  top: -25px;
  right: 0px;
  width: 60px;
  height: 15px;
  transform: ${({ theme }) => (theme.isDarkMode ? `scale(-1, 1)` : `none`)};
`;

const SmallHorizontalPanel = () => <Wrapper />;

export default SmallHorizontalPanel;
