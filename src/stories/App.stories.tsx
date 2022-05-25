import React from 'react';
import App from "../App";
import {ComponentMeta, ComponentStory} from "@storybook/react";
import {ReduxStoreProviderDecorator} from "../store/ReduxStoreProviderDecorator";

export default {
    title: 'App',
    component: App,
    decorators: [ReduxStoreProviderDecorator]
} as ComponentMeta<typeof App>

const Template: ComponentStory<typeof App> = (args) =><App/>

export const AppStory = Template.bind({})
AppStory.args = {}