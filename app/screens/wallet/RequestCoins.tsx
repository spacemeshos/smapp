import React, { useState } from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { captureReactBreadcrumb } from '../../sentry';
import CopyButton from '../../basicComponents/CopyButton';
import { Link, Button, BoldText } from '../../basicComponents';
import { smColors } from '../../vars';
import { MainPath } from '../../routerPaths';
import { ExternalLinks } from '../../../shared/constants';
import { Account } from '../../../shared/types';
import { getNetworkTapBotDiscordURL } from '../../redux/network/selectors';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 710px;
  height: 100%;
  padding: 15px 25px;
  background-color: ${({ theme: { wrapper } }) => wrapper.color};
  ${({ theme }) => `border-radius: ${theme.box.radius}px;`}
`;

const Header = styled(BoldText)`
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme: { color } }) => color.primary};
`;

const SubHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;
`;

const Text = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${({ theme: { color } }) => color.primary};
  cursor: inherit;
`;

const TextElement = styled.span`
  font-size: 16px;
  line-height: 22px;
  color: ${({ theme: { color } }) => color.primary};
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

const CopiedText = styled(Text)`
  margin-left: 8px;
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
  const netowrkTabBotUrl = useSelector(getNetworkTapBotDiscordURL);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const navigateToNodeSetup = () => {
    history.push(MainPath.SmeshingSetup);
    captureReactBreadcrumb({
      category: 'Request Coins',
      data: {
        action: 'Click link set up smeshing',
      },
      level: 'info',
    });
  };

  const navigateToGuide = () => {
    window.open(ExternalLinks.GetCoinGuide);
    captureReactBreadcrumb({
      category: 'Request Coins',
      data: {
        action: 'Click link request SMH guide',
      },
      level: 'info',
    });
  };

  const navigateToTap = () => {
    window.open(netowrkTabBotUrl);
    captureReactBreadcrumb({
      category: 'Request Coins',
      data: {
        action: 'Click link testnet tap',
      },
      level: 'info',
    });
  };

  const navigateToCopy = (val) => {
    setIsCopied(Boolean(val));
    captureReactBreadcrumb({
      category: 'Request Coins',
      data: {
        action: 'Click copy button',
      },
      level: 'info',
    });
  };

  const navigateToDone = () => {
    history.replace(MainPath.Wallet);
    captureReactBreadcrumb({
      category: 'Request Coins',
      data: {
        action: 'Click done button',
      },
      level: 'info',
    });
  };

  return (
    <Wrapper>
      <Header>
        Request SMH
        <br />
        <br />
        --
      </Header>
      <SubHeader>
        <Text>Here&apos;s your Account address:</Text>
        <CopyButton
          value={account.address}
          hideCopyIcon={isCopied}
          onClick={navigateToCopy}
        >
          <AddressWrapper>
            <AddressText>{account.address}</AddressText>
            {isCopied && <CopiedText>Copied!</CopiedText>}
          </AddressWrapper>
        </CopyButton>
      </SubHeader>
      <Text>* This address is public and safe to share.</Text>
      <Text>* Send it to anyone you want to request SMH from.</Text>
      {netowrkTabBotUrl && (
        <ComplexText>
          <Text>* You may also paste this address in the&nbsp;</Text>
          <Link
            onClick={navigateToTap}
            text="Testnet Tap"
            style={{ fontSize: 16, lineHeight: '22px' }}
          />
          <TextElement>.</TextElement>
        </ComplexText>
      )}
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
        <Button onClick={navigateToDone} text="DONE" />
      </Footer>
    </Wrapper>
  );
};

export default RequestCoins;
