import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router-dom';
import { Link, Button, BoldText } from '../../basicComponents';
import { getAddress } from '../../infra/utils';
import { smColors } from '../../vars';
import { Account } from '../../../shared/types';
import { MainPath } from '../../routerPaths';
import { ExternalLinks } from '../../../shared/constants';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 710px;
  height: 100%;
  padding: 15px 25px;
  background-color: ${({ theme }) =>
    theme.isDarkMode ? smColors.dmBlack2 : smColors.black02Alpha};
  ${({ theme }) => `border-radius: ${theme.box.radius}px;`}
`;

const Header = styled(BoldText)`
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

const CopyIcon = styled.img.attrs(({ theme: { icons: { copy } } }) => ({
  src: copy,
}))`
  width: 16px;
  height: 15px;
  margin: 0 10px;
  cursor: inherit;
`;

const CopiedText = styled(Text)`
  font-weight: 800;
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
    state: { account: Account; isSmesherActive: boolean };
  };
}

const RequestCoins = ({ history, location }: Props) => {
  const {
    state: { account, isSmesherActive },
  } = location;

  const [isCopied, setIsCopied] = useState(false);

  let copiedTimeout = 0;
  const copyPublicAddress = async () => {
    await navigator.clipboard.writeText(`0x${getAddress(account.publicKey)}`);
    clearTimeout(copiedTimeout);
    copiedTimeout = window.setTimeout(() => setIsCopied(false), 3000);
    setIsCopied(true);
  };

  useEffect(() => {
    window.document.hasFocus() && copyPublicAddress();
  });

  const navigateToNodeSetup = () => {
    history.push(MainPath.SmeshingSetup);
  };

  const navigateToGuide = () => window.open(ExternalLinks.GetCoinGuide);

  const navigateToTap = () => window.open(ExternalLinks.DiscordTapAccount);

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
          <CopyIcon />
          {isCopied && <CopiedText>Copied!</CopiedText>}
        </AddressWrapper>
      </SubHeader>
      <Text>* This address is public and safe to share with anyone.</Text>
      <Text>* Send this address to anyone you want to receive Smesh from.</Text>
      <ComplexText>
        <Text>* You may also paste this address in the&nbsp;</Text>
        <Link
          onClick={navigateToTap}
          text="Testnet Tap"
          style={{ fontSize: 16, lineHeight: '22px' }}
        />
        <TextElement>.</TextElement>
      </ComplexText>
      <br />
      {!isSmesherActive && (
        <ComplexText>
          <Text>To earn Smesh&nbsp;</Text>
          <Link
            onClick={navigateToNodeSetup}
            text="set up Smeshing"
            style={{ fontSize: 16, lineHeight: '22px' }}
          />
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
