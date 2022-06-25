import {combineReducers} from "redux";
import {TasksReducer} from "../reducers/TasksReducer";
import {TodoListsReducer} from "../reducers/TodoListsReducer";
import thunkMiddleware from "redux-thunk";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {AppReducer} from "../reducers/AppReducer";
import {AuthReducer} from "../reducers/AuthReducer";
import {configureStore} from "@reduxjs/toolkit";

let rootReducer = combineReducers({
    tasks: TasksReducer,
    todoList: TodoListsReducer,
    app: AppReducer,
    auth: AuthReducer
})

// export const store = createStore(rootReducer, applyMiddleware(thunk))

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>getDefaultMiddleware().prepend(thunkMiddleware)
})

export type RootReducerType = typeof rootReducer
export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

// @ts-ignore
window.store = store