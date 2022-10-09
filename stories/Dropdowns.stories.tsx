import React, { useState } from 'react';
import { Story, ComponentMeta } from '@storybook/react';
import styled from 'styled-components';
import { AutocompleteDropdownProps } from 'app/basicComponents/AutocompleteDropdown';
import { formatISOAsUS } from '../shared/datetime';
import { DropDown, AutocompleteDropdown } from '../app/basicComponents';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

type DropdownArgs = {
  data: {
    [k: string]: any;
    isDisabled?: boolean;
    isMain?: boolean;
  }[];
  rowHeight?: number;
  isDisabled?: boolean;
  selectedItemIndex?: number;
  bold?: boolean;
  isDarkMode?: boolean;
}[];

const DROPDOWN_ARGUMENTS: DropdownArgs = [
  {
    data: [
      { label: 'devnet224', netId: -1, isDisabled: false },
      { label: 'devnet225', netId: -1, isDisabled: false },
      { label: 'devnet226', netId: -1, isDisabled: true },
    ],
    rowHeight: 40,
    isDisabled: false,
  },
  {
    data: [
      { label: 'Modern Dark', isMain: true },
      { label: 'Classic Dark' },
      { label: 'Classic Light' },
    ],
    rowHeight: 40,
    isDisabled: false,
  },
  {
    data: [
      {
        fee: 1,
        label: '~ 10 min (FEE 1 Smidge)',
      },
      {
        fee: 2,
        label: '~ 5 min (FEE 2 Smidge)',
      },
      {
        fee: 3,
        label: '~ 1 min (FEE 3 Smidge)',
      },
    ],
    rowHeight: 40,
    isDisabled: false,
  },
  {
    data: [
      {
        label: 'Wallett 1',
        description: `CREATED: ${formatISOAsUS(
          '2022-06-17T12-31-45.467Z'
        )}, NET ID: ${224}`,
      },
      {
        label: 'Wallett 2',
        description: `CREATED: ${formatISOAsUS(
          '2022-06-17T12-31-45.467Z'
        )}, NET ID: ${224}`,
      },
      {
        label: 'Wallett 3',
        description: `CREATED: ${formatISOAsUS(
          '2022-06-17T12-31-45.467Z'
        )}, NET ID: ${224}`,
      },
    ],
    rowHeight: 50,
    isDisabled: false,
  },
  {
    data: [
      { label: 'daily', isMain: true },
      { label: 'monthly' },
      { label: 'yearly' },
    ],
    rowHeight: 40,
    isDisabled: false,
    isDarkMode: true,
  },
  {
    bold: true,
    data: [
      { label: '2 KB', size: 2048, numUnits: 2 },
      { label: '3 KB', size: 3072, numUnits: 3 },
      { label: '4 KB', size: 4096, numUnits: 4 },
    ],
    rowHeight: 40,
    isDarkMode: true,
  },
  {
    data: [{ label: 'Daily spending' }],
    rowHeight: 40,
  },
  {
    data: [{ label: 'Connect to API' }],
  },
];

const AUTOCOMPLETE_DROPDOWN_ARGUMENTS = {
  id: 'address',
  name: 'address',
  placeholder: 'Address',

  data: [
    { address: '0x3ac7f5c37d5f24f52c05a59af9d5700135d55315', nickname: 'my6' },
    { address: '0x3ac7f5c37d5f24f52c05a59af9d5700135d55311', nickname: 'my1' },
  ],
  isDarkModeOn: true,
  autofocus: true,
  getItemValue: (item: { address: string }) => item.address,
};

export default {
  title: 'Dropdown',
} as ComponentMeta<any>;

const DropdownTemplate: Story<{
  dropdownArgs: DropdownArgs;
  autocompleteDropdownArgs: Omit<
    AutocompleteDropdownProps,
    'value' | 'onChange' | 'onEnter'
  >;
}> = ({ dropdownArgs, autocompleteDropdownArgs }) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [value, setValue] = useState<string>('');

  return (
    <Container>
      {Object.values(dropdownArgs).map((i, index: number) => (
        <DropDown
          {...i}
          key={index}
          selectedItemIndex={i.selectedItemIndex || selectedItemIndex}
          onClick={({ index }) => setSelectedItemIndex(index)}
        />
      ))}
      <AutocompleteDropdown
        {...autocompleteDropdownArgs}
        value={value}
        onChange={(value) => setValue(value)}
        onEnter={(value) => setValue(value)}
      />
    </Container>
  );
};

export const AllDropdowns = DropdownTemplate.bind({});
AllDropdowns.args = {
  dropdownArgs: DROPDOWN_ARGUMENTS,
  autocompleteDropdownArgs: AUTOCOMPLETE_DROPDOWN_ARGUMENTS,
};
