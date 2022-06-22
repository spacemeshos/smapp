import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { formatISOAsUS } from '../shared/datetime';
import { smColors } from '../app/vars';
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
      isDarkMode={!!args.isDarkMode}
      bgColor={args.isDarkMode ? smColors.black : smColors.white}
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
  bgColor: smColors.white,
  isDarkMode: false,
  isDisabled: false,
  rowContentCentered: false,
  whiteIcon: false,
};

export const DropdownTheme = Template.bind({});
DropdownTheme.args = {
  data: [
    { label: 'Modern Dark', isMain: true },
    { label: 'Classic Dark' },
    { label: 'Classic Light' },
  ],
  rowHeight: 40,
  bgColor: smColors.white,
  isDarkMode: false,
  isDisabled: false,
  rowContentCentered: false,
  whiteIcon: false,
};

export const DropdownFee = Template.bind({});
DropdownFee.args = {
  data: [
    { label: '~ 10 min', description: '(FEE 1 Smidge)', isMain: true },
    { label: '~ 5 min', description: '(FEE 2 Smidge)' },
    { label: '~ 1 min', description: '(FEE 3 Smidge)' },
  ],
  rowHeight: 40,
  bgColor: smColors.white,
  isDarkMode: false,
  isDisabled: false,
  rowContentCentered: false,
  whiteIcon: false,
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
  bgColor: smColors.white,
  isDarkMode: false,
  isDisabled: false,
  rowContentCentered: false,
  whiteIcon: false,
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
  rowContentCentered: false,
  whiteIcon: false,
  isDarkMode: false,
};
