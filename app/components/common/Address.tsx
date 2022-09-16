import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled, { keyframes, useTheme } from 'styled-components';

import { HexString } from '../../../shared/types';
import {
  ensure0x,
  getAbbreviatedAddress,
  getAbbreviatedText,
  getAddress,
} from '../../infra/utils';
import { RootState } from '../../types';
import { smColors } from '../../vars';
import { addContact, explorer } from '../../assets/images';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
`;

const PublicKey = styled.div<{ isCopied: boolean }>`
  align-self: center;
  line-height: 1.466;
  cursor: inherit;
  white-space: nowrap;

  span {
    visibility: ${(props) => props.isCopied && 'hidden'};
  }
`;

const CopyIcon = styled.img.attrs(({ theme: { icons } }) => ({
  src: icons.copy,
}))`
  align-self: center;
  width: 16px;
  height: 15px;
  margin: 0 3px;
  cursor: pointer;
  &:hover {
    opacity: 0.5;
  }
  &:active {
    transform: translate3d(2px, 2px, 0);
  }
`;
const fadeInOut = keyframes`
  0% { opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { opacity: 0; }
`;
const CopiedBanner = styled.div`
  position: absolute;
  z-index: 10;
  line-height: 1.466;
  color: ${smColors.darkerGreen};
  animation: 3s ${fadeInOut} ease-out;
`;

const ExplorerIcon = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-top: 2px;
`;

const AddToContactsImg = styled.img`
  width: 14px;
  height: 12px;
  cursor: pointer;
  margin-left: 4px;
`;

// Enum representation is used in explorer link and to show an address in a better way
export enum AddressType {
  ACCOUNT = 'accounts',
  REWARD = 'rewards',
  VAULTS = 'apps',
  SMESHER = 'smeshers',
  TX = 'txs',
}

type Props = {
  isHex?: boolean; // If it represents HexString, instead of Bech32 Address
  address: HexString;
  suffix?: string | null; // Additional suffix to the shown address. E.G. nickname
  overlapText?: string | null; // If set — used instead of address + suffix
  type?: AddressType; // Used to show an address properly and to compose an explorer URL. Default: ACCOUNT
  full?: boolean; // Full length address or abbreviated. Default: false (abbreviated).
  hideCopy?: boolean; // Hide copy icon. Default: false
  hideExplorer?: boolean; // Hide explorer icon. Default: false
  addToContacts?: ({ address }: { address: string }) => void; // If function exists — it shows up add contact icon. Default: undefined
};

const Address = (props: Props) => {
  const {
    isHex,
    address,
    suffix,
    overlapText,
    type,
    full,
    hideCopy,
    hideExplorer,
    addToContacts,
  } = props;

  const isAccount = type === AddressType.ACCOUNT;
  const addr = isHex
    ? ensure0x(isAccount ? getAddress(address) : address)
    : address;
  const abbr = isHex ? getAbbreviatedText : getAbbreviatedAddress;

  const { isDarkMode } = useTheme();
  const explorerUrl = useSelector(
    (state: RootState) => state.network.explorerUrl
  );
  const [isCopied, setIsCopied] = useState(false);

  const addressToShow = full ? addr : abbr(addr);

  let copyTimeout: NodeJS.Timeout;
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(addr);
    setIsCopied(true);
    clearTimeout(copyTimeout);
    copyTimeout = setTimeout(() => setIsCopied(false), 3000);
  };
  const handleExplorer = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(
      explorerUrl.concat(`${type}/${addr}${isDarkMode ? '?dark' : ''}`)
    );
  };

  const handleAddToContacts = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToContacts && addToContacts({ address: addr });
  };

  const textToShow =
    overlapText || (suffix ? `${addressToShow} ${suffix}` : addressToShow);

  return (
    <Wrapper>
      <PublicKey isCopied={isCopied}>
        {isCopied && <CopiedBanner>Copied</CopiedBanner>}
        <span>{textToShow}</span>
      </PublicKey>
      {!hideCopy && <CopyIcon onClick={handleCopy} />}
      {!hideExplorer && (
        <ExplorerIcon src={explorer} onClick={handleExplorer} />
      )}
      {addToContacts && isAccount && (
        <AddToContactsImg src={addContact} onClick={handleAddToContacts} />
      )}
    </Wrapper>
  );
};

Address.defaultProps = {
  type: AddressType.ACCOUNT,
  full: false,
  hideCopy: false,
  hideExplorer: false,
};

export default Address;
