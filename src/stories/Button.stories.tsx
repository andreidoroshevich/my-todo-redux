import React from 'react';
import Button from "../common/components/Button";
import {ComponentMeta, ComponentStory} from "@storybook/react";
import {action} from "@storybook/addon-actions";

export default {
    title: 'Universal Button',
    component: Button,
    argsTypes: {
        title: {
            description: "Button title"
        },
        callBack: {
            description: "callback"
        },
        className: {
            description: 'optional parameter',
        },
        backgroundColor: {control: 'color'}
    }
} as ComponentMeta<typeof Button>

const Template: ComponentStory<typeof Button> = (args) => <Button {...args}/>

export const ButtonStory = Template.bind({})
ButtonStory.args = {
    callBack: action('callback'),
    title: 'Button'
}