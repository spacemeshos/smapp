import React from 'react';
import styled from 'styled-components';
import { logo, logoWhite } from '../../assets/images';
import { eventsService } from '../../infra/eventsService';

const LogoImg = styled.img`
  position: absolute;
  top: 5px;
  left: 15px;
  width: 130px;
  height: 40px;
  cursor: pointer;
`;

type Props = {
  isDarkMode: boolean;
};

const Logo = ({ isDarkMode }: Props) => <LogoImg src={isDarkMode ? logoWhite : logo} onClick={() => eventsService.openExternalLink({ link: 'https://spacemesh.io' })} />;

export default Logo;
