import React from "react";
import {Provider} from "react-redux";
import {applyMiddleware, combineReducers, legacy_createStore} from "redux";
import {v1} from "uuid";
import {TasksReducer} from "../reducers/TasksReducer";
import {TodoListsReducer} from "../reducers/TodoListsReducer";
import {TaskPriorities, TaskStatuses} from "../api/todolist-api";
import {AppReducer} from "../reducers/AppReducer";
import {AuthReducer} from "../reducers/AuthReducer";
import {RootReducerType} from "./store";
import thunkMiddleware from "redux-thunk";
import {configureStore} from "@reduxjs/toolkit";
import {HashRouter} from "react-router-dom";


const rootReducer: RootReducerType = combineReducers({
    tasks: TasksReducer,
    todoList: TodoListsReducer,
    app: AppReducer,
    auth: AuthReducer
})

type AppRootStateType = ReturnType<typeof rootReducer>

const initialGlobalState: AppRootStateType = {
    todoList: [
        {
            id: "todoListId1",
            title: "What to learn",
            filter: "All",
            addedDate: '',
            order: 0,
            entityStatus: "idle",
        },
        {
            id: "todoListId2",
            title: "What to buy",
            filter: "All",
            addedDate: '',
            order: 0,
            entityStatus: "idle",
        }
    ],
    tasks: {
        ["todoListId1"]: [
            {
                id: v1(),
                title: "HTML&CSS",
                status: TaskStatuses.Completed,
                description: '',
                todoListId: "todoListId1",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
            {
                id: v1(),
                title: "React",
                status: TaskStatuses.Completed,
                description: '',
                todoListId: "todoListId1",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            }
        ],
        ["todoListId2"]: [
            {
                id: v1(),
                title: "Milk",
                status: TaskStatuses.New,
                description: '',
                todoListId: "todoListId2",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            },
            {
                id: v1(),
                title: "Sugar",
                status: TaskStatuses.New,
                description: '',
                todoListId: "todoListId2",
                order: 0,
                priority: TaskPriorities.Low,
                startDate: '',
                deadline: '',
                addedDate: '',
            }
        ]
    },
    app: {
        error: null,
        status: 'idle',
        isInitialized: false
    },
    auth: {isLoggedIn: true}
};
export const storyBookStore = configureStore({
    reducer: rootReducer,
    preloadedState: initialGlobalState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleware)
})

export const ReduxStoreProviderDecorator = (storyFn: () => any) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>
}

export const BrowserRouterDecorator = (storyFn: () => any) => {
    return <HashRouter>{storyFn()}</HashRouter>
}