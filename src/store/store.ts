import {applyMiddleware, combineReducers, legacy_createStore as createStore} from "redux";
import {TasksActionType, TasksReducer} from "../reducers/TasksReducer";
import {TodoListsActionType, TodoListsReducer} from "../reducers/TodoListsReducer";
import thunk, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {useDispatch} from "react-redux";

let rootReducer = combineReducers({
    tasks: TasksReducer,
    todoList: TodoListsReducer
})

export const store = createStore(rootReducer, applyMiddleware(thunk))

export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppActionsType = TodoListsActionType | TasksActionType
export type AppThunkType <ReturnType = void> = ThunkAction<ReturnType,AppRootStateType, unknown, AppActionsType>

export const useAppDispatch = () => useDispatch<ThunkDispatch<AppRootStateType, unknown, AppActionsType>>()

// @ts-ignore
window.store = store