import {applyMiddleware, combineReducers, legacy_createStore as createStore} from "redux";
import {TasksActionType, TasksReducer} from "../reducers/TasksReducer";
import {TodoListsActionType, TodoListsReducer} from "../reducers/TodoListsReducer";
import thunk, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {AppReducer} from "../reducers/AppReducer";

let rootReducer = combineReducers({
    tasks: TasksReducer,
    todoList: TodoListsReducer,
    app: AppReducer
})

export const store = createStore(rootReducer, applyMiddleware(thunk))

export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppActionsType = TodoListsActionType | TasksActionType
export type AppThunkType <ReturnType = void> = ThunkAction<ReturnType,AppRootStateType, unknown, AppActionsType>

export const useAppDispatch = () => useDispatch<ThunkDispatch<AppRootStateType, unknown, AppActionsType>>()
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

// @ts-ignore
window.store = store