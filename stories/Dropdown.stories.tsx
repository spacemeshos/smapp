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

export const DropdownSwitchNetwork = Template.bind({});
DropdownSwitchNetwork.args = {
  data: [
    { label: 'devnet224', netId: -1, isDisabled: false },
    { label: 'devnet225', netId: -1, isDisabled: false },
    { label: 'devnet226', netId: -1, isDisabled: true },
  ],
  rowHeight: 40,
  isDisabled: false,
};

export const DropdownTheme = Template.bind({});
DropdownTheme.args = {
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

export const DropdownWallets = Template.bind({});
DropdownWallets.args = {
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

export const DropdownTransactions = Template.bind({});
DropdownTransactions.args = {
  data: [
    { label: 'daily', isMain: true },
    { label: 'monthly' },
    { label: 'yearly' },
  ],
  rowHeight: 40,
  isDisabled: false,
};
