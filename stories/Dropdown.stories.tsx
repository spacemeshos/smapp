import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { formatISOAsUS } from '../shared/datetime';
import { DropDown } from '../app/basicComponents';

export default {
  title: 'Dropdown',
  component: DropDown,
} as ComponentMeta<typeof DropDown>;

const Template: ComponentStory<typeof DropDown> = (args) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  return (
    <DropDown
      {...args}
      selectedItemIndex={args.selectedItemIndex || selectedItemIndex}
      onClick={({ index }) => setSelectedItemIndex(index)}
    />
  );
};

export const SwitchNetworkDropdown = Template.bind({});
SwitchNetworkDropdown.args = {
  data: [
    {
      label: 'devnet224',
      genesisID: '0x91d338938929ec38e320ba558b6bd8538eae972d',
      isDisabled: false,
    },
    {
      label: 'devnet225',
      genesisID: '0x91d338938929ec38e320ba558b6bd8538eae9732',
      isDisabled: false,
    },
    {
      label: 'devnet226',
      genesisID: '0x91d338938929ec38e320ba558b6bd8538eae9753',
      isDisabled: true,
    },
  ],
  rowHeight: 40,
  isDisabled: false,
};

export const ThemeDropdown = Template.bind({});
ThemeDropdown.args = {
  data: [
    { label: 'Modern Dark', isMain: true },
    { label: 'Classic Dark' },
    { label: 'Classic Light' },
  ],
  rowHeight: 40,
  isDisabled: false,
};

export const DropdownFee = Template.bind({});
DropdownFee.args = {
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
};

export const UnlockWalletDropdown = Template.bind({});
UnlockWalletDropdown.args = {
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
};

export const TransactionsDropdown = Template.bind({});
TransactionsDropdown.args = {
  data: [
    { label: 'daily', isMain: true },
    { label: 'monthly' },
    { label: 'yearly' },
  ],
  rowHeight: 40,
  isDisabled: false,
};

export const ProofOfSpaceDropdown = Template.bind({});
ProofOfSpaceDropdown.args = {
  bold: true,
  data: [
    { label: '2 KB', size: 2048, numUnits: 2 },
    { label: '3 KB', size: 3072, numUnits: 3 },
    { label: '4 KB', size: 4096, numUnits: 4 },
  ],
  rowHeight: 40,
};

export const DailySpendingAccountDropdown = Template.bind({});
DailySpendingAccountDropdown.args = {
  data: [{ label: 'Daily spending' }],
  rowHeight: 40,
};

export const AccountsDropdown = Template.bind({});
AccountsDropdown.args = {
  data: [{ label: 'Main Account' }, { label: 'Account 1' }],
  rowHeight: 55,
};

export const ConnectToApiDropdown = Template.bind({});
ConnectToApiDropdown.args = {
  data: [{ label: 'Connect to API' }],
};
