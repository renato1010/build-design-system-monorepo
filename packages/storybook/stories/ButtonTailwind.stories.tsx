import { TailwindButton } from '@renato1010/react/src/ButtonTailwind';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import '@renato1010/react/lib/output.css';

export default {
  title: 'renato1010/Tailwind Button',
  component: TailwindButton,
} as ComponentMeta<typeof TailwindButton>;

const Template: ComponentStory<typeof TailwindButton> = (args) => <TailwindButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Default',
};
