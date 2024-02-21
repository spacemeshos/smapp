import React from 'react';
import styled, { useTheme } from 'styled-components';
import { Element } from 'react-scroll';

const Wrapper = styled(Element)`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  padding: 30px;
  background-color: ${({ theme: { wrapper } }) => wrapper.color};
  ${({ theme }) => `border-radius: ${theme.box.radius}px;`}
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

const Header = styled.div`
  font-size: 42px;
  line-height: 55px;
  color: ${({ theme }) => theme.color.contrast};
`;

const SubHeader = styled.div`
  font-size: 20px;
  line-height: 30px;
  color: ${({ theme }) => theme.color.contrast};
  margin-bottom: 20px;
`;

type Props = {
  id?: string;
  title: string;
  children: any;
  name: string;
};

const SettingsSection = ({ name, title, id, children }: Props) => {
  const {
    icons: { corners },
  } = useTheme();
  const { topLeft } = corners;
  const { topRight } = corners;
  const { bottomLeft } = corners;
  const { bottomRight } = corners;
  return (
    <Wrapper name={name} id={id}>
      <Header>{title}</Header>
      <SubHeader>--</SubHeader>
      <TopLeftCorner src={topLeft} />
      <TopRightCorner src={topRight} />
      <BottomLeftCorner src={bottomLeft} />
      <BottomRightCorner src={bottomRight} />
      {children}
    </Wrapper>
  );
};

export default SettingsSection;
