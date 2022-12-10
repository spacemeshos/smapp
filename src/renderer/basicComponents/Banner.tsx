import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div<{ margin: string; visible: boolean }>`
  flex: 0 0 60px;
  position: relative;
  width: 785px;
  height: 60px;
  margin: ${({ margin }) => margin};
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
`;

const UpperPart = styled.div<{ color: string }>`
  position: absolute;
  top: 0;
  left: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: calc(100% - 5px);
  height: 55px;
  background-color: ${({ color }) => color};
  z-index: 1;
  ${({
    theme: {
      box: { radius },
    },
  }) => `
  border-radius: ${radius}px;`}
`;

const LowerPart = styled.div<{ color: string }>`
  position: absolute;
  top: 5px;
  left: 0;
  width: calc(100% - 5px);
  height: 55px;
  border: 1px solid
    ${({ theme: { themeName }, color }) =>
      themeName === 'modern' ? 'transparent' : color};
`;

type Props = {
  children: React.ReactNode;
  visibility?: boolean;
  margin?: string;
  color: string;
};

const Banner = ({
  children,
  visibility = true,
  margin = '0',
  color,
}: Props) => (
  <Wrapper margin={margin} visible={visibility}>
    <UpperPart color={color}>{children}</UpperPart>
    <LowerPart color={color} />
  </Wrapper>
);

export default Banner;
