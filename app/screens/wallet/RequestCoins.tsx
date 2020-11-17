import { clipboard, shell } from 'electron';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router-dom';
import { Link, Button } from '../../basicComponents';
import { getAddress } from '../../infra/utils';
import { copyBlack, copyWhite } from '../../assets/images';
import { smColors, nodeConsts } from '../../vars';
import { Account, RootState } from '../../types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 710px;
  height: 100%;
  padding: 15px 25px;
  background-color: ${({ theme }) => (theme.isDarkMode ? smColors.dmBlack2 : smColors.black02Alpha)};
`;

const Header = styled.div`
  font-family: SourceCodeProBold;
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
`;

const SubHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;
`;

const Text = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
  cursor: inherit;
`;

const TextElement = styled.span`
  font-size: 16px;
  line-height: 22px;
  color: ${({ theme }) => (theme.isDarkMode ? smColors.white : smColors.black)};
  cursor: inherit;
`;

const AddressWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
`;

const AddressText = styled(Text)`
  color: ${smColors.blue};
  text-decoration: underline;
`;

const CopyIcon = styled.img`
  width: 16px;
  height: 15px;
  margin: 0 10px;
  cursor: inherit;
`;

const CopiedText = styled(Text)`
  font-family: SourceCodeProBold;
  color: ${smColors.green};
`;

const ComplexText = styled.div`
  display: flex;
  flex-direction: row;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: space-between;
  align-items: flex-end;
`;

interface Props extends RouteComponentProps {
  location: {
    hash: string;
    pathname: string;
    search: string;
    state: { account: Account; miningStatus: number };
  };
}

const RequestCoins = ({ history, location }: Props) => {
  let copiedTimeout: any = null;
  const {
    state: { account, miningStatus }
  } = location;

  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    clipboard.writeText(`0x${getAddress(account.publicKey)}`);
    return () => {
      clearTimeout(copiedTimeout);
    };
  });

  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  const copy = isDarkMode ? copyWhite : copyBlack;

  const copyPublicAddress = () => {
    clipboard.writeText(`0x${getAddress(account.publicKey)}`);
    copiedTimeout = setTimeout(() => setIsCopied(false), 3000);
    setIsCopied(true);
  };

  const navigateToNodeSetup = () => {
    history.push('/main/node-setup');
  };

  const navigateToGuide = () => shell.openExternal('https://testnet.spacemesh.io/#/get_coin');

  const navigateToTap = () => shell.openExternal('https://discord.gg/ASpy52C');

  return (
    <Wrapper>
      <Header>
        Request SMH
        <br />
        --
      </Header>
      <SubHeader>
        <Text>Request SMH by sharing your wallet&apos;s address:</Text>
        <AddressWrapper onClick={copyPublicAddress}>
          <AddressText>{`0x${getAddress(account.publicKey)}`}</AddressText>
          <CopyIcon src={copy} />
          {isCopied && <CopiedText>Copied!</CopiedText>}
        </AddressWrapper>
      </SubHeader>
      <Text>* This address is public and safe to share with anyone.</Text>
      <Text>* Send this address to anyone you want to receive Smesh from.</Text>
      <ComplexText>
        <Text>* You may also paste this address in the&nbsp;</Text>
        <Link onClick={navigateToTap} text="Testnet Tap" style={{ fontSize: 16, lineHeight: '22px' }} />
        <TextElement>.</TextElement>
      </ComplexText>
      <br />
      {miningStatus === nodeConsts.NOT_MINING && (
        <ComplexText>
          <Text>To earn Smesh&nbsp;</Text>
          <Link onClick={navigateToNodeSetup} text="set up Smeshing" style={{ fontSize: 16, lineHeight: '22px' }} />
          <TextElement>.</TextElement>
        </ComplexText>
      )}
      <Footer>
        <Link onClick={navigateToGuide} text="REQUEST SMH GUIDE" />
        <Button onClick={history.goBack} text="DONE" />
      </Footer>
    </Wrapper>
  );
};

export default RequestCoins;
