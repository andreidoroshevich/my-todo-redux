import React from 'react';
import App from "../App";
import {ComponentMeta, ComponentStory} from "@storybook/react";
import {BrowserRouterDecorator, ReduxStoreProviderDecorator} from "../store/ReduxStoreProviderDecorator";

export default {
    title: 'App',
    component: App,
    decorators: [ReduxStoreProviderDecorator, BrowserRouterDecorator]
} as ComponentMeta<typeof App>

const Template: ComponentStory<typeof App> = (args) =><App/>

export const AppStory = Template.bind({})
AppStory.args = {}