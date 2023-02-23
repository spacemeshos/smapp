import React from 'react';
import styled, { keyframes, useTheme } from 'styled-components';

import ExplorerButton from '../../basicComponents/ExplorerButton';
import CopyButton from '../../basicComponents/CopyButton';
import { Bech32Address, HexString } from '../../../shared/types';
import {
  ensure0x,
  getAbbreviatedAddress,
  getAbbreviatedText,
  getAddress,
} from '../../infra/utils';
import { smColors } from '../../vars';
import { addContact } from '../../assets/images';

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
  addToContacts?: (address: Bech32Address) => void; // If function exists — it shows up add contact icon. Default: undefined
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
  const [isCopied, setIsCopied] = React.useState<boolean>(false);
  const isAccount = type === AddressType.ACCOUNT;
  const addr = isHex
    ? ensure0x(isAccount ? getAddress(address) : address)
    : address;
  const abbr = isHex ? getAbbreviatedText : getAbbreviatedAddress;

  const { isDarkMode } = useTheme();

  const addressToShow = full ? addr : abbr(addr);

  const handleAddToContacts = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToContacts && addToContacts(addr);
  };

  const textToShow =
    overlapText || (suffix ? `${addressToShow} ${suffix}` : addressToShow);

  return (
    <Wrapper>
      <PublicKey isCopied={isCopied}>
        {isCopied && <CopiedBanner>Copied</CopiedBanner>}
        <span>{textToShow}</span>
      </PublicKey>
      {!hideCopy && (
        <CopyButton
          onClick={(val) => setIsCopied(Boolean(val))}
          value={address}
        />
      )}
      {!hideExplorer && (
        <ExplorerButton isDarkMode={isDarkMode} address={addr} type={type} />
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
