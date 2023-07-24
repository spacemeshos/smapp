import { Contact } from 'shared/types';
import { FocusEventHandler } from 'react';
import { validateAddress } from '../../infra/utils';

export type ValidateError = {
  type: 'address' | 'name';
  message: string;
};

export const handleInputFocus: FocusEventHandler<HTMLInputElement> = (event) =>
  event.target.focus();

export const validate = (
  nickname: string,
  address: string,
  contacts: Contact[],
  oldAddress?: string
): ValidateError | null => {
  let filteredContacts = contacts;
  const trimmedAddress = address.trim();

  if (oldAddress) {
    filteredContacts = contacts.filter(
      (contact) => contact.address !== oldAddress
    );
  }
  const trimmedNickname = nickname.trim();

  const nicknameRegex = /^[a-zA-Z0-9_-]*$/;
  if (!nicknameRegex.test(trimmedNickname) || !trimmedNickname) {
    return {
      type: 'name',
      message: `Nickname: ${trimmedNickname} is missing or invalid`,
    };
  }
  if (
    filteredContacts.some(
      (contact) =>
        contact.nickname.toLowerCase() === trimmedNickname.toLowerCase()
    )
  ) {
    return {
      type: 'name',
      message: `Nickname should be unique, ${trimmedNickname} already in contacts`,
    };
  }
  if (!validateAddress(trimmedAddress)) {
    return {
      type: 'address',
      message: `Address: ${trimmedAddress} is invalid`,
    };
  }
  const repeatedAddress = filteredContacts.find(
    (contact) => contact.address === trimmedAddress
  );
  if (repeatedAddress) {
    return {
      type: 'address',
      message: `Contact ${repeatedAddress.nickname} has the same address`,
    };
  }
  return null;
};
