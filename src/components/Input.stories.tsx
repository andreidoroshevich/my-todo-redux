import React from 'react';
import {Input} from "./Input";
import {ComponentMeta, ComponentStory} from "@storybook/react";
import {action} from "@storybook/addon-actions";

export default {
    title: 'Universal Input',
    component: Input,
    argsTypes: {
        setTitle: {
            description: "callback"
        },
        title: {
            description: "title"
        },
        addTaskButtonHandler: {
            description: "callback"
        },
        setError: {
            description: 'Error callback'
        },
        className: {
            description: 'optional parameter'
        }
    }
} as ComponentMeta<typeof Input>

const Template: ComponentStory<typeof Input> = (args) => <Input {...args}/>

export const InputStory = Template.bind({})
InputStory.args = {
    setError: action('setError'),
    setTitle: action('setTitle'),
    addTaskButtonHandler: action("addTaskButtonHandler"),
    title: ''
}