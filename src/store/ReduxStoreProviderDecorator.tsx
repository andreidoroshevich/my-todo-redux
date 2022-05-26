import React from "react";
import {Provider} from "react-redux";
import {combineReducers, legacy_createStore} from "redux";
import {v1} from "uuid";
import {TasksReducer} from "../reducers/TasksReducer";
import {TodoListsReducer} from "../reducers/TodoListsReducer";
import {AppRootStateType} from "./store";
import {TaskPriorities, TaskStatuses} from "../api/todolist-api";


const rootReducer = combineReducers({
    tasks: TasksReducer,
    todoList: TodoListsReducer
})

const initialGlobalState:AppRootStateType = {
    todoList: [
        {
            id: "todoListId1",
            title: "What to learn",
            filter: "All",
            addedDate: '',
            order: 0,
        },
        {
            id: "todoListId2",
            title: "What to buy",
            filter: "All",
            addedDate: '',
            order: 0,
        }
    ] ,
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
    }
};
export const storyBookStore = legacy_createStore(rootReducer, initialGlobalState);

export const ReduxStoreProviderDecorator = (storyFn: ()=>React.ReactNode)=>{

return <Provider store={storyBookStore}>{storyFn()}</Provider>

}