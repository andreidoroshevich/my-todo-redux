import React from 'react';
import {EditableSpan} from "../common/components/EditableSpan";
import {ComponentMeta, ComponentStory} from "@storybook/react";
import {action} from "@storybook/addon-actions";

export default {
    title: 'EditableSpan',
    component: EditableSpan,
    argsTypes: {
        title: {
            description: "title"
        },
        onChange: {
            description: "callback"
        },
    },
} as ComponentMeta<typeof EditableSpan>

const Template: ComponentStory<typeof EditableSpan> = (args) => <EditableSpan {...args}/>

export const EditableSpanStory = Template.bind({})
EditableSpanStory.args = {
    title: "React TS",
    onChange: action('onChange')
}