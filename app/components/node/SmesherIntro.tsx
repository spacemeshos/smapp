import { shell } from 'electron';
import React from 'react';
import styled from 'styled-components';
import { Link, Button } from '../../basicComponents';
import { posIcon, fireworks, fireworksWhite, posNotification, posComputer, posAwake } from '../../assets/images';
import { smColors } from '../../vars';
import { eventsService } from '../../infra/eventsService';

const Fireworks = styled.img`
  width: 150px;
  height: 150px;
  margin-top: -25px;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 5px;
`;

const Text = styled.div`
  font-size: 13px;
  line-height: 15px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.realBlack)};
`;

const GreenText = styled.div`
  font-size: 15px;
  line-height: 17px;
  font-family: SourceCodeProBold;
  color: ${smColors.green};
  margin-bottom: 10px;
`;

const RedText = styled.div`
  font-size: 15px;
  line-height: 17px;
  font-family: SourceCodeProBold;
  color: ${smColors.red};
  margin-bottom: 10px;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
  align-items: flex-end;
`;

const PosNotificationIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 10px;
`;

const PosIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 10px;
`;

const PosComputerIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 10px;
`;

const PosAwakeIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 10px;
`;

const inlineLinkStyle = { display: 'inline', fontSize: '13px', lineHeight: '20px' };

type Props = {
  hideIntro: () => void;
  isDarkMode: boolean;
};

const SmesherIntro = ({ hideIntro, isDarkMode }: Props) => {
  const navigateToMiningGuide = () => eventsService.openExternalLink({ link: 'https://testnet.spacemesh.io/#/guide/setup' });

  const navigateToPreventComputerSleep = () => eventsService.openExternalLink({ link: 'https://testnet.spacemesh.io/#/no_sleep' });

  return (
    <>
      <Fireworks src={isDarkMode ? fireworksWhite : fireworks} />
      <GreenText>Your proof of space data is being created!</GreenText>
      <TextWrapper>
        <PosNotificationIcon src={posNotification} />
        <Text>You will get a desktop notification when the setup is complete</Text>
      </TextWrapper>
      <TextWrapper>
        <PosIcon src={posIcon} />
        <Text>Your app will start smeshing automatically when the setup is complete</Text>
      </TextWrapper>
      <br />
      <RedText>Important</RedText>
      <TextWrapper>
        <PosComputerIcon src={posComputer} />
        <Text>Leave your computer on 24/7 to finish setup and start smeshing</Text>
      </TextWrapper>
      <TextWrapper>
        <PosAwakeIcon src={posAwake} />
        <Text>
          <Link onClick={navigateToPreventComputerSleep} text="Disable your computer from going to sleep" style={inlineLinkStyle} />
        </Text>
      </TextWrapper>
      <Footer>
        <Link onClick={navigateToMiningGuide} text="SMESHING GUIDE" />
        <Button onClick={hideIntro} text="GOT IT" width={175} />
      </Footer>
    </>
  );
};

export default SmesherIntro;
