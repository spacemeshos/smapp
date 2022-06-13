import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Button } from '../app/basicComponents';

export default {
  title: 'Button',
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const DemoButton = Template.bind({});
DemoButton.args = {
  text: 'Demo button',
};
