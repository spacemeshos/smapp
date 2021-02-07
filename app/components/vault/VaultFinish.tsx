import React from 'react';
import styled from 'styled-components';
import { smColors } from '../../vars';
import { vault, circle, wallet, fireworksWhite, fireworks } from '../../assets/images';

const DetailsRow = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: end;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
  margin-bottom: 15px;
`;

const Icon = styled.img`
  width: 15px;
  height: 15px;
  margin-right: 15px;
`;

const Fireworks = styled.img`
  width: 150px;
  height: 150px;
  margin-top: -25px;
`;
const GreenText = styled.div`
  font-size: 16px;
  line-height: 20px;
  margin: 15px 0 30px 0;
  color: ${smColors.green};
`;

type Props = {
  isDarkMode: boolean;
};

const VaultFinish = ({ isDarkMode }: Props) => (
  <>
    <Fireworks src={isDarkMode ? fireworksWhite : fireworks} />
    <GreenText>Your new vault transaction has been submitted to the mesh and is being created.</GreenText>
    <DetailsRow>
      <Icon src={circle} />
      Track creation progress in your transactions log.
    </DetailsRow>
    <DetailsRow>
      <Icon src={wallet} />
      Your new vault will be added to in your wallet’s accounts.
    </DetailsRow>
    <DetailsRow>
      <Icon src={vault} />
      To work with your new vault, select it from your wallet’s accounts list drop-down (left side).
    </DetailsRow>
  </>
);

export default VaultFinish;
