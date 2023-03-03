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

  if (oldAddress) {
    filteredContacts = contacts.filter(
      (contact) => contact.address !== oldAddress
    );
  }

  const nicknameRegex = /^[a-zA-Z0-9_-]*$/;
  if (!nicknameRegex.test(nickname) || !nickname) {
    return {
      type: 'name',
      message: `Nickname: ${nickname} is missing or invalid`,
    };
  }
  if (
    filteredContacts.some(
      (contact) => contact.nickname.toLowerCase() === nickname.toLowerCase()
    )
  ) {
    return {
      type: 'name',
      message: `Nickname should be unique, ${nickname} already in contacts`,
    };
  }
  if (!validateAddress(address)) {
    return { type: 'address', message: `Address: ${address} is invalid` };
  }
  const repeatedAddress = filteredContacts.find(
    (contact) => contact.address === address
  );
  if (repeatedAddress) {
    return {
      type: 'address',
      message: `Contact ${repeatedAddress.nickname} has the same address`,
    };
  }
  return null;
};
