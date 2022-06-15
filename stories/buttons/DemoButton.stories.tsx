import React from 'react';
import { Story } from '@storybook/react';

export default {
  title: 'Button',
};

const Template: Story<{ label: string }> = ({ label }) => (
  <button type="button">{label}</button>
);

export const DemoButton = Template.bind({});
DemoButton.args = {
  label: 'Demo button',
};
