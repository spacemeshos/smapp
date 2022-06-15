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
  // eslint-disable-next-line react/display-name
  /* DdElement: ({ label, netId, ...props }: { label: string; netId: number }) => (
    <StyledDropDownItem {...props} key={label} uppercase>
      {netId > 0 ? (
        <>
          {label}
          (ID&nbsp;
          <a onClick={() => {}}>{netId}</a>)
        </>
      ) : (
        label
      )}
    </StyledDropDownItem>
  ), */
  rowHeight: 40,
  // style: {
  //   marginLeft: 'auto',
  // },
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
  // eslint-disable-next-line react/display-name
  // DdElement: ({ label, text }: { label: string; text: string }) => (
  //   <StyledDropDownItem key={label}>
  //     {label} {text}
  //   </StyledDropDownItem>
  // ),
  rowHeight: 40,
  // style: {
  //   marginLeft: 'auto',
  // },
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
  // eslint-disable-next-line react/display-name
  // DdElement: ({ label, text }: { label: string; text: string }) => (
  //   <StyledDropDownItem key={label}>
  //     {label} {text}
  //   </StyledDropDownItem>
  // ),
  rowHeight: 40,
  // style: {
  //   marginLeft: 'auto',
  //   flex: '0 0 240px',
  // },
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
      // path: 'path/to/wallet',
      // label: 'Wallett 3',
      // meta: {
      //   displayName: 'Main Wallet',
      //   created: '2022-06-17T12-31-45.467Z',
      //   type: 'local-node',
      //   netId: 224,
      // },
    },
  ],
  // eslint-disable-next-line react/display-name
  // DdElement: ({ label, meta }: { label: string; meta?: WalletMeta }) => (
  //   <StyledDropDownItem key={label} uppercase>
  //     {label}
  //     {meta && (
  //       <small>
  //         <br />
  //         CREATED: {formatISOAsUS(meta.created)}, NET ID: {meta.netId}
  //       </small>
  //     )}
  //   </StyledDropDownItem>
  // ),
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
  // eslint-disable-next-line react/display-name
  // DdElement: ({ label }) => <TimeSpanEntry>{label}</TimeSpanEntry>,
  rowHeight: 40,
  /* style: {
    width: 140,
    position: 'absolute',
    right: 12,
    top: 5,
    height: 41,
  }, */
  isDisabled: false,
  rowContentCentered: false,
  whiteIcon: false,
  isDarkMode: false,
};
